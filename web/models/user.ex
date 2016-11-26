defmodule Rumbl.User do
  use Rumbl.Web, :model

  schema "users" do
    field :name, :string
    field :age_min, :integer
    field :age_max, :integer
    field :gender, :string
    field :email, :string

    belongs_to :fb_auth, Rumbl.UserFBAuth

    has_many :videos, Rumbl.Video
    has_many :annotations, Rumbl.Annotation

    timestamps
  end

  def changeset(model, params \\ :empty) do
    model
    |> unique_constraint(:fb_auth)
  end

  def registration_changeset(model, params) do
    model
    |> changeset(params)
  end
end