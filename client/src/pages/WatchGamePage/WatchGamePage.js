import React from "react";
import logo from "../../assets/public/tagline-logo.png";
import "./WatchGamePage.css";
import Time from "../../assets/public/Ellipse 5.png";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import socket from "../../socket";
import { useState } from "react";

import { WatchBoardGame } from "../../components/BoardGame/WatchBoardGame";

function WatchGamePage() {
  const [playerImages, setPlayerImages] = useState({ player1Image: "", player2Image: "" });
  socket.on("joined_room_player_info", (data) => {
    const { playerInfor } = data;
    console.log(playerInfor);
    const player1 = playerInfor[0];
    const player2 = playerInfor[1];
    const player1Image = player1.playerImage;
    const player2Image = player2.playerImage;
    setPlayerImages({ player1Image, player2Image });
  });
  return (
    <div className="inGame">
      <div className="image">
        <img src={logo} alt="" />
      </div>
      <div className="InforGameDetails">
        <div id="infoGame">
          <div className="avatarGamer">
            <img style={{ maxWidth: "30px", maxHeight: "30px" }} src={playerImages.player1Image} alt="" />
          </div>
        </div>
        <img src={Time} style={{ margin: "0 20px" }} alt="" />
        <div id="infoGame">
          <div className="avatarGamer">
            <img style={{ maxWidth: "30px", maxHeight: "30px" }} src={playerImages.player2Image} alt="" />
          </div>
        </div>
      </div>
      <div>
        <WatchBoardGame />
      </div>
      <div className="buttonQuitGame">
        <Link to="/home" style={{ textDecoration: "none" }}>
          <button className="quitGame">
            QUIT GAME
            <FaChevronRight style={{ color: "white", fontWeight: "400", fontSize: "large" }} />
          </button>
        </Link>
      </div>
    </div>
  );
}

export default WatchGamePage;
