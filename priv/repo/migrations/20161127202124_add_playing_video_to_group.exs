defmodule Rumbl.Repo.Migrations.AddPlayingVideoToGroup do
  use Ecto.Migration

  def change do
    alter table(:groups) do
      add :video_id, references(:videos, on_delete: :nothing)
    end
  end
end
