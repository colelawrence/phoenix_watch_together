defmodule Rumbl.GroupChannel do
  use Rumbl.Web, :channel

  def join("groups:" <> group_id, params, socket) do
    last_seen_message_id = params["last_seen_message_id"] || 0
    group_id = String.to_integer(group_id)

    cond do
    socket.assigns.user_id ->
      {:ok, group, users} = get_group(group_id)

      messages = Repo.all(
        from m in assoc(group, :messages),
          where: m.id > ^last_seen_message_id,
          order_by: [asc: m.id],
          limit: 200
      )

      proposals = Repo.all(
        from p in group_proposals_query(group),
          limit: 200
      )

      resp = %{
        group: Phoenix.View.render_one(
          group, Rumbl.GroupView, "group.json"
        ),
        users: Phoenix.View.render_many(
          users, Rumbl.UserView, "user.json"
        ),
        messages: Phoenix.View.render_many(
          messages, Rumbl.MessageView, "message.json"
        ),
        proposals: Phoenix.View.render_many(
          proposals, Rumbl.GroupVideoProposalView, "group_video_proposal.json"
        ),
      }

      {:ok, resp, assign(socket, :group_id, group_id)}
    true ->
      {:error, %{reason: "Not logged in"}, socket}
    end
  end

  def join(_event, _params, _socket), do: :error

  alias Rumbl.Repo
  alias Rumbl.GroupUser
  alias Rumbl.Group
  alias Rumbl.User
  import Ecto.Query

  def handle_in(event, params, socket) do
    user_id = socket.assigns.user_id
    group = Repo.get!(Group, socket.assigns.group_id)
    handle_in(event, params, group, user_id, socket)
  end

  alias Rumbl.GroupMessage
  def handle_in("new_message", %{"message" => %{ "body" => body }}, group, user_id, socket) do
    changeset =
      group
      |> build_assoc(:messages, user_id: user_id)
      |> GroupMessage.changeset(%{
        body: body
      })

    case Repo.insert changeset do
      {:ok, message} ->
        broadcast! socket, "new_message", %{
          message: Phoenix.View.render_one(
            message, Rumbl.MessageView, "message.json"
          )
        }

        {:reply, :ok, socket}
      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  alias Rumbl.GroupVideoProposal
  alias Rumbl.GroupVPVote
  alias Rumbl.Video
  def handle_in("cast_vote_proposal", %{"proposal_id" => proposal_id, "weight" => weight}, group, user_id, socket) do
    # Next get the vote by its associations
    proposal = Repo.get! group_proposals_query(group), proposal_id

    vote = Repo.get_by GroupVPVote, user_id: user_id, group_id: group.id, proposal_id: proposal.id

    # if it does not exist, then insert it into GroupVPVote!
    vote = if is_nil(vote) do
      changeset =
        group
        |> build_assoc(:proposal_votes, user_id: user_id, proposal_id: proposal.id)
        |> GroupVPVote.changeset(%{
          weight: 0
        })

      Repo.insert! changeset
    else vote end

    changeset =
      vote
      |> GroupVPVote.changeset(%{
        weight: weight
      })

    case Repo.update changeset do
      {:ok, _vote} ->
        update_proposal_scores!(proposal)

        broadcast_updated_proposals!(socket, group)

        # I haven't built a view for votes yet... So, I'm lazy
        # {:reply, {:ok, vote}, socket}
        {:reply, :ok, socket}
      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  def handle_in("play_next_video", _params, group, user_id, socket) do
    # Get the highest scoring (not archived) proposal for this group
    highest_proposal = Repo.one(
      from p in group_proposals_query(group), limit: 1
    )

    if is_nil(highest_proposal) do
      {:reply, {
          :error,
          %{ errors: [{:no_next, "No available next video to play"}] }
        }, socket}

    else
      # Set it as the currently playing video
      group_changeset =
        group
        |> Group.changeset(%{
          group_video_proposal_id: highest_proposal.id,
          started_at: Ecto.DateTime.utc,
          is_playing: true,
        })

      group = Repo.update! group_changeset

      # Set the played_at field of the group_video_proposal so it ceases to appear in update_proposal_scores!/1
      proposal_changeset =
        highest_proposal
        |> GroupVideoProposal.changeset(%{
          played_at: Ecto.DateTime.utc
        })

      highest_proposal = Repo.update! proposal_changeset

      # Delete associated votes (retaining the scores)
      Repo.delete_all from v in GroupVPVote,
        where: v.proposal_id == ^highest_proposal.id

      # Spread the good news
      broadcast_updated_playing! socket, group

      # If we want to keep track of the things that users like,
      # we might have another table of historically voted _videos_ as opposed to just votes.
      # Though the intent of this approach is for performance, I'm not all confident if it would be our best choice.
      {:reply, :ok, socket}
    end
  end

  def handle_in("propose_video", %{"video" => %{ "yt_id" => yt_id, "name" => name, "thumb" => thumb, "description" => description }}, group, user_id, socket) do
    
    # Next get the video by its yt_id,
    video = Repo.get_by Video, yt_id: yt_id

    # if it does not exist, then insert it into Video!
    video = if is_nil(video) do
      changeset = %Video{}
        |> Video.changeset(%{
          yt_id: yt_id,
          name: name,
          thumb: thumb,
          description: description,
        })
      
      Repo.insert! changeset
    else video end

    changeset =
      group
      |> build_assoc(:proposals, user_id: user_id, video_id: video.id)
      |> GroupVideoProposal.changeset(%{
        score: 0
      })

    case Repo.insert changeset do
      {:ok, proposal} ->
        broadcast_updated_proposals!(socket, group)

        resp = %{
          proposal: Phoenix.View.render_one(
            proposal, Rumbl.GroupVideoProposalView, "group_video_proposal.json"
          )
        }

        {:reply, {:ok, resp}, socket}
      {:error, changeset} ->
        {:reply, {:error, %{errors: changeset}}, socket}
    end
  end

  defp group_proposals_query(group = %Group{}) do
    from p in assoc(group, :proposals),
        # remove played videos from results
        where: is_nil(p.played_at),
        order_by: [desc: p.score, asc: p.id]
  end

  def update_proposal_scores!(proposal) do
    aggregate = Repo.one(
      from v in GroupVPVote,
        where: v.proposal_id == ^proposal.id,
        select: sum(v.weight)
    )

    aggregate = aggregate || 0

    if proposal.score != aggregate do
      changeset =
        proposal
        |> GroupVideoProposal.changeset(%{
          score: aggregate
        })
      
      Repo.update! changeset
    end
  end

  defp broadcast_updated_proposals!(socket, group) do
    proposals = Repo.all(
      from p in group_proposals_query(group),
        preload: [:video],
        limit: 200
    )

    broadcast! socket, "update_proposals", %{
      proposals: Phoenix.View.render_many(
        proposals, Rumbl.GroupVideoProposalView, "group_video_proposal.json"
      ),
    }
  end

  defp broadcast_updated_playing!(socket, group = %Group{}) do
    %Group{ group_video_proposal: proposal } = Repo.preload group, :group_video_proposal

    broadcast! socket, "update_playing", %{
      playing: Phoenix.View.render_one(
        proposal, Rumbl.GroupVideoProposalView, "group_video_proposal.json"
      ),
    }

    broadcast_updated_proposals! socket, group
    broadcast_updated_player_state! socket, group
  end

  defp broadcast_updated_player_state!(socket, %Group{ is_playing: is_playing, paused_at: paused_at, started_at: started_at }) do
    if is_playing do
      broadcast! socket, "update_player_play", %{
        started_at: started_at
      }
    else
      broadcast! socket, "update_player_pause", %{
        paused_at: paused_at
      }
    end
  end

  defp get_group(group_id) do
    # invalid group? fail fast
    group = Repo.get! Group, group_id

    # gather all users in your groups
    group_users = Repo.all from gu in GroupUser,
        where: gu.group_id == ^group.id
    
    # gather all users
    user_ids = group_users
      |> Enum.map(fn(%GroupUser{ user_id: uid }) -> uid end)

    users = Repo.all from u in User,
        where: u.id in ^user_ids

    {:ok, group, users}
  end
end
