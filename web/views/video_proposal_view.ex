defmodule Rumbl.GroupVideoProposalView do
  use Rumbl.Web, :view

  def render("group_video_proposal.json", %{group_video_proposal: vp}) do
    %{
      id: vp.id,
      yt_id: vp.yt_id,
      score: vp.score,
      group_id: vp.group_id,
      user_id: vp.user_id,
    }
  end
end
