defmodule Rumbl.AuthTest do
  use Rumbl.ConnCase
  alias Rumbl.Auth

  # Not all the functions are available to our units
  # For example, we are missing the :current_user, if e didn't manually assign it
  # or we don't have the `call fetch_session/2` that our auth needs.
  # For this, we setup a bypass_through helper which can provide those helpers to us.
  setup %{conn: conn} do
    conn =
      conn
      |> bypass_through(Rumbl.Router, :browser)
      |> get("/")

    # I think this second element is used for all the tests' second argument
    {:ok, %{conn: conn}}
  end

  test "authentication_user halts when no current_user exists",
      %{conn: conn} do
    conn =
      conn
      |> assign(:current_user, nil)
      |> Auth.authenticate_user([])

    assert conn.halted
  end

  test "authentication_user continues when current_user exists",
      %{conn: conn} do
    conn =
      conn
      |> assign(:current_user, %Rumbl.User{})
      |> Auth.authenticate_user([])
    refute conn.halted
  end

  @valid_user_id 123
  test "login puts the user in the session", %{conn: conn} do
    login_conn =
      conn
      |> Auth.login(%Rumbl.User{id: @valid_user_id})
      |> send_resp(:ok, "")
    
    next_conn = get login_conn, "/"
    assert get_session(next_conn, :user_id) == @valid_user_id
  end

  test "logout drops the session", %{conn: conn} do
    logout_conn =
      conn
      |> put_session(:user_id, @valid_user_id)
      |> Auth.logout()
      |> send_resp(:ok, "")

    next_conn = get logout_conn, "/"
    refute get_session(next_conn, :user_id)
  end

  test "call places user from session into assigns", %{conn: conn} do
    user = insert_user()
    conn =
      conn
      |> put_session(:user_id, user.id)
      |> Auth.call(Repo)
    
    assert conn.assigns.current_user.id == user.id
  end

  test "call with no session assigns current_user to nil", %{conn: conn} do
    conn = Auth.call(conn, Repo)

    assert conn.assigns.current_user == nil
  end

  test "login with a valid username and password", %{conn: conn} do
    user = insert_user(username: "hello", password: "goodbye")
    {:ok, conn} = Auth.login_by_username_and_pass(conn, "hello", "goodbye", repo: Repo)

    assert conn.assigns.current_user.id == user.id
  end

  test "login with an invalid password", %{conn: conn} do
    insert_user(username: "hello", password: "goodbye")
    assert {:error, :unauthorized, _conn} = Auth.login_by_username_and_pass(conn, "hello", "incorrect_password", repo: Repo)
  end

  test "login with an invalid username", %{conn: conn} do
    assert {:error, :not_found, _conn} = Auth.login_by_username_and_pass(conn, "hello", "goodbye", repo: Repo)
  end
end