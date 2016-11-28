defmodule Rumbl.VideoView do
  use Rumbl.Web, :view

  def render("video.json", %{video: vd}) do
    %{
      id: vd.id,
      yt_id: vd.yt_id,
      name: vd.name,
      thumb: vd.thumb,
      description: vd.description,
    }
  end
end
