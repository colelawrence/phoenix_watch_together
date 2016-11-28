defmodule Rumbl.GroupVideoProposal do
  use Rumbl.Web, :model

  schema "group_video_proposals" do
    field :score, :integer
    field :played_at, Ecto.DateTime

    belongs_to :video, Rumbl.Video
    belongs_to :group, Rumbl.Group
    belongs_to :user, Rumbl.User

    has_many :proposal_votes, Rumbl.GroupVPVote

    timestamps()
  end

  @allowed_fields ~w(score played_at video_id group_id user_id)

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, @allowed_fields)
    |> validate_required([:score])
  end
end
