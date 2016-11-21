use Mix.Config

# We don't run a server during test. If one is required,
# you can enable the server option below.
config :rumbl, Rumbl.Endpoint,
  http: [port: 4001],
  server: false

# Print only warnings and errors during test
config :logger, level: :warn

config :comeonin, :bcrypt_log_rounds, 4
config :comeonin, :pbkdf2_rounds, 1

# Configure your database
config :rumbl, Rumbl.Repo,
  adapter: Ecto.Adapters.Postgres,
  username: System.get_env("PG_USERNAME") || "postgres",
  password: System.get_env("PG_PASSWORD") || "postgres",
  hostname: System.get_env("PG_HOST") || "localhost",
  # username: "postgres",
  # password: "postgres",
  database: "rumbl_test",
  # hostname: "db",
  pool: Ecto.Adapters.SQL.Sandbox
