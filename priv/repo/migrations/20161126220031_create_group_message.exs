defmodule Rumbl.Repo.Migrations.CreateGroupMessage do
  use Ecto.Migration

  def change do
    create table(:group_messages) do
      add :body, :text
      add :group_id, references(:groups, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:group_messages, [:group_id])
    create index(:group_messages, [:user_id])

  end
end
