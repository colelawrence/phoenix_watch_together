defmodule Rumbl.MessageView do
  use Rumbl.Web, :view

  def render("message.json", %{message: msg}) do
    %{
      id: msg.id,
      body: msg.body,
      user_id: msg.user_id
    }
  end
end
