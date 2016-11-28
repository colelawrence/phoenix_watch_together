defmodule Rumbl.Repo.Migrations.AddDescAndThumbToProposals do
  use Ecto.Migration

  # Here we are forcing ourselves to create the Video row whenever someone makes a proposal
  def change do
    alter table(:group_video_proposals) do
      remove :yt_id

      add :video_id, references(:videos, on_delete: :nothing)
    end

    create index(:group_video_proposals, [:video_id])

    alter table(:videos) do
      remove :user_id
    end

    rename table(:videos), :title, to: :name
    rename table(:videos), :url, to: :yt_id

    create index(:videos, [:yt_id])
  end
end
