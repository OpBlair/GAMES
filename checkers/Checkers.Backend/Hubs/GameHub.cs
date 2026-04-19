using Microsoft.AspNetCore.SignalR;
using Checkers.Backend.Game;

namespace Checkers.Backend.Hubs
{
    public class GameHub : Hub
    {
        private readonly CheckersEngine _engine;
        // Track players by their unique Connection ID
        private static readonly Dictionary<string, int> Players = new();

        public GameHub(CheckersEngine engine) => _engine = engine;

        public async Task StartGame()
        {
            // Assign player numbers based on connection order
            if (!Players.ContainsKey(Context.ConnectionId))
            {
                if (Players.Count == 0) Players[Context.ConnectionId] = 1; // Black
                else if (Players.Count == 1) Players[Context.ConnectionId] = 2; // White
            }

            int assignedPiece = Players.GetValueOrDefault(Context.ConnectionId, 0);
            _engine.CreateInitialBoard();
            
            // Tell the caller what color they are, and everyone that the game started
            await Clients.Caller.SendAsync("AssignRole", assignedPiece);
            await Clients.All.SendAsync("GameStarted", _engine.Board, _engine.CurrentPlayer);
        }

        public async Task MakeMove(int fR, int fC, int tR, int tC)
        {
            // SECURITY: Check if the person moving is actually the current player
            if (!Players.TryGetValue(Context.ConnectionId, out int playerNum) || playerNum != _engine.CurrentPlayer)
            {
                await Clients.Caller.SendAsync("InvalidMove", "It is not your turn!");
                return;
            }

            var moves = CheckersRules.GetLegalMoves(_engine, fR, fC);
            var move = moves.FirstOrDefault(m => m.ToRow == tR && m.ToCol == tC);

            if (move != null && _engine.ExecuteMove(fR, fC, move))
            {
                await Clients.All.SendAsync("MoveMade", _engine.Board, _engine.CurrentPlayer, _engine.MustJumpPiece);
            }
            else
            {
                await Clients.Caller.SendAsync("InvalidMove", "Illegal Move!");
            }
        }

        public override async Task OnDisconnectedAsync(Exception? ex)
        {
            Players.Remove(Context.ConnectionId);
            await base.OnDisconnectedAsync(ex);
        }
    }
}