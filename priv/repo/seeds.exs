# Script for populating the database. You can run it as:
#
#     mix run priv/repo/seeds.exs
#
# Inside the script, you can read and write to any of your
# repositories directly:
#
#     Rumbl.Repo.insert!(%Rumbl.SomeModel{})
#
# We recommend using the bang functions (`insert!`, `update!`
# and so on) as they will fail if something goes wrong.

alias Rumbl.Repo
alias Rumbl.Category

for category <- ~w(Action Drama Romance Comedy Sci-fi Education) do
  # Either it exists, or run the insert
  # This is interesting, because if it exists, then the existing Category
  # is returned by this loop, and outputted.
  Repo.get_by(Category, name: category) ||
    Repo.insert! %Category{name: category}
end
