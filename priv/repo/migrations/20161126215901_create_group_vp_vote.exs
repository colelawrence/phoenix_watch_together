defmodule Rumbl.Repo.Migrations.CreateGroupVPVote do
  use Ecto.Migration

  def change do
    create table(:group_vp_votes) do
      add :weight, :integer
      add :user, references(:users, on_delete: :nothing)
      add :proposal, references(:group_video_proposals, on_delete: :nothing)
      add :group, references(:groups, on_delete: :nothing)

      timestamps()
    end
    create index(:group_vp_votes, [:user])
    create index(:group_vp_votes, [:proposal])
    create index(:group_vp_votes, [:group])

  end
end
