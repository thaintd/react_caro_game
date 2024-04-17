/* eslint-disable no-undef */
import React, { useEffect } from "react";
import logo from "../../assets/public/tagline-logo.png";
import gameIcon from "../../assets/public/game-icon.png";
import playBtn from "../../assets/public/menu-btn.png";
import playWithFriendBtn from "../../assets/public/menu-btn (2).png";
import leaderBoard from "../../assets/public/menu-btn (3).png";
import "./Homepage.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Swal from "sweetalert2";
import socket from "../../socket";

function HomePage() {
  const [rooms, setRoom] = useState([]);
  const [playOnline, setPlayOnline] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [isShowRoomCode, setIsShowRoomCode] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [opponentName, setOpponentName] = useState(null);
  const [playerImage, setPlayerImage] = useState("");
  const [opponentImage, setOpponentImage] = useState(null);
  const [playerID, setPlayerID] = useState("");
  const [opponentID, setOpponentID] = useState(null);
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const navigator = useNavigate();

  const handleJoinRoomCodeChange = (value) => {
    setJoinRoomCode(value);
  };
  const handleShowRoomCode = () => {
    setIsShowRoomCode(true);
  };
  const handleBackHome = () => {
    window.location.reload();
    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });
  };
  const cancelPlayerRoom = (roomCode) => {
    socket.emit("cancel_room", { roomCode });
  };
  const joinRoom = () => {
    socket.on("InvalidRoomCode", () => {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Phòng này không tồn tại!",
        showConfirmButton: false
      });
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    });
    if (joinRoomCode.trim() !== "") {
      if (joinRoomCode === roomCode) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Bạn không thể tham gia phòng do chính bạn tạo!"
        });
      } else {
        socket?.emit(
          "join_room",
          {
            playerName: playerName,
            roomCode: joinRoomCode,
            playerID: playerID,
            playerImage: playerImage
          },
          cancelPlayerRoom(roomCode)
        );
      }
    }
  };

  useEffect(() => {
    socket.on("connect", function () {
      setPlayOnline(true);
      setOpponentID(null);
    });
  }, [navigator, playerName]);
  useEffect(() => {
    socket.emit("get_rooms");

    socket.on("rooms_list", ({ rooms }) => {
      setRoom(rooms);
    });
    return () => {
      socket.off("rooms_list");
    };
  }, []);

  const playNowClick = async () => {
    const result = await takePlayerName();
    const username = result.value;
    const playerId = localStorage.getItem("userId");
    const playerImage = localStorage.getItem("picture");

    setPlayerImage(playerImage);
    setPlayerName(username);
    setPlayerID(playerId);
    if (result.isConfirmed && result.value.trim() !== "") {
      socket.connect();
      socket?.emit("request_to_play", {
        playerName: username,
        playerID: playerId,
        playerImage: playerImage
      });

      socket?.on("connect", () => {
        setOpponentImage(null);
        setOpponentName(null);
        setOpponentID(null);
      });
      socket?.on("OpponentNotFound", () => {
        setOpponentImage(null);
        setOpponentName(null);
        setOpponentID(null);
      });

      socket?.on("OpponentFound", (data) => {
        if (data.playerID === data.opponentID) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Bạn không thể tham gia phòng do chính bạn tạo!"
          });
          socket.off("OpponentFound");
        } else {
          setOpponentImage(data.opponentImage);
          setOpponentName(data.opponentName);
          setOpponentID(data.opponentID);
          console.log("opponentID", data.opponentID);
          const playingAs = data.playingAs === "X" ? "X" : "O";
          const opponentPlayingAs = playingAs === "X" ? "O" : "X";
          const url = `/play?playerName=${username}&opponentName=${data.opponentName}&playingAs=${playingAs}&opponentPlayingAs=${opponentPlayingAs}&playerID=${playerId}&opponentID=${data.opponentID}&opponentImage=${data.opponentImage}`;
          navigator(url);
        }
      });
      socket?.emit("create_room", {
        playerName: username,
        playerID: playerId,
        playerImage: playerImage
      });

      socket.on("room_created", (data) => {
        setRoomCode(data.roomCode);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        navigator("/home");
      });
    }
  };
  socket.on("room_not_found", () => {
    console.log("room-not-found");
  });
  const watchGame = (roomCode) => {
    socket.emit("watch_game", roomCode);
    navigator(`/watch/${roomCode}`);
  };
  if (playOnline && opponentName === null) {
    return (
      <div className="content">
        {isShowRoomCode ? (
          <>
            <div>
              Mã phòng của bạn: <span style={{ color: "#165470", fontSize: "larger" }}>{roomCode}</span>
            </div>
            <div>Chia sẻ mã phòng này với một người bạn</div>
          </>
        ) : (
          <button onClick={handleShowRoomCode}>Tạo mã phòng</button>
        )}
        <br />
        <div>
          <p>Nếu bạn đã có mã phòng, hãy nhập mã phòng tại đây:</p>
          <div className="inputRoom">
            <input className="form-control" style={{ maxWidth: "200px" }} type="text" aria-label="Nhập mã phòng" value={joinRoomCode} onChange={(e) => handleJoinRoomCodeChange(e.target.value)} />
            <button className="btn" style={{ backgroundColor: "#fff", color: "#ad9161" }} onClick={joinRoom}>
              Tham gia phòng
            </button>
          </div>
        </div>
        <br />
        <div>
          <h1>Danh sách các phòng đang có người chơi:</h1>
          <ul>
            {rooms.map((room) => (
              <li key={room.roomCode}>
                Phòng {room.roomCode}: {room.playerCount} người chơi
                <button
                  onClick={() => {
                    watchGame(room.roomCode);
                  }}
                >
                  Vào xem
                </button>
              </li>
            ))}
          </ul>
        </div>
        <br />
        <button onClick={handleBackHome}>Rời khỏi phòng </button>
      </div>
    );
  }

  const takePlayerName = async () => {
    const userName = localStorage.getItem("userName");
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      inputLabel: "Your Name",
      inputValue: userName,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      }
    });
    return result;
  };
  const playWithBot = () => {
    const playerId = localStorage.getItem("userId");
    setPlayerID(playerId);
    navigator(`/playWithBot?playerID=${playerId}`);
  };

  const handleClick = () => {
    navigator("/leaderBoard");
  };

  return (
    <>
      <div id="home">
        <div className="image ">
          <img src={logo} alt="" />
        </div>
        <div className="image">
          <img src={gameIcon} alt="" />
        </div>
        <div className="image">
          <img onClick={playWithBot} src={playBtn} alt="" />
        </div>
        <div className="image">
          <img src={playWithFriendBtn} onClick={playNowClick} alt="" />
        </div>
        <div className="image">
          <img src={leaderBoard} onClick={handleClick} alt="" />
        </div>
      </div>
    </>
  );
}

export default HomePage;
