defmodule Rumbl.Repo.Migrations.CreateGroupUser do
  use Ecto.Migration

  def change do
    create table(:group_users) do
      add :group_id, references(:groups, on_delete: :nothing)
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:group_users, [:group_id])
    create index(:group_users, [:user_id])

  end
end
