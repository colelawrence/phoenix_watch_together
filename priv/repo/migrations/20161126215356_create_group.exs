defmodule Rumbl.Repo.Migrations.CreateGroup do
  use Ecto.Migration

  def change do
    create table(:groups) do
      add :name, :string
      add :listed, :integer

      timestamps()
    end

  end
end
