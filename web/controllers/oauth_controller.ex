defmodule Rumbl.OAuthController do
  use Rumbl.Web, :controller

  def show(conn, %{"id" => "fb", "code" => code}) do
    IO.puts "oauth code"
    # This is what facebook gives our app to complete request
    cid = Application.get_env(:rumbl, :facebook)[:client_id]
    sec = Application.get_env(:rumbl, :facebook)[:client_secret]
    redir = Application.get_env(:rumbl, :facebook)[:redirect_uri]

    case Facebook.accessToken(cid, sec, redir, code) do
      %{ "access_token" => access_token, "expires_in" => expires_in } ->
        IO.puts access_token
        IO.puts expires_in

        {:json, %{"id" => fb_id,
          "first_name" => fname,
          "gender" => gender,
          "age_range" => %{ "max" => max_age, "min" => min_age }}} =
          Facebook.me([fields: "id,first_name,gender,age_range"], access_token)

        # TODO get information about this code and insert it into the database
        # If it doesn't already exist, then bollocks.
        conn
        |> put_flash(:info, "Welcome #{fname}! We think you are #{fb_id}@#{min_age}-#{max_age}/#{gender}")
        |> redirect(to: page_path(conn, :index))
        
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
