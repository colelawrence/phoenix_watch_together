defmodule Rumbl.GroupVPVoteTest do
  use Rumbl.ModelCase

  alias Rumbl.GroupVPVote

  @valid_attrs %{weight: 42}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GroupVPVote.changeset(%GroupVPVote{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GroupVPVote.changeset(%GroupVPVote{}, @invalid_attrs)
    refute changeset.valid?
  end
end
