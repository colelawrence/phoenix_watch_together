defmodule Rumbl.CategoryController do
  use Rumbl.Web, :controller

  alias Rumbl.Video

  alias Rumbl.Category
  plug :load_categories when action in [:show, :index]
  defp load_categories(conn, _) do
    query =
      Category
      |> Category.alphabetical
      |> Category.names_and_ids
    # here, I was very tempted to just chain everything together
    # so, it would be categories = \ Category |> alpha |> names_and_ids |> Repo.all
    # but, this seemed to be a little bit too much, in terms of understnading what is going on
    # by separating the code we get a clear picture of how the algorithm is sectioned out.
    categories = Repo.all query

    conn
    |> assign(:categories, categories)
    # now available at conn.assigns.categories
  end

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
