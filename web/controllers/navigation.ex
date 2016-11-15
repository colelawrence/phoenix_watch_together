
# This module gives every page the variables for navigation links
# This includes the categories
defmodule Rumbl.Navigation do
  import Plug.Conn

  def init(opts) do
    Keyword.fetch! opts, :repo
  end

  def call(conn, repo) do
    load_categories conn, repo
  end

  alias Rumbl.Category
  defp load_categories(conn, repo) do
    query =
      Category
      |> Category.alphabetical
      |> Category.names_and_ids
    # here, I was very tempted to just chain everything together
    # so, it would be categories = \ Category |> alpha |> names_and_ids |> Repo.all
    # but, this seemed to be a little bit too much, in terms of understnading what is going on
    # by separating the code we get a clear picture of how the algorithm is sectioned out.
    categories = repo.all query

    conn
    |> assign(:current_categories, categories)
    # now available at conn.assigns.categories
  end
end