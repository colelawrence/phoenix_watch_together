defmodule Rumbl.GroupVideoProposalTest do
  use Rumbl.ModelCase

  alias Rumbl.GroupVideoProposal

  @valid_attrs %{score: 42, yt_id: "some content"}
  @invalid_attrs %{}

  test "changeset with valid attributes" do
    changeset = GroupVideoProposal.changeset(%GroupVideoProposal{}, @valid_attrs)
    assert changeset.valid?
  end

  test "changeset with invalid attributes" do
    changeset = GroupVideoProposal.changeset(%GroupVideoProposal{}, @invalid_attrs)
    refute changeset.valid?
  end
end
