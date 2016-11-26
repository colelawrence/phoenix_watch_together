defmodule Rumbl.PingChannel do
  use Rumbl.Web, :channel

  def join("ping", _params, socket) do
    resp = %{
      message: "Alive and well"
    }

    IO.puts "handle join"
    {:ok, resp, socket}
  end

  def join(_event, _params, _socket), do: :error

  def handle_in(event, params, socket) do
    user = Repo.get(Rumbl.User, socket.assigns.user_id)
    IO.puts "handle in #{event}"
    handle_in(event, params, user, socket)
  end

  def handle_in("ping", _params, user, socket) do
    resp = %{
      message: "Doing well #{user.first_name}"
    }

    push socket, "pong", resp

    {:noreply, socket}
  end
end
