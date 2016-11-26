defmodule Rumbl.OAuthController do
  use Rumbl.Web, :controller

  # Redirect URL for Facebook to hand our server an access code to retrieve the token with
  def show(conn, %{"id" => "fb", "code" => code}) do
    # This is what facebook gives our app to complete request
    cid = Application.get_env(:rumbl, :facebook)[:client_id]
    sec = Application.get_env(:rumbl, :facebook)[:client_secret]
    redir = Application.get_env(:rumbl, :facebook)[:redirect_uri]

    case Facebook.accessToken(cid, sec, redir, code) do
      %{ "access_token" => access_token, "expires_in" => expires_in } ->
        case Rumbl.Auth.create_user_with_facebook(conn, access_token, expires_in, repo: Rumbl.Repo) do
          {:ok, user = %Rumbl.User{ first_name: name, age_min: age_min, age_max: age_max, gender: gender }} ->
            # TODO get information about this code and insert it into the database
            # If it doesn't already exist, then bollocks.
            conn
            |> Rumbl.Auth.login(user)
            |> put_flash(:info, "Welcome #{name}! We think you are #{age_min}-#{age_max}/#{gender}")
            |> redirect(to: page_path(conn, :index))

          {:error, reasons} ->
            cond do
              is_list(reasons) ->
                conn
                |> put_flash(:error, "Unable to log in, #{reasons}")
                |> redirect(to: session_path(conn, :new))
              true ->
                IO.inspect "Error logging in with facebook"
                IO.inspect reasons
                conn
                |> put_flash(:error, "Unable to log in :,-(")
                |> redirect(to: session_path(conn, :new))
            end
        end
        
      %{ "error" => %{ "message" => message } } ->
        conn
        |> put_flash(:info, "Please attempt to login again")
        |> put_flash(:error, message)
        |> redirect(to: session_path(conn, :new))
      
      _ ->
        conn
        |> put_flash(:info, "Please attempt to login again, we had an unexpected difficulty logging you in.")
        |> redirect(to: session_path(conn, :new))
    end

  end

  def get_fb_login_url do
    cid = Application.get_env(:rumbl, :facebook)[:client_id]
    redir = Application.get_env(:rumbl, :facebook)[:redirect_uri]
    "https://www.facebook.com/v2.8/dialog/oauth?response_type=code&client_id=#{cid}&redirect_uri=#{redir}"
  end
end
