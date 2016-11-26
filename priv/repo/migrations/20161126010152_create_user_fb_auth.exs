defmodule Rumbl.Repo.Migrations.CreateUserFBAuth do
  use Ecto.Migration

  def change do
    create table(:user_fb_auths) do
      add :fb_id, :string
      add :fb_token, :string
      add :expires, :integer
      add :user_id, references(:users, on_delete: :nothing)

      timestamps()
    end
    create index(:user_fb_auths, [:user_id])

  end
end
