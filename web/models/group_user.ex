defmodule Rumbl.GroupUser do
  use Rumbl.Web, :model

  schema "group_users" do
    belongs_to :group, Rumbl.Group
    belongs_to :user, Rumbl.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [])
    |> validate_required([])
  end
end
