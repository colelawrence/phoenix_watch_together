defmodule Rumbl.GroupUserTest do
  use Rumbl.ModelCase

  alias Rumbl.GroupUser

  @valid_attrs %{}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GroupUser.changeset(%GroupUser{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GroupUser.changeset(%GroupUser{}, @invalid_attrs)
    refute changeset.valid?
  end
end
