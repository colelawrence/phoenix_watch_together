defmodule Rumbl.Group do
  use Rumbl.Web, :model

  schema "groups" do
    field :name, :string
    field :listed, :integer

    has_many :users, Rumbl.GroupUser
    has_many :messages, Rumbl.GroupMessage
    has_many :proposals, Rumbl.GroupVideoProposal
    has_many :proposal_votes, Rumbl.GroupVPVote

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:name, :listed])
    |> validate_required([:name, :listed])
  end
end
