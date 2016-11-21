# Docker notes

## First approach

The goal is to host this Rumbl application in a way which is easy to get up off the ground quickly. We have chosen initially to use docker-compose for provisioning, since changes are easy to revert and address over time using docker.

In addition, I am very comfortable using docker which helps quite a bit in the decision.

We are following a guide on [a dockerized phoenix repo](https://github.com/mrrooijen/dockerized-phoenix) for our information on setting this up.

We have copied his files recommendations here by:
 1. Creating the `docker-compose.yml` file
 2. Creating the `Dockerfile.local` file
 3. Changing the configuration of our application to point at `db` instead of `localhost` for the phoenix database

> Our current droplet is a `Ubuntu Docker 1.12.3 on 16.04` with Digital Ocean.
> We were required to install `docker-compose` via `apt install docker-compose`
> On prompt, we chose to keep our current version of docker/compose with `N`.

> In order to compile our dependencies, we needed `make`, so we ran `apt install build-essential erlang-dev` to install missing dependencies for building our containers.


Now we are going to install the dependencies and create the database using the given commands:
```bash
docker-compose run web mix deps.get
docker-compose run web mix ecto.create
```

Run tests with:
```bash
docker-compose run web mix test
```

And boot the stack up with:
```bash
docker-compose up
```

Finally, if we have any changes to the `Dockerfile.local` file, we need to rebuild using:
```bash
docker-compose build
```

After this, we realized there was something wronge with the premade Phoenix image above with loading `make` and `gcc`, so we keep looking.

## Starting with elixir image

http://davidanguita.name/articles/dockerizing-a-phoenix-project/

We found that we next needed to change his `docker-compose.yml` and `Dockerfile.local` files to update to postgres:9.6 and elixir:1.3.2 

Then, once everything is configured you need to run `docker-compose build` which was not listed.

This pulls down the elixir image layers, and then installs nodejs 6. 

```bash
# Build the Docker image and start the `web` container, daemonized
docker-compose up -d web

# Install application's dependencies and compile them all
docker-compose run web mix do deps.get, compile
# It turns out a lot of these were short hand. Can we just add these to the dockerfile?
# Create Database and Migration 
docker-compose run web mix ecto.create && mix ecto.migrate

# Install (mostly) JS dependencies through `npm`
# We had some issues with this in our droplet, so we ran `apt install nodejs npm`
docker-compose run web npm config set strict-ssl false && npm install
# I want to try this again using:
docker-compose run web npm config set strict-ssl false
docker-compose run web npm install

# Execute the seeding script, if needed
docker-compose run web mix run priv/repo/seeds.exs

# Restart the `web` container to ensure everything's up
docker-compose restart web
```

## Production

When using in production, create a separate `Dockerfile` file.

