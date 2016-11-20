defmodule Rumbl.CategoryController do
  use Rumbl.Web, :controller

  alias Rumbl.Video

  alias Rumbl.Category

  def index(conn, _params) do
    render(conn, "index.html")
  end

  def show(conn, %{"id" => id}) do
    category = Repo.get! Category, id
    videos = Repo.all(category_videos(id))
    render(conn, "show.html", videos: videos, category: category)
  end

  defp category_videos(category_id) do
    from v in Video, where: v.category_id == ^category_id
  end
end
