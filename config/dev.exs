use Mix.Config

# For development, we disable any cache and enable
# debugging and code reloading.
#
# The watchers configuration can be used to run external
# watchers to your application. For example, we use it
# with brunch.io to recompile .js and .css sources.
config :rumbl, Rumbl.Endpoint,
  url: [host: "wt.parrot.host", port: 443],
  https: [port: 443,
          keyfile: "priv/ssl/server.key",
          certfile: "priv/ssl/server.crt"],
  force_ssl: [hsts: true],
  debug_errors: true,
  code_reloader: true,
  check_origin: false,
  watchers: [node: ["node_modules/.bin/webpack", "--watch",
                    cd: Path.expand("../", __DIR__)]]


# Watch static and templates for browser reloading.
config :rumbl, Rumbl.Endpoint,
  live_reload: [
    patterns: [
      ~r{priv/static/.*(js|css|png|jpeg|jpg|gif|svg)$},
      ~r{priv/gettext/.*(po)$},
      ~r{web/views/.*(ex)$},
      ~r{web/templates/.*(eex)$}
    ]
  ]

# Do not include metadata nor timestamps in development logs
config :logger, :console, format: "[$level] $message\n"

# Set a higher stacktrace during development. Avoid configuring such
# in production as building large stacktraces may be expensive.
config :phoenix, :stacktrace_depth, 20

# Configure your database
config :rumbl, Rumbl.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: System.get_env("PG_USERNAME") || "postgres",
  password: System.get_env("PG_PASSWORD") || "postgres",
  hostname: System.get_env("PG_HOST") || "localhost",
  # database: "app_dev",
  # password: "postgres",
  database: "rumbl_dev",
  # hostname: "db",
  pool_size: 10

import_config "dev.secret.exs"
