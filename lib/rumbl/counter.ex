defmodule Rumbl.Counter do
  use GenServer

  def inc(pid), do: GenServer.cast(pid, :inc)
  def dec(pid), do: GenServer.cast(pid, :dec)
  def val(pid), do: GenServer.call(pid, :val)

  def start_link (initial_val) do
    GenServer.start_link(__MODULE__, initial_val)
  end

  def init(initial_val), do: {:ok, initial_val}

  def handle_cast(:inc, val), do: {:noreply, val + 1}
  def handle_cast(:dec, val), do: {:noreply, val - 1}
  def handle_call(:val, _from, val), do: {:reply, val, val}
end