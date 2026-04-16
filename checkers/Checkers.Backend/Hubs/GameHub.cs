using Microsoft.AspNetCore.SignalR;
using Checkers.Backend.Game;

public class GameHub : Hub
{
    private static CheckersEngine game = new CheckersEngine();

    public async Task SendMove(int fromRow, int fromCol, int toRow, int toCol)
    {
        var valid = game.ApplyMove(fromRow, fromCol, toRow, toCol);

        if(!valid) return;

        await Clients.All.SendAsync("RecieveBoard", game.Board);
    }
}