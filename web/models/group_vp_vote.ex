defmodule Rumbl.GroupVPVote do
  use Rumbl.Web, :model

  schema "group_vp_votes" do
    field :weight, :integer
    belongs_to :user, Rumbl.User
    belongs_to :proposal, Rumbl.Proposal
    belongs_to :group, Rumbl.Group

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:weight])
    |> validate_required([:weight])
  end
end
