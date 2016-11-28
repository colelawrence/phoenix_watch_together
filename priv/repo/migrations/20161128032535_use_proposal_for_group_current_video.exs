defmodule Rumbl.Repo.Migrations.UseProposalForGroupCurrentVideo do
  use Ecto.Migration

  def change do
    alter table(:groups) do
      remove :video_id

      add :group_video_proposal_id, references(:group_video_proposals, on_delete: :nothing)
    end

    create index(:groups, [:group_video_proposal_id])
  end
end
