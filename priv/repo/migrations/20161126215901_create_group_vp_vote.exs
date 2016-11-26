defmodule Rumbl.Repo.Migrations.CreateGroupVPVote do
  use Ecto.Migration

  def change do
    create table(:group_vp_votes) do
      add :weight, :integer
      add :user_id, references(:users, on_delete: :nothing)
      add :proposal_id, references(:group_video_proposals, on_delete: :nothing)
      add :group_id, references(:groups, on_delete: :nothing)

      timestamps()
    end
    create index(:group_vp_votes, [:user_id])
    create index(:group_vp_votes, [:proposal_id])
    create index(:group_vp_votes, [:group_id])

  end
end
