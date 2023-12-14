  import React, { useState } from "react";
  import Chessboard from "chessboardjsx";
  import { Chess } from "chess.js";

  const App = () => {
    const [game, setGame] = useState(new Chess());

    const getPieceValue = (piece) => {
      if (piece.type === 'p') {
          return 1;
      } else if (piece.type === 'r') {
          return 5;
      } else if (piece.type === 'n') {
          return 3;
      } else if (piece.type === 'b') {
          return 3;
      } else if (piece.type === 'q') {
          return 9;
      } else if (piece.type === 'k') {
          return 0;
      }
      throw new Error(`Pieza desconocida: ${piece.type}`);
    }

    const evaluateBoard = (game) => {
      let totalEvaluation = 0;
      const board = game.board();
      for (let row of board) {
          for (let square of row) {
              if (square) {
                  const pieceValue = getPieceValue(square);
                  totalEvaluation += square.color === 'b' ? pieceValue : -pieceValue;
              }
          }
      }

      return totalEvaluation;
    }

    const minimax = (game, depth, isMaximizingPlayer, alpha, beta, lvl) => {
      lvl++;
      if (depth === 0) {
          return evaluateBoard(game);
      }
      if (isMaximizingPlayer) {
          let maxEval = -Infinity;
          let moves = game.moves();
          for (let i = 0; i < moves.length; i++) {
              game.move(moves[i]);
              let evalu = minimax(game, depth - 1, false, alpha, beta, lvl);
              game.undo();
              maxEval = Math.max(maxEval, evalu);
              alpha = Math.max(alpha, evalu);
              if (beta <= alpha) {
                  break;
              }
          }
          return maxEval;
      } else {
          let minEval = +Infinity;
          let moves = game.moves();
          for (let i = 0; i < moves.length; i++) {
              game.move(moves[i]);
              let evalu = minimax(game, depth - 1, true, alpha, beta, lvl);
              game.undo();
              minEval = Math.min(minEval, evalu);
              beta = Math.min(beta, evalu);
              if (beta <= alpha) {
                  break;
              }
          }
          return minEval;
      }
    }

    function getBestMove(game, depth) {
      let bestEval = -Infinity;
      let bestMove;
      let moves = game.moves();

      for (let i = 0; i < moves.length; i++) {
          console.log("Evaluación de movimiento", moves[i], game.move(moves[i]));

          let evalu = minimax(game, depth - 1, false, -Infinity, +Infinity, 0);
          
          game.undo();

          if (evalu > bestEval) {
              bestEval = evalu;
              bestMove = moves[i];
          }
        }

        return bestMove;
    }
    
    const handleMove = (movement) => {
      try {
        const move = game.move({
            from: movement.sourceSquare,
            to: movement.targetSquare
        });

        setGame(new Chess(game.fen()));

        const bestMove = getBestMove(new Chess(game.fen()), 4); 

        if (bestMove) {
            game.move(bestMove);
            setGame(new Chess(game.fen()));
        }
      }
      catch (err) {
        console.log(err);
      }
    }

    return (
      <div className="App">
        <Chessboard
          position={game.fen()}
          onDrop={(movement) => {
            handleMove(movement);
          }}
        />
      </div>
    );
  }

  export default App;