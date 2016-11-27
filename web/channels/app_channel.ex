defmodule Rumbl.AppChannel do
  use Rumbl.Web, :channel

  def join("app", _params, socket) do
    cond do
    socket.assigns.user_id ->
      youtube_client_key = Application.get_env(:rumbl, :google)[:youtube_client_key]

      resp = %{
        ytkey: youtube_client_key
      }

      {:ok, resp, socket}
    true ->
      {:error, %{reason: "Not logged in"}, socket}
    end
  end

  def join(_event, _params, _socket), do: :error
end
