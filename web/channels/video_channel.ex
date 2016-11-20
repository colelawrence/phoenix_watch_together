defmodule Rumbl.VideoChannel do
  use Rumbl.Web, :channel

  def join("videos:" <> video_id, _params, socket) do
    {:ok, socket}
  end

  # incoming from client
  def handle_in("new_annotation", params, socket) do
    # /3(socket, name of event, and payload)
    broadcast! socket, "new_annotation", %{
      user: %{username: "anon"},
      body: params["body"],
      at: params["at"],
    }

    {:reply, :ok, socket}
  end
end
