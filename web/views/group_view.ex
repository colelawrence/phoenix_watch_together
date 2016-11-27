defmodule Rumbl.GroupView do
  use Rumbl.Web, :view

  def render("group.json", %{group: group}) do
    group =
      group
      |> Rumbl.Repo.preload(:video)
      |> Rumbl.Repo.preload(:users)
    
    %{
      id: group.id,
      name: group.name,
      listed: group.listed,
      group_users: Phoenix.View.render_many(
        group.users, Rumbl.GroupUserView, "group_user.json"
      ),
      video: Phoenix.View.render_one(
        group.video, Rumbl.VideoView, "video.json"
      ),
      started_at: nil # TODO add to schema and update with each change in video
    }
  end
end
