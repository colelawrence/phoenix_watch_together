defmodule Rumbl.Auth do
  import Plug.Conn

  def init(opts) do
    Keyword.fetch! opts, :repo
  end

  def call(conn, repo) do
    user_id = get_session conn, :user_id
    
    cond do
      user = conn.assigns[:current_user] ->
        put_current_user(conn, user)
      user = user_id && repo.get Rumbl.User, user_id ->
        put_current_user(conn, user)
      true ->
        assign(conn, :current_user, nil)
    end
  end

  defp put_current_user(conn, user) do
    token = Phoenix.Token.sign(conn, "user socket", user.id)
    conn
    |> assign(:current_user, user)
    |> assign(:user_token, token)
  end

  import Phoenix.Controller
  alias Rumbl.Router.Helpers

  def authenticate_user(conn, _opts) do
    if conn.assigns.current_user do
      conn
    else
      conn
      |> put_flash(:error, "You must be logged in to access")
      |> redirect(to: Helpers.page_path(conn, :index))
      |> halt()
    end
  end

  def login(conn, user) do
    conn
    |> put_current_user(user)
    |> put_session(:user_id, user.id)
    |> configure_session(renew: true)
  end

  def logout(conn) do
    conn
    |> configure_session(drop: true)
  end

  import Comeonin.Bcrypt, only: [checkpw: 2, dummy_checkpw: 0]

  def login_by_username_and_pass(conn, username, given_password, opts) do
    repo = Keyword.fetch! opts, :repo
    user = repo.get_by Rumbl.User, username: username

    cond do
      user && checkpw(given_password, user.password_hash) ->
        {:ok, login(conn, user)}

      user ->
        {:error, :unauthorized, conn}

      true ->
        # dummy password check to mitigate timing attacks
        dummy_checkpw()
        {:error, :not_found, conn}
    end
  end

end