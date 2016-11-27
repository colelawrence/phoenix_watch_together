defmodule Rumbl.GroupChannel do
  use Rumbl.Web, :channel

  alias Rumbl.GroupView
  alias Rumbl.UserView
  def join("groups:" <> group_id, _params, socket) do
    { group_id, _ } = :string.to_integer(to_char_list(group_id))
    cond do
    socket.assigns.user_id ->
      {:ok, group, users} = get_group(socket.assigns.user_id, group_id)

      resp = %{
        group: Phoenix.View.render_one(
          group, GroupView, "group.json"
        ),
        users: Phoenix.View.render_many(
          users, UserView, "user.json"
        )
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

  defp get_group(user_id, group_id) do
    # invalid group? fail fast
    group = Repo.get! Group, group_id

    # gather all users in your groups
    group_users = Repo.all from gu in GroupUser,
        where: gu.group_id == ^group.id
    
    # gather all users
    user_ids = group_users
      |> Enum.map fn(%GroupUser{ user_id: uid }) -> uid end

    users = Repo.all from u in User,
        where: u.id in ^user_ids

    {:ok, group, users}
  end
end
