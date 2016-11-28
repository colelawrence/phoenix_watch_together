defmodule Rumbl.GroupVideoProposalView do
  use Rumbl.Web, :view

  def render("group_video_proposal.json",
      %{
        group_video_proposal: vp = %Rumbl.GroupVideoProposal{}
      }) do

    vp = Rumbl.Repo.preload vp, :video

    %{
      id: vp.id,
      score: vp.score,
      played_at: vp.played_at,
      group_id: vp.group_id,
      user_id: vp.user_id,
      video: render_one(vp.video, Rumbl.VideoView, "video.json"),
    }
  end
end
