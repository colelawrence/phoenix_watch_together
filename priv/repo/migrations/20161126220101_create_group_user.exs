defmodule Rumbl.Repo.Migrations.CreateGroupUser do
  use Ecto.Migration

  def change do
    create table(:group_users) do
      add :group, references(:groups, on_delete: :nothing)
      add :user, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:group_users, [:group])
    create index(:group_users, [:user])

  end
end
