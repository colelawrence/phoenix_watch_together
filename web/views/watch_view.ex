defmodule Rumbl.WatchView do
  use Rumbl.Web, :view

  alias Rumbl.Video

  def player_id(%Video{yt_id: video_url}) do
    ~r{^.*(?:youtu\.be/|\w+/|v=)(?<id>[^#&?]*)}
    |> Regex.named_captures(video_url)
    |> get_in(["id"])
  end
end
