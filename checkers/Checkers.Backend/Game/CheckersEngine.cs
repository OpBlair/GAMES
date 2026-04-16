namespace Checkers.Backend.Game;
public class CheckersEngine
{
    public int[,] Board = new int[8,8];
    public int CurrentPlayer = 1;

    public CheckersEngine()
    {
        InitializeBoard();
    }

    public void InitializeBoard()
    {
        for(int row = 0; row < 8; row++)
        {
            for(int col = 0; col < 8; col++)
            {
                if((row + col) % 2 != 0)
                {
                    if(row < 3) Board[row,col] = 1;
                    else if(row > 4) Board[row,col] = 2;
                }
            }
        }
    }

    public bool ApplyMove(int fromRow, int fromCol, int toRow, int toCol)
    {
        if(Board[fromRow, fromCol] != CurrentPlayer) return false;

        Board[toRow, toCol] = Board[fromRow, fromCol];
        Board[fromRow, fromCol] = 0;

        CurrentPlayer = CurrentPlayer == 1 ? 2 : 1;
        return true;
    }
}