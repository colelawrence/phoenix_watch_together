defmodule Rumbl.Permalink do
  @behaviour Ecto.Type

  # returns the underlying Ecto type (Here we are building on top of `:id`).
  def type, do: :id

  # Called when external data is passed into Ecto.
  # Invoked when values in queries are interpolated, and
  # by the `cast` function in changesets. 
  def cast(binary) when is_binary(binary) do
    case Integer.parse(binary) do
      {int, _} when int > 0 -> {:ok, int}
      _ -> :error
    end
  end

  def cast(integer) when is_integer(integer) do
    {:ok, integer}
  end

  def cast(_) do
    :error
  end

  # Invoked when data is sent to the database.
  def dump(int) when is_integer(int) do
    {:ok, int}
  end

  # Invoked when data is loaded from the database.
  def load(int) when is_integer(int) do
    {:ok, int}
  end
end
