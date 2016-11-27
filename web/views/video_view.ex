defmodule Rumbl.VideoView do
  use Rumbl.Web, :view

  def render("video.json", %{video: vd}) do
    %{
      id: vd.id,
      yt_id: vd.url,
      name: vd.title,
      thumb: vd.description,
    }
  end
end
