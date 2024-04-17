const User = require("../models/user.model");
const { updatePlayerPoints } = require("../logic/game");

const { Server } = require("socket.io");
const allRooms = {};
const allUsers = {};
const roomMoves = {};
function setupSocket(io) {
  io.on("connection", (socket) => {
    allUsers[socket.id] = {
      socket: socket,
      online: true,
      currentRoom: null
    };

    socket.on("request_to_play", (data) => {
      const currentUser = allUsers[socket.id];
      currentUser.playerName = data.playerName;
      currentUser.playerID = data.playerID;
      currentUser.playerImage = data.playerImage;

      const roomCode = generateRoomCode();
      allRooms[roomCode] = {
        players: [{ id: socket.id, name: currentUser.playerName, playerID: currentUser.playerID, playerImage: currentUser.playerImage }],
        creator: socket.id,
        viewers: []
      };
      currentUser.currentRoom = roomCode;
      socket.emit("room_created", { roomCode });
    });

    socket.on("join_room", (data) => {
      const currentUser = allUsers[socket.id];
      const playerID = data.playerID;
      const playerName = data.playerName;
      const playerImage = data.playerImage;
      const roomCode = data.roomCode;
      const room = allRooms[roomCode];

      if (room) {
        if (room && room.players.length < 2) {
          room.players.push({ id: socket.id, name: playerName, playerID: playerID, playerImage: playerImage });
          currentUser.currentRoom = roomCode;
          socket.join(roomCode);
          const creatorSocket = allUsers[room.creator].socket;
          creatorSocket.emit("OpponentFound", {
            opponentName: playerName,
            opponentID: playerID,
            opponentImage: playerImage,
            playingAs: "X"
          });
          socket.emit("OpponentFound", {
            opponentName: allUsers[room.creator].playerName,
            opponentID: allUsers[room.creator].playerID,
            opponentImage: allUsers[room.creator].playerImage,
            playingAs: "O"
          });
        } else {
          socket.emit("OpponentNotFound");
        }
      } else {
        socket.emit("InvalidRoomCode");
      }
    });
    socket.on("watch_game", (roomCode) => {
      const room = allRooms[roomCode];
      console.log(room);
      if (room) {
        const roomCreator = room.creator;
        const playerInfor = room.players.map((player) => ({
          id: player.id,
          playerName: player.name,
          playerImage: player.playerImage,
          playerID: player.playerID,
          creator: player.id === roomCreator
        }));
        const moves = roomMoves[roomCode] || [];
        socket.join(roomCode);
        socket.emit("joined_room_player_info", { playerInfor });
        socket.emit("joined_room_player_moves", { moves });
      } else {
        console.log("Room not found");
        socket.emit("room_not_found");
      }
    });

    socket.on("cancel_room", (data) => {
      delete allRooms[data.roomCode];
    });

    socket.on("move", (moveData) => {
      const roomCode = allUsers[socket.id].currentRoom;
      const moves = roomMoves[roomCode] || [];
      moves.push(moveData);
      roomMoves[roomCode] = moves;
      console.log("Received move from client:", moveData);
      socket.broadcast.emit("opponentMove", moveData);
    });

    socket.on("replay_request", (data) => {
      console.log("Replay request from", data.player.id, "to", data.opponent.id);
      socket.broadcast.emit("replay_request_ok");
    });

    socket.on("replay_response", (data) => {
      console.log("Replay response from", data.player.id, ":", data.response);
      socket.broadcast.emit("replay_response_ok", data.response);
    });

    socket.on("win", async (data) => {
      const { winner, loser } = data;
      await updatePlayerPoints(data.winner.winnerID);
      socket.broadcast.emit("lose", { winner, loser });
      socket.broadcast.emit("winner_or_loser", { winner, loser });
      socket.emit("gameOver", { winner, loser });
    });

    socket.on("lose", async (data) => {
      const { winner, loser } = data;
      await updatePlayerPoints(data.winner.winnerID);
      socket.broadcast.emit("win", { winner, loser });
      socket.broadcast.emit("winner_or_loser", { winner, loser });
      socket.emit("gameOver", { winner, loser });
    });
    socket.on("get_rooms", () => {
      const rooms = getRooms();
      socket.emit("rooms_list", { rooms });
    });

    socket.on("disconnect", () => {
      const currentUser = allUsers[socket.id];
      currentUser.online = false;
      const roomCode = currentUser.currentRoom;
      if (roomCode) {
        const room = allRooms[roomCode];
        if (room) {
          if (room.players.find((player) => player.id === socket.id)) {
            room.players = room.players.filter((player) => player.id !== socket.id);
            if (room.players.length === 0) {
              delete allRooms[roomCode];
            } else {
              const opponentId = room.players[0].id;
              const opponentUser = allUsers[opponentId];
              if (opponentUser && opponentUser.socket) {
                opponentUser.socket.emit("OpponentDisconnected");
              } else {
                console.log("Opponent not found or socket not available");
              }
            }
          }
        }
      }
      delete allUsers[socket.id];
    });
  });
}

function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
function getRooms() {
  const activeRooms = Object.keys(allRooms).filter((roomCode) => allRooms[roomCode].players.length === 2);
  const roomsInfo = activeRooms.map((roomCode) => ({
    roomCode,
    playerCount: allRooms[roomCode].players.length
  }));
  return roomsInfo;
}

module.exports = setupSocket;
