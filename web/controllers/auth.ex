defmodule Rumbl.Auth do
  import Plug.Conn

  def init(opts) do
    Keyword.fetch! opts, :repo
  end

  def call(conn, repo) do
    user_id = get_session conn, :user_id

    IO.puts "Currently logged in as:"
    IO.puts user_id

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

  alias Rumbl.User
  import Ecto

  defp update_user_info_from_facebook(user, access_token, expires_in) do
    {:json, %{"id" => fb_id,
      "name" => name,
      "first_name" => first_name,
      "gender" => gender,
      "age_range" => %{ "max" => age_max, "min" => age_min }}} =
      Facebook.me([fields: "id,name,first_name,gender,age_range"], access_token)

    user
      |> User.changeset(%{
          fb_id: fb_id,
          fb_token: access_token,
          fb_expires: :os.system_time(:millisecond) + expires_in,
          name: name,
          first_name: first_name,
          age_min: age_min,
          age_max: age_max,
          gender: gender,
        })
  end

  def create_user_with_facebook(access_token, expires_in, opts) do
    {:json, %{"id" => fb_id}} =
      Facebook.me([fields: "id"], access_token)
    
    repo = Keyword.fetch! opts, :repo

    user = repo.get_by User, fb_id: fb_id
    cond do
      user ->
        IO.puts "You have an account!!!!@@@@@"
        IO.inspect user

        {:ok, user}
      true ->
        # New User log in
        user_changeset =
          %User{}
          |> update_user_info_from_facebook(access_token, expires_in)

        case repo.insert(user_changeset) do
          {:ok, user} ->
            IO.puts "Success!!!!!@@@@@"
            IO.inspect user
            {:ok, user}

          {:error, changeset} ->
            {:error, changeset}
        end
    end
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