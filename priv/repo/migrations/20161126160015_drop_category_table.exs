defmodule Rumbl.Repo.Migrations.DropCategoryTable do
  use Ecto.Migration

  def change do
    alter table(:videos) do
      remove :category_id
    end

    drop table(:categories)
  end
end
