defmodule Rumbl.Repo.Migrations.AddPlayStatesToGroup do
  use Ecto.Migration

  def change do
    alter table(:groups) do
      # this is the date which we started playing at
      add :started_at, :datetime

      # this is milliseconds paused at
      add :paused_at, :integer

      add :is_playing, :boolean, default: true, null: false
    end
  end
end
