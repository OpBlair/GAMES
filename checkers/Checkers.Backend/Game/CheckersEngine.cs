using System;
using System.Collections.Generic;
using System.Linq;

namespace Checkers.Backend.Game
{
    public class CheckersPiece { public int Player { get; set; } public bool IsKing { get; set; } }
    public class Move
    {
        public int FromRow { get; set; }
        public int FromCol { get; set; }
        public int ToRow { get; set; }
        public int ToCol { get; set; }
        public bool IsJump { get; set; }
        public int? AttackRow { get; set; }
        public int? AttackCol { get; set; }
    }
    public class Position { public int Row { get; set; } public int Col { get; set; } }

    public class CheckersEngine
    {
        public const int BoardSize = 8;
        public CheckersPiece[][] Board { get; private set; } = new CheckersPiece[BoardSize][];
        public int CurrentPlayer { get; private set; } = 1;
        public Position? MustJumpPiece { get; private set; }

        public void CreateInitialBoard()
        {
            Board = new CheckersPiece[BoardSize][];
            for (int r = 0; r < BoardSize; r++)
            {
                Board[r] = new CheckersPiece[BoardSize];
                for (int c = 0; c < BoardSize; c++)
                    if ((r + c) % 2 != 0)
                    {
                        if (r < 3) Board[r][c] = new CheckersPiece { Player = 1 };
                        else if (r > 4) Board[r][c] = new CheckersPiece { Player = 2 };
                    }
            }
            CurrentPlayer = 1; MustJumpPiece = null;
        }

        public bool ExecuteMove(int fR, int fC, Move m)
        {
            var p = Board[fR][fC];
            if (p == null || p.Player != CurrentPlayer) return false;
            
            // Force multi-jump piece selection
            if (MustJumpPiece != null && (fR != MustJumpPiece.Row || fC != MustJumpPiece.Col)) return false;

            if (m.IsJump && m.AttackRow.HasValue && m.AttackCol.HasValue)
                Board[m.AttackRow.Value][m.AttackCol.Value] = null;

            Board[fR][fC] = null;
            Board[m.ToRow][m.ToCol] = p;

            if (CheckersRules.IsKingPromotion(p, m.ToRow)) p.IsKing = true;

            if (m.IsJump && CheckersRules.CanJumpAgain(this, m.ToRow, m.ToCol))
                MustJumpPiece = new Position { Row = m.ToRow, Col = m.ToCol };
            else ToggleTurn();

            return true;
        }

        private void ToggleTurn() { CurrentPlayer = CurrentPlayer == 1 ? 2 : 1; MustJumpPiece = null; }
    }

    public static class CheckersRules
    {
        private static readonly int[][] P1 = { new[] { 1, -1 }, new[] { 1, 1 } };
        private static readonly int[][] P2 = { new[] { -1, -1 }, new[] { -1, 1 } };
        private static readonly int[][] K = { new[] { -1, -1 }, new[] { -1, 1 }, new[] { 1, -1 }, new[] { 1, 1 } };
        private static readonly int[][] P1J = { new[] { 2, -2 }, new[] { 2, 2 } };
        private static readonly int[][] P2J = { new[] { -2, -2 }, new[] { -2, 2 } };
        private static readonly int[][] KJ = { new[] { -2, -2 }, new[] { -2, 2 }, new[] { 2, -2 }, new[] { 2, 2 } };

        public static List<Move> GetLegalMoves(CheckersEngine e, int r, int c)
        {
            var p = e.Board[r][c];
            if (p == null) return new List<Move>();
            
            // If the player has ANY jump available on the board, they MUST jump.
            bool hasJump = PlayerHasJump(e, p.Player);
            if (hasJump) return GenerateJumpMoves(e, r, c);
            return GenerateNormalMoves(e, r, c);
        }

        public static List<Move> GenerateNormalMoves(CheckersEngine e, int r, int c)
        {
            var p = e.Board[r][c];
            var moves = new List<Move>();
            var dirs = p.IsKing ? K : (p.Player == 1 ? P1 : P2);
            foreach (var d in dirs) {
                int nR = r + d[0], nC = c + d[1];
                if (IsInside(nR, nC) && e.Board[nR][nC] == null)
                    moves.Add(new Move { FromRow = r, FromCol = c, ToRow = nR, ToCol = nC, IsJump = false });
            }
            return moves;
        }

        public static List<Move> GenerateJumpMoves(CheckersEngine e, int r, int c)
        {
            var p = e.Board[r][c];
            if (p == null) return new List<Move>();
            var moves = new List<Move>();
            var dirs = p.IsKing ? KJ : (p.Player == 1 ? P1J : P2J);
            foreach (var d in dirs) {
                int nR = r + d[0], nC = c + d[1], mR = r + (d[0] / 2), mC = c + (d[1] / 2);
                if (IsInside(nR, nC) && e.Board[nR][nC] == null && e.Board[mR][mC] != null && e.Board[mR][mC].Player != p.Player)
                    moves.Add(new Move { FromRow = r, FromCol = c, ToRow = nR, ToCol = nC, IsJump = true, AttackRow = mR, AttackCol = mC });
            }
            return moves;
        }

        public static bool CanJumpAgain(CheckersEngine e, int r, int c) => GenerateJumpMoves(e, r, c).Any();
        public static bool PlayerHasJump(CheckersEngine e, int p) {
            for (int r = 0; r < 8; r++) for (int c = 0; c < 8; c++)
                if (e.Board[r][c]?.Player == p && CanJumpAgain(e, r, c)) return true;
            return false;
        }
        public static bool IsKingPromotion(CheckersPiece p, int r) => (p.Player == 1 && r == 7) || (p.Player == 2 && r == 0);
        private static bool IsInside(int r, int c) => r >= 0 && r < 8 && c >= 0 && c < 8;
    }
}