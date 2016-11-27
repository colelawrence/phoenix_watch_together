defmodule Rumbl.GroupMessage do
  use Rumbl.Web, :model

  schema "group_messages" do
    field :body, :string
    belongs_to :group, Rumbl.Group
    belongs_to :user, Rumbl.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:body])
    |> validate_required([:body])
  end
end
