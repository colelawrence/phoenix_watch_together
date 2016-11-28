defmodule Rumbl.Repo.Migrations.AddThumbURLsToVideo do
  use Ecto.Migration

  def change do
    alter table(:videos) do
      add :thumb, :string
    end
  end
end
