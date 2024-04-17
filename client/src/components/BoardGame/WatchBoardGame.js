import React, { useState, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import WatchSquare from "./WatchSquare";
import socket from "../../socket";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const WatchBoardGame = () => {
  const navigator = useNavigate();
  const boardSize = 19;
  const cellSize = 30;
  const [winner, setWinner] = useState("");
  const [loser, setLoser] = useState("");
  const [gameState, setGameState] = useState(Array.from({ length: boardSize }, () => Array(boardSize).fill(null)));
  socket.on("joined_room_player_moves", (data) => {
    const { moves } = data;
    const newGameState = Array.from({ length: boardSize }, () => Array(boardSize).fill(null));
    moves.forEach((move) => {
      const { row, col, player } = move;
      newGameState[row][col] = player;
    });
    setGameState(newGameState);
  });
  socket.on("room_not_found", () => {
    console.log("room-not-found");
  });
  const [playerName, setPlayerName] = useState("");
  socket.on("joined_room_player_info", (data) => {
    const { playerInfor } = data;
    playerInfor.forEach((player) => {
      if (player.creator) {
        setPlayerName(player.playerName);
      }
    });
  });

  useEffect(() => {
    socket.on("opponentMove", (moveData) => {
      const { row, col, player } = moveData;
      const newGameState = [...gameState].map((row) => [...row]);
      newGameState[row][col] = player;
      setGameState(newGameState);
    });
    socket.on("winner_or_loser", (data) => {
      const { winner, loser } = data;
      setWinner(winner);
      setLoser(loser);
      console.log(loser);
      Swal.fire({
        title: "Trận đấu đã kết thúc!",
        html: `<div>Winner: ${winner.nameWinner}</div><div>Loser: ${loser.nameLoser}</div>`,
        icon: "success",
        showConfirmButton: true,
        confirmButtonText: "Quay về trang chủ"
      }).then((result) => {
        if (result.isConfirmed) {
          navigator("/home");
        }
      });
    });
    return () => {
      socket.off("opponentMove");
      socket.off("winner_or_loser");
    };
  }, [gameState]);
  return (
    <div>
      <div>{`${playerName} sẽ đi trước`}</div>
      <Stage width={boardSize * cellSize} height={boardSize * cellSize}>
        <Layer>{gameState.map((row, rowIndex) => row.map((value, colIndex) => <WatchSquare key={`cell-${rowIndex}-${colIndex}`} rowIndex={rowIndex} colIndex={colIndex} squareSize={cellSize} value={value} />))}</Layer>
      </Stage>
    </div>
  );
};
