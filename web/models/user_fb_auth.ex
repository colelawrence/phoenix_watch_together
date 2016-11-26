defmodule Rumbl.UserFBAuth do
  use Rumbl.Web, :model

  schema "user_fb_auths" do
    field :fb_id, :string
    field :fb_token, :string
    field :expires, :float
    belongs_to :user, Rumbl.User

    timestamps()
  end

  @doc """
  Builds a changeset based on the `struct` and `params`.
  """
  def changeset(struct, params \\ %{}) do
    struct
    |> cast(params, [:fb_id, :fb_token, :expires])
    |> unique_constraint(:fb_id)
  end
end
