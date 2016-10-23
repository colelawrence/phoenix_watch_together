defmodule Rumbl.Repo.Migrations.CreateUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      remove :password_salt
    end
  end
end
