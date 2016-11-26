defmodule Rumbl.GroupView do
  use Rumbl.Web, :view

  def render("group.json", %{group: group}) do
    %{
      id: group.id,
      name: group.name,
      listed: group.listed,
    }
  end

  def render("error.json", %{reason: reason}) do
    %{
      error: reason
    }
  end

  def render("message.json", %{message: msg}) do
    %{
      id: msg.id,
      body: msg.body,
      posted_by: render_one(msg.posted_by, Rumbl.UserView, "user.json")
    }
  end

  def render("video_proposal.json", %{proposal: vp}) do
    %{
      id: vp.id,
      yt_id: vp.yt_id,
      score: vp.score,
      proposed_by: render_one(vp.proposed_by, Rumbl.UserView, "user.json"),
    }
  end
end
