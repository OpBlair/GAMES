using Microsoft.AspNetCore.SignalR;
using Checkers.Backend.Game;

namespace Checkers.Backend.Hubs
{
    public class GameHub : Hub
{
    private readonly GameManager _manager;
    public GameHub(GameManager manager) => _manager = manager;

    public async Task JoinRoom(string? roomName)
    {
        // If no roomName provided, generate a random one (or use a default)
        string actualRoom = string.IsNullOrWhiteSpace(roomName) 
                            ? "Public-Room-1" 
                            : roomName;

        await Groups.AddToGroupAsync(Context.ConnectionId, actualRoom);
        var engine = _manager.GetOrCreateRoom(actualRoom);

        // Initial board setup only if the board is empty
        if (engine.Board[0] == null) engine.CreateInitialBoard();

        // Assign role and notify the room
        await Clients.Caller.SendAsync("AssignRole", _manager.GetPlayerNumber(actualRoom, Context.ConnectionId));
        await Clients.Group(actualRoom).SendAsync("GameStarted", engine.Board, engine.CurrentPlayer);
    }

    public async Task MakeMove(string roomName, int fR, int fC, int tR, int tC)
    {
        var engine = _manager.GetOrCreateRoom(roomName);
        int playerNum = _manager.GetPlayerNumber(roomName, Context.ConnectionId);

        if (playerNum != engine.CurrentPlayer)
        {
            await Clients.Caller.SendAsync("InvalidMove", "It is not your turn!");
            return;
        }

        var moves = CheckersRules.GetLegalMoves(engine, fR, fC);
        var move = moves.FirstOrDefault(m => m.ToRow == tR && m.ToCol == tC);

        if (move != null && engine.ExecuteMove(fR, fC, move))
        {
            await Clients.Group(roomName).SendAsync("MoveMade", engine.Board, engine.CurrentPlayer, engine.MustJumpPiece);
        }
        else
        {
            await Clients.Caller.SendAsync("InvalidMove", "Illegal Move!");
        }
    }
}
}