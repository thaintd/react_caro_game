import React from "react";
import logo from "../../assets/public/tagline-logo.png";
import "./Board.css";
import Time from "../../assets/public/Ellipse 5.png";
import { FaChevronRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BoardGameWithBot } from "../../components/BoardGame/BoardGameWithBot";

function PlayWithBot() {
  const picture = localStorage.getItem("picture");
  return (
    <div className="inGame">
      <div className="image">
        <img src={logo} alt="" />
      </div>
      <div className="InforGameDetails">
        <div id="infoGame">
          <div className="avatarGamer">
            <img style={{ maxWidth: "30px", maxHeight: "30px" }} src={picture} alt="" />
          </div>
        </div>
        <img src={Time} style={{ margin: "0 20px" }} alt="" />
        <div id="infoGame">
          <div className="avatarGamer">
            <img style={{ maxWidth: "30px", maxHeight: "30px" }} src="https://res.cloudinary.com/dligpgeta/image/upload/v1710833870/robot-removebg-preview_w0ywwy.png" alt="" />
          </div>
        </div>
      </div>
      <div>
        <BoardGameWithBot />
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

export default PlayWithBot;
