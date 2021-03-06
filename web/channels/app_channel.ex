defmodule Rumbl.AppChannel do
  use Rumbl.Web, :channel

  alias Rumbl.GroupView
  alias Rumbl.UserView
  alias Rumbl.User
  def join("app", _params, socket) do
    cond do
    socket.assigns.user_id ->
      youtube_client_key = Application.get_env(:rumbl, :google)[:youtube_client_key]

      user = Repo.get! User, socket.assigns.user_id
      {:ok, groups, _group_users, users} = get_groups(socket.assigns.user_id)


      resp = %{
        ytkey: youtube_client_key,
        user: Phoenix.View.render_one(
          user, UserView, "user.json"
        ),
        groups: Phoenix.View.render_many(
          groups, GroupView, "group.json"
        ),
        users: Phoenix.View.render_many(
          users, UserView, "user.json"
        ),
      }

      {:ok, resp, socket}
    true ->
      {:error, %{reason: "Not logged in"}, socket}
    end
  end

  def join(_event, _params, _socket), do: :error

  def handle_in(event, params, socket) do
    user_id = socket.assigns.user_id
    handle_in(event, params, user_id, socket)
  end

  def handle_in("leave_group", %{"groupId" => groupId}, user_id, socket) do
    IO.puts "#{user_id} attempting to leave #{groupId}"
    {:noreply, socket}
  end

  alias Rumbl.Repo
  alias Rumbl.GroupUser
  alias Rumbl.Group
  alias Rumbl.User
  import Ecto.Query

  defp get_groups(user_id) do
    group_ids = Repo.all from gu in GroupUser,
        where: gu.user_id == ^user_id,
        select: gu.group_id

    # gather all users in your groups
    group_users = Repo.all from gu in GroupUser,
        where: gu.group_id in ^group_ids
    
    # gather all users
    user_ids = group_users
      |> Enum.map fn(%GroupUser{ user_id: uid }) -> uid end

    users = Repo.all from u in User,
        where: u.id in ^user_ids

    groups = Repo.all from g in Group,
        where: g.id in ^group_ids

    {:ok, groups, group_users, users}
  end
end
