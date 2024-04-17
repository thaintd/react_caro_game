import React, { useState } from "react";
import { Stage, Layer } from "react-konva";
import Square from "./Square";
import { useEffect } from "react";
import socket from "../../socket";
import useSound from "use-sound";
import MyModalWin from "../ModalWin/ModalWin";
import MyModalLose from "../ModalLose/ModalLose";
import soundB from "../../../../client/src/assets/public/player-action-b.mp3";
import soundA from "../../../../client/src/assets/public/player-action-a.mp3";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

export const BoardGame = () => {
  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }
  const navigator = useNavigate();

  let query = useQuery();
  const playerName = query.get("playerName");
  const opponentName = query.get("opponentName");
  const playerID = query.get("playerID");
  const opponentID = query.get("opponentID");
  const playingAs = query.get("playingAs");
  const opponentPlayingAs = query.get("opponentPlayingAs");

  const boardSize = 19;
  const cellSize = 30;
  const moveTimeOut = 10000;

  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [gameState, setGameState] = useState(Array.from({ length: boardSize }, () => Array(boardSize).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [isGameActive, setIsGameActive] = useState(true);
  const [finishedState, setFinishedState] = useState(false);
  const [showModalWin, setShowModalWin] = useState(false);
  const [showModalLose, setShowModalLose] = useState(false);
  const [playSound] = useSound(currentPlayer === "X" ? soundA : soundB);
  const [isPlayerLose, setIsPlayerLose] = useState(false);
  const [firstPlayerName, setFirstPlayerName] = useState("");
  const [timeLeft, setTimeLeft] = useState(moveTimeOut / 1000);

  useEffect(() => {
    if ((playingAs === "X" && !opponentPlayingAs) || playingAs === "X") {
      setIsPlayerTurn(true);
      setFirstPlayerName(playerName);
    } else {
      setFirstPlayerName(opponentName);
    }
  }, [playingAs, opponentPlayingAs, playerName, opponentName]);

  useEffect(() => {
    let timer;
    if (isPlayerTurn) {
      timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          if (prevTimeLeft === 0) {
            setIsPlayerLose(true);
            setIsGameActive(false);
            setFinishedState(true);
            setShowModalLose(true);
            setIsPlayerTurn(false);
            socket.emit("lose", { winner: { nameWinner: opponentName, winnerID: opponentID }, loser: { nameLoser: playerName, loserID: playerID } });
            clearInterval(timer);
            return moveTimeOut / 1000;
          } else {
            return prevTimeLeft - 1;
          }
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlayerTurn, playerName, opponentName, opponentID, playerID]);

  const handleSquareClick = (row, col) => {
    setTimeLeft(moveTimeOut / 1000);
    if (isGameActive && !gameState[row][col] && !finishedState && isPlayerTurn && !isPlayerLose) {
      playSound();
      setGameState((prevGameState) => {
        const newGameState = prevGameState.map((row) => [...row]);
        newGameState[row][col] = currentPlayer;
        return newGameState;
      });
      if (checkWin(row, col, currentPlayer)) {
        setFinishedState(true);
        setIsGameActive(false);
        setShowModalWin(true);
        setIsPlayerTurn(false);
        socket.emit("move", { row, col, player: currentPlayer });
        socket.emit("win", { winner: { nameWinner: playerName, winnerID: playerID }, loser: { nameLoser: opponentName, loserID: opponentID } });
      } else {
        setCurrentPlayer((prevPlayer) => (prevPlayer === "X" ? "O" : "X"));
        setIsPlayerTurn(false);
        socket.emit("move", { row, col, player: currentPlayer });
      }
    }
  };

  useEffect(() => {
    if (!finishedState) {
      socket.on("opponentMove", ({ row, col, player }) => {
        setGameState((prevGameState) => {
          const newGameState = prevGameState.map((row) => [...row]);
          newGameState[row][col] = player;
          return newGameState;
        });
        setCurrentPlayer((prevPlayer) => (prevPlayer === "X" ? "O" : "X"));
        setIsPlayerTurn(true);
      });
    }

    socket.on("win", (winner) => {
      setIsGameActive(false);
      setFinishedState(true);
      setShowModalWin(true);
      setIsPlayerTurn(false);
    });

    socket.on("lose", (loser) => {
      setIsPlayerLose(true);
      setIsGameActive(false);
      setFinishedState(true);
      setShowModalLose(true);
      setIsPlayerTurn(false);
    });

    return () => {
      socket.off("opponentMove");
      socket.off("win");
      socket.off("lose");
    };
  }, [finishedState, currentPlayer, opponentName, playerName]);

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

    // kiem tra tu tren ben phai xuong duoi ben trai
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

  const closeModalWin = () => {
    setShowModalWin(false);
  };
  const closeModalLose = () => {
    setShowModalLose(false);
  };
  const resetGame = () => {
    setGameState(Array.from({ length: boardSize }, () => Array(boardSize).fill(null)));
    setCurrentPlayer("X");
    setIsGameActive(true);
    setFinishedState(false);
    setIsPlayerLose(false);
    setTimeLeft(moveTimeOut / 1000);
    setIsPlayerTurn(true);
  };
  const handleReplay = () => {
    socket.emit("replay_request", { player: { name: playerName, id: playerID }, opponent: { name: opponentName, id: opponentID } });
  };

  const showReplayRequestAlert = () => {
    Swal.fire({
      title: "Yêu cầu replay",
      text: `Bạn có muốn replay không?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Chấp nhận",
      cancelButtonText: "Từ chối",
      reverseButtons: true,
      timer: 10000
    }).then((result) => {
      if (result && (result.isConfirmed || result.dismiss === Swal.DismissReason.cancel)) {
        const response = {
          accepted: result.isConfirmed
        };
        socket.emit("replay_response", { response: response, player: { name: playerName, id: playerID } });
        handleOpponentResponse(response);
      }
    });
  };

  const handleOpponentResponse = (response) => {
    console.log(response);
    if (response && response.accepted) {
      handleReplayAccepted();
    } else {
      navigator("/home");
    }
  };

  const handleReplayAccepted = () => {
    resetGame();
    setShowModalLose(false);
    setShowModalWin(false);
  };

  useEffect(() => {
    socket.on("replay_response_ok", (response) => {
      console.log(response);
      handleOpponentResponse(response);
    });
    return () => {
      socket.off("replay_response_ok");
    };
  }, []);
  socket.on("replay_request_ok", () => {
    showReplayRequestAlert();
  });
  return (
    <div>
      <div>{`${firstPlayerName} sẽ đi trước`}</div>
      <Stage width={boardSize * cellSize} height={boardSize * cellSize}>
        <Layer>{gameState.map((row, rowIndex) => row.map((value, colIndex) => <Square socket={socket} gameState={gameState} key={`cell-${rowIndex}-${colIndex}`} rowIndex={rowIndex} colIndex={colIndex} squareSize={cellSize} onClick={() => handleSquareClick(rowIndex, colIndex)} value={value} setCurrentPlayer={setCurrentPlayer} currentPlayer={currentPlayer} />))}</Layer>
      </Stage>
      <MyModalWin isOpen={showModalWin} onRequestClose={closeModalWin} onReplay={handleReplay}></MyModalWin>
      <MyModalLose isOpen={showModalLose} onRequestClose={closeModalLose} onReplay={handleReplay}></MyModalLose>
    </div>
  );
};
