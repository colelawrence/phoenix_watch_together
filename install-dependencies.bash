docker-compose run web mix deps.get
docker-compose run web mix compile
docker-compose run web mix ecto.create
docker-compose run web mix ecto.migrate

docker-compose run web npm config set strict-ssl false
docker-compose run web npm install

# Seed database
docker-compose run web mix run priv/repo/seeds.exs
