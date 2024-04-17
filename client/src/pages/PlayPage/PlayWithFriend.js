import React from "react";
import logo from "../../assets/public/tagline-logo.png";
import "./Board.css";
import Time from "../../assets/public/Ellipse 5.png";
import { FaChevronRight } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { BoardGame } from "../../components/BoardGame/BoardGame";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import socket from "../../socket";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function PlayWithFriend() {
  const navigate = useNavigate();
  const picture = localStorage.getItem("picture");
  const userId = localStorage.getItem("userId");
  const name = localStorage.getItem("name");

  let query = useQuery();
  const playerName = query.get("playerName");
  const opponentName = query.get("opponentName");
  const opponentImage = query.get("opponentImage");

  useEffect(() => {
    return () => {
      socket.disconnect();
      navigate("/home");
    };
  }, [navigate]);

  return (
    <div className="inGame">
      <div className="image">
        <img src={logo} alt="" />
      </div>
      <div className="InforGameDetails">
        <div id="infoGame">
          <div className="avatarGamer">
            <div className="player_name">
              <img style={{ maxWidth: "30px", maxHeight: "30px" }} src={picture} alt="" />
            </div>
          </div>
        </div>
        <img src={Time} style={{ margin: "0 20px" }} alt="" />
        <div id="infoGame">
          <div className="avatarGamer">
            <div className="player_name">
              <img style={{ maxWidth: "30px", maxHeight: "30px" }} src={opponentImage} alt="" />
            </div>
          </div>
        </div>
      </div>
      <div>
        <BoardGame />
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

export default PlayWithFriend;
