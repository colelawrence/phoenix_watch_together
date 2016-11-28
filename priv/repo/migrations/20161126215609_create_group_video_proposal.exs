defmodule Rumbl.Repo.Migrations.CreateGroupVideoProposal do
  use Ecto.Migration

  def change do
    create table(:group_video_proposals) do
      add :yt_id, :string
      add :score, :integer
      add :group_id, references(:groups, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:group_video_proposals, [:group_id])
    create index(:group_video_proposals, [:user_id])

  end
end
