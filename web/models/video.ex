defmodule Rumbl.Video do
  use Rumbl.Web, :model

  @primary_key {:id, Rumbl.Permalink, autogenerate: true}
  schema "videos" do
    field :yt_id, :string
    field :name, :string
    field :description, :string
    field :slug, :string
    field :thumb, :string

    has_many :annotations, Rumbl.Annotation

    timestamps()
  end

  @required_fields ~w(yt_id name description)
  @optional_fields ~w()

  @doc """
  Builds a changeset based on the `model` and `params`.
  """
  def changeset(model, params \\ %{}) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> slugify_name()
    # |> validate_required([:yt_id, :name, :description])
  end

  defp slugify_name(changeset) do
    if name = get_change(changeset, :name) do
      put_change(changeset, :slug, slugify(name))
    else
      changeset
    end
  end

  defp slugify(str) do
    str
    |> String.downcase()
    |> String.replace(~r/[^\w-]+/u, "-")
    |> String.replace(~r/^-|-$/u, "") # replace leading and trailing dashes
  end
end

defimpl Phoenix.Param, for: Rumbl.Video do
  def to_param(%{slug: slug, id: id}) do
    "#{id}-#{slug}"
  end
end
