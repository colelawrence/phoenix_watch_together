defmodule Rumbl.GroupMessageTest do
  use Rumbl.ModelCase

  alias Rumbl.GroupMessage

  @valid_attrs %{body: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GroupMessage.changeset(%GroupMessage{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GroupMessage.changeset(%GroupMessage{}, @invalid_attrs)
    refute changeset.valid?
  end
end
