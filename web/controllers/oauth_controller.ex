defmodule Rumbl.OAuthController do
  use Rumbl.Web, :controller

  def show(conn, %{"id" => "fb", "code" => code}) do
    IO.puts "oauth code"
    # This is what facebook gives our app to complete request
    IO.puts code

    # TODO get information about this code and insert it into the database
    # If it doesn't already exist, then bollocks.

    conn
    |> put_flash(:info, "Attempt was made")
    |> redirect(to: session_path(conn, :new))
  end
end
