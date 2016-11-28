defmodule Rumbl.Repo.Migrations.AddPlayedArchivalToProposalTable do
  use Ecto.Migration

  def change do
    alter table(:group_video_proposals) do
      add :played_at, :datetime
    end
  end
end
