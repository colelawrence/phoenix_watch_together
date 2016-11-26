defmodule Rumbl.GroupController do
  use Rumbl.Web, :controller
  plug :authenticate_user

  alias Rumbl.Group
  alias Rumbl.GroupUser
  alias Rumbl.User

  def action(conn, _) do
    apply(__MODULE__, action_name(conn),
          [conn, conn.params, conn.assigns.current_user])
  end

  def index(conn, _params, user) do
    # groups = Repo.all(Group)
    render(conn, "index.html")
  end

  def new(conn, _params, user) do
    changeset = Group.changeset(%Group{})
    render(conn, "new.html", changeset: changeset)
  end

  def create(conn, %{"group" => group_params}, user) do
    changeset = Group.changeset(%Group{}, group_params)
    case Repo.insert(changeset) do
      {:ok, group} ->
        group_user_cs =
          user
          |> build_assoc(:groups)
          |> GroupUser.changeset(%{
            group: group
          })

        group_user = Repo.insert!(group_user_cs)

        conn
        |> put_flash(:info, "Group created successfully.")
        |> redirect(to: group_path(conn, :index))

      {:error, changeset} ->
        render(conn, "new.html", changeset: changeset)
    end
  end

  def edit(conn, %{"id" => id}, user) do
    group = Repo.get!(Group, id)
    changeset = Group.changeset(group)
    render(conn, "edit.html", group: group, changeset: changeset)
  end

  def update(conn, %{"id" => id, "group" => group_params}, user) do

    case Repo.one(from gu in GroupUser,
                  where: gu.group_id == ^id,
                  where: gu.user_id == ^user.id,
                  limit: 1) do
      {:ok, _group_user} ->
        group = Repo.get!(Group, id)
        changeset = Group.changeset(group, group_params)
        case Repo.update(changeset) do
          {:ok, group} ->
            conn
            |> put_flash(:info, "Group updated successfully.")
            |> redirect(to: group_path(conn, :show, group))
          {:error, changeset} ->
            render(conn, "edit.html", group: group, changeset: changeset)
        end
      {:error, _no_exist} ->
        conn
        |> put_flash(:error, "You must be a member of the group to update it!")
        |> redirect(to: group_path(conn, :show, group))
    end
  end

  import Ecto.Query

  def delete(conn, %{"id" => id}, user) do
    case Repo.one(from gu in GroupUser,
                  where: gu.group_id == ^id,
                  where: gu.user_id == ^user.id,
                  limit: 1) do
      {:ok, _group_user} ->
        group = Repo.get!(Group, id)
        Repo.delete!(group)
        render(conn, "group.json", group: group)
      {:error, _no_exist} ->
        render(conn, "error.json", reason: "You must be a member of the group to delete it!")
    end
  end
end
