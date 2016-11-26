defmodule Rumbl.UserFBAuthTest do
  use Rumbl.ModelCase

  alias Rumbl.UserFBAuth

  @valid_attrs %{expires: 42, fb_id: "some content", fb_token: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = UserFBAuth.changeset(%UserFBAuth{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = UserFBAuth.changeset(%UserFBAuth{}, @invalid_attrs)
    refute changeset.valid?
  end
end
