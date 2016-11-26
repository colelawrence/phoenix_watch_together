defmodule Rumbl.SessionView do
  use Rumbl.Web, :view

  defp get_facebook_login_url do
    Rumbl.OAuthController.get_fb_login_url()
  end
end
