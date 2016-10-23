defmodule Rumbl.Repo do
  # use Ecto.Repo, otp_app: :rumbl
  @moduledoc """
  In memory repository
  """

  def all(Rumbl.User) do
    [
      %Rumbl.User{id: "1", name: "Cole Lawrence", username: "cole", password: "elixir"},
      %Rumbl.User{id: "2", name: "Luke Baker", username: "luke", password: "emily"},
      %Rumbl.User{id: "3", name: "Thomas Vernon", username: "thomas", password: "docs"},
      %Rumbl.User{id: "4", name: "Zach LaMarre", username: "zach", password: "sketch"}
    ]
  end
  def all(_module), do: []

  def get(module, id) do
    Enum.find all(module), fn map -> map.id == id end
  end
  def get_by(module, params) do
    Enum.find all(module), fn map ->
      Enum.all?(params, fn {key, value} -> Map.get(map, key) == value end)
    end
  end
end
