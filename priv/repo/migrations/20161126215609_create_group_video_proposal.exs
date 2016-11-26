defmodule Rumbl.Repo.Migrations.CreateGroupVideoProposal do
  use Ecto.Migration

  def change do
    create table(:group_video_proposals) do
      add :yt_id, :string
      add :score, :integer
      add :group, references(:groups, on_delete: :nothing)
      add :proposed_by, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:group_video_proposals, [:group])
    create index(:group_video_proposals, [:proposed_by])

  end
end
