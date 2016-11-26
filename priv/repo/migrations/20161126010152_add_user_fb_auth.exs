defmodule Rumbl.Repo.Migrations.AddUserFBAuth do
  use Ecto.Migration

  def change do
    alter table(:users) do
      remove :username

      add :first_name, :string
      add :age_max, :integer
      add :age_min, :integer
      add :gender, :string, size: 14

      add :email, :string

      add :fb_id, :string
      add :fb_token, :string
      add :fb_expires, :float
    end
  end
end
