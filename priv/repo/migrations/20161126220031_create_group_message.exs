defmodule Rumbl.Repo.Migrations.CreateGroupMessage do
  use Ecto.Migration

  def change do
    create table(:group_messages) do
      add :body, :text
      add :group, references(:groups, on_delete: :nothing)
      add :user, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:group_messages, [:group])
    create index(:group_messages, [:user])

  end
end
