import React, { useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import Square from "./Square";
import useSound from "use-sound";
import MyModalWin from "../ModalWin/ModalWin";
import MyModalLose from "../ModalLose/ModalLose";
import soundB from "../../../../client/src/assets/public/player-action-b.mp3";
import soundA from "../../../../client/src/assets/public/player-action-a.mp3";
import axios from "axios";
import { useLocation } from "react-router-dom";

export const BoardGameWithBot = () => {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  let query = useQuery();
  const playerId = query.get("playerID");

  const boardSize = 19;
  const cellSize = 30;

  const [gameState, setGameState] = useState(Array.from({ length: boardSize }, () => Array(boardSize).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [isGameActive, setIsGameActive] = useState(true);
  const [finishedState, setFinishedState] = useState(false);
  const [showModalWin, setShowModalWin] = useState(false);
  const [showModalLose, setShowModalLose] = useState(false);
  const [playSound] = useSound(currentPlayer === "X" ? soundA : soundB);
  const [isPlayerLose] = useState(false);
  const [firstPlayerName, setFirstPlayerName] = useState("");

  const updatePlayerScore = async (userId) => {
    console.log(userId);
    try {
      const response = await axios.put(`http://localhost:5001/api/v1/score/${userId}`);
      console.log(response.data);
    } catch (error) {
      console.error("Error updating player score:", error);
    }
  };
  const handleReplay = () => {
    setGameState(Array.from({ length: boardSize }, () => Array(boardSize).fill(null)));
    setCurrentPlayer("X");
    setIsGameActive(true);
    setFinishedState(false);
    setShowModalWin(false);
    setShowModalLose(false);
  };

  useEffect(() => {
    setFirstPlayerName("Bạn");
  }, []);

  useEffect(() => {
    if (currentPlayer === "O") {
      makeComputerMove();
    }
  }, [currentPlayer]);

  const makeComputerMove = () => {
    const humanPlayer = currentPlayer;
    const computerPlayer = currentPlayer === "X" ? "O" : "X";

    const availableMoves = [];
    gameState.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (!gameState[rowIndex][colIndex]) {
          availableMoves.push([rowIndex, colIndex]);
        }
      });
    });

    if (availableMoves.length > 0) {
      for (let i = 0; i < availableMoves.length; i++) {
        const [row, col] = availableMoves[i];
        const newGameState = gameState.map((row) => [...row]);
        newGameState[row][col] = computerPlayer;

        if (checkWin(row, col, computerPlayer)) {
          handleSquareClick(row, col);
          return;
        }
      }

      for (let i = 0; i < availableMoves.length; i++) {
        const [row, col] = availableMoves[i];
        const newGameState = gameState.map((row) => [...row]);
        newGameState[row][col] = humanPlayer;

        if (checkWin(row, col, humanPlayer)) {
          handleSquareClick(row, col);
          return;
        }
      }
      const centerRowIndex = Math.floor(boardSize / 2);
      const centerColIndex = Math.floor(boardSize / 2);

      const centerMoves = availableMoves.filter(([row, col]) => Math.abs(row - centerRowIndex) <= 2 && Math.abs(col - centerColIndex) <= 2);
      if (centerMoves.length > 0) {
        const randomIndex = Math.floor(Math.random() * centerMoves.length);
        const [row, col] = centerMoves[randomIndex];
        handleSquareClick(row, col);
        return;
      }

      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const [row, col] = availableMoves[randomIndex];
      handleSquareClick(row, col);
    }
  };

  const handleSquareClick = (row, col) => {
    if (isGameActive && !gameState[row][col] && !finishedState && !isPlayerLose) {
      playSound();
      setGameState((prevGameState) => {
        const newGameState = prevGameState.map((row) => [...row]);
        newGameState[row][col] = currentPlayer;
        return newGameState;
      });
      if (checkWin(row, col, currentPlayer)) {
        setFinishedState(true);
        setIsGameActive(false);
        if (currentPlayer === "X") {
          updatePlayerScore(playerId);
          setShowModalWin(true);
        } else {
          setShowModalLose(true);
        }
      } else {
        setCurrentPlayer((prevPlayer) => (prevPlayer === "X" ? "O" : "X"));
      }
    }
  };

  const checkWin = (row, col, player) => {
    let count = 1;
    for (let i = col - 1; i >= 0 && gameState[row][i] === player; i--) {
      count++;
    }
    for (let i = col + 1; i < boardSize && gameState[row][i] === player; i++) {
      count++;
    }
    if (count >= 5) {
      return true;
    }

    //kiem tra hang doc
    count = 1;
    for (let i = row - 1; i >= 0 && gameState[i][col] === player; i--) {
      count++;
    }
    for (let i = row + 1; i < boardSize && gameState[i][col] === player; i++) {
      count++;
    }
    if (count >= 5) {
      return true;
    }
    count = 1;
    for (let i = row - 1, j = col - 1; i >= 0 && j >= 0 && gameState[i][j] === player; i--, j--) {
      count++;
    }
    for (let i = row + 1, j = col + 1; i < boardSize && j < boardSize && gameState[i][j] === player; i++, j++) {
      count++;
    }
    if (count >= 5) {
      return true;
    }

    count = 1;
    for (let i = row - 1, j = col + 1; i >= 0 && j < boardSize && gameState[i][j] === player; i--, j++) {
      count++;
    }
    for (let i = row + 1, j = col - 1; i < boardSize && j >= 0 && gameState[i][j] === player; i++, j--) {
      count++;
    }

    if (count >= 5) {
      return true;
    }

    return false;
  };

  return (
    <div>
      <div>{`${firstPlayerName} sẽ đi trước`}</div>
      <Stage width={boardSize * cellSize} height={boardSize * cellSize}>
        <Layer>{gameState.map((row, rowIndex) => row.map((value, colIndex) => <Square key={`cell-${rowIndex}-${colIndex}`} rowIndex={rowIndex} colIndex={colIndex} squareSize={cellSize} onClick={() => handleSquareClick(rowIndex, colIndex)} value={value} />))}</Layer>
      </Stage>
      <MyModalWin isOpen={showModalWin} onRequestClose={() => setShowModalWin(false)} onReplay={handleReplay} />
      <MyModalLose isOpen={showModalLose} onRequestClose={() => setShowModalLose(false)} onReplay={handleReplay} />
    </div>
  );
};
