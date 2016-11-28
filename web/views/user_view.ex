defmodule Rumbl.UserView do
  use Rumbl.Web, :view
  alias Rumbl.User

  def first_name(%User{name: name}) do
    name
    |> String.split(" ")
    |> Enum.at(0)
  end

  def render("user.json", %{user: user}) do
    %{id: user.id, first_name: user.first_name}
  end

  def render("video_proposal.json", %{proposal: vp}) do
    %{
      id: vp.id,
      yt_id: vp.yt_id,
      score: vp.score,
      user_id: vp.user_id,
    }
  end
end
