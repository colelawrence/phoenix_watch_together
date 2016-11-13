# Rumbl

## Windows

Start postgresql server using:

```shell
pg_ctl start -D C:\Users\Cole\.postgresql\data
pg_ctl status -D C:\Users\Cole\.postgresql\data
```

More commands on https://www.postgresql.org/docs/9.6/static/app-pg-ctl.html

### Compiling for Windows

> We had issues trying to compile using the latest Visual Studio, so we use VS12 here.

```shell
# Initialize environment for VCBuild tools
"C:\Program Files (x86)\Microsoft Visual Studio 12.0\VC\vcvarsall.bat" amd64
# Compile dependencies
mix compile
```

## Mac OSX

```shell
brew install postgres
# start detached postgres database
pg_ctl -D /usr/local/var/postgres start

# add default postgres user
createuser -s postgres

# Proceed to "Starting App"
```

## Starting App

To start your Phoenix app:

  * Install dependencies with `mix deps.get`
  * Create and migrate your database with `mix ecto.create && mix ecto.migrate`
  * Install Node.js dependencies with `npm install`
  * Start Phoenix endpoint with `mix phoenix.server`

Now you can visit [`localhost:4000`](http://localhost:4000) from your browser.

Ready to run in production? Please [check our deployment guides](http://www.phoenixframework.org/docs/deployment).

### Debugging Notes

```sh
# run app
iex -S mix phoenix.server
```

## Learn more

  * Official website: http://www.phoenixframework.org/
  * Guides: http://phoenixframework.org/docs/overview
  * Docs: https://hexdocs.pm/phoenix
  * Mailing list: http://groups.google.com/group/phoenix-talk
  * Source: https://github.com/phoenixframework/phoenix
