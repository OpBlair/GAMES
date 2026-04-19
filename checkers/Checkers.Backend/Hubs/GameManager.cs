using System.Collections.Concurrent;
using Checkers.Backend.Game;

public class GameManager
{
    private readonly ConcurrentDictionary<string, CheckersEngine> _rooms = new();
    // Key: RoomName, Value: Dictionary of ConnectionId to PlayerNumber
    private readonly ConcurrentDictionary<string, Dictionary<string, int>> _roomPlayers = new();

    public CheckersEngine GetOrCreateRoom(string roomName) => _rooms.GetOrAdd(roomName, _ => new CheckersEngine());

    public int GetPlayerNumber(string roomName, string connectionId)
    {
        var players = _roomPlayers.GetOrAdd(roomName, _ => new Dictionary<string, int>());
        lock (players)
        {
            if (!players.ContainsKey(connectionId))
            {
                players[connectionId] = players.Count + 1;
            }
            return players[connectionId];
        }
    }
}