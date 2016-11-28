defmodule Rumbl.GroupUserView do
  use Rumbl.Web, :view

  def render("group_user.json", %{group_user: group_user}) do
    %{
      user_id: group_user.user_id,
      group_id: group_user.group_id,
    }
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
