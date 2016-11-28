defmodule Rumbl.GroupView do
  use Rumbl.Web, :view

  def render("group.json", %{group: group}) do
    group =
      group
      |> Rumbl.Repo.preload(:group_video_proposal)
      |> Rumbl.Repo.preload(:users)
    
    %{
      id: group.id,
      name: group.name,
      listed: group.listed,

      # Player state is tracked and updated for group
      started_at: group.started_at,
      paused_at: group.paused_at,
      is_playing: group.is_playing,

      group_users: Phoenix.View.render_many(
        group.users, Rumbl.GroupUserView, "group_user.json"
      ),
      # currently playing proposal
      group_video_proposal: Phoenix.View.render_one(
        group.group_video_proposal, Rumbl.GroupVideoProposalView, "group_video_proposal.json"
      ),
    }
  end
end
