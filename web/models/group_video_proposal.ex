defmodule Rumbl.GroupVideoProposal do
  use Rumbl.Web, :model

  schema "group_video_proposals" do
    field :yt_id, :string
    field :score, :integer
    belongs_to :group, Rumbl.Group
    belongs_to :proposed_by, Rumbl.ProposedBy

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:yt_id, :score])
    |> validate_required([:yt_id, :score])
  end
end
