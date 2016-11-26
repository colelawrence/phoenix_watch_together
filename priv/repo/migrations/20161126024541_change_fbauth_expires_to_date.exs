defmodule Rumbl.Repo.Migrations.ChangeFbauthExpiresToDate do
  use Ecto.Migration

  def change do
    alter table(:user_fb_auths) do
      remove :expires
      add :expires, :float
    end
  end
end
