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

```bash
# Execute the seeding script, if needed
docker-compose run web mix run priv/repo/seeds.exs

# Restart the `web` container to ensure everything's up
docker-compose restart web
```

## Production

When using in production, create a separate `Dockerfile` file.

