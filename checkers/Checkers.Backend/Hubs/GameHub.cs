using Microsoft.AspNetCore.SignalR;
using Checkers.Backend.Game;

namespace Checkers.Backend.Hubs
{
    public class GameHub : Hub
    {
        private readonly CheckersEngine _engine;
        public GameHub(CheckersEngine engine) => _engine = engine;

        public async Task StartGame()
        {
            _engine.CreateInitialBoard();
            await Clients.All.SendAsync("GameStarted", _engine.Board, _engine.CurrentPlayer);
        }

        public async Task MakeMove(int fR, int fC, int tR, int tC)
        {
            // Find the move in legal moves to get the AttackRow/Col data
            var legalMoves = CheckersRules.GetLegalMoves(_engine, fR, fC);
            var move = legalMoves.FirstOrDefault(m => m.ToRow == tR && m.ToCol == tC);

            if (move != null && _engine.ExecuteMove(fR, fC, move))
            {
                await Clients.All.SendAsync("MoveMade", _engine.Board, _engine.CurrentPlayer, _engine.MustJumpPiece);
            }
            else
            {
                await Clients.Caller.SendAsync("InvalidMove");
            }
        }

        public async Task ForfeitGame() => 
            await Clients.All.SendAsync("GameEnded", $"Player {_engine.CurrentPlayer} forfeited.");

        public override async Task OnDisconnectedAsync(Exception? ex) => 
            await base.OnDisconnectedAsync(ex);
    }
}