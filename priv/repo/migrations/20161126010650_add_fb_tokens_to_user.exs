defmodule Rumbl.Repo.Migrations.AddFbTokensToUser do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :age_max, :integer
      add :age_min, :integer
      add :gender, :string, size: 14
      add :email, :string

      add :fb_auth, references(:user_fb_auths)

      remove :password_hash
      remove :username
    end
  end
end
