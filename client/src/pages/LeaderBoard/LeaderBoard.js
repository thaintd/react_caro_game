import React, { useEffect, useState } from "react";
import "./LeaderBoard.css";
import logo from "../../assets/public/tagline-logo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaChevronRight } from "react-icons/fa";

export default function LeaderBoard() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const getScore = async () => {
      const res = await axios.get("http://localhost:5001/api/v1/score/");
      const { users } = res.data;
      console.log(users);
      users.sort((a, b) => b.score - a.score);
      setUsers(users);
    };
    getScore();
  }, []);

  return (
    <>
      <div id="leader_board">
        <div className="image">
          <img src={logo} alt="" />
        </div>
        <div>
          <h2 style={{ color: "#165470" }}>LEADERBOARD</h2>
        </div>
        <div className="leader-board">
          {users.map((user, index) => {
            return (
              <div className="leader-board_details" key={user.id}>
                <div className="leader-board_details_info">
                  <div className="number_player">{index + 1}</div>
                  <div className="mx-2" style={{ border: "1px #000" }}>
                    <img style={{ maxWidth: "30px", maxHeight: "30px" }} src={user.picture} alt="" />
                  </div>
                  <div style={{ color: "#AD9161" }}>{user.name}</div>
                </div>
                <div style={{ color: "#AD9161" }}>{user.score} WINS</div>
              </div>
            );
          })}
        </div>
        <Link to="/home" style={{ textDecoration: "none" }}>
          <button className="quitGame">
            MAIN MENU
            <FaChevronRight style={{ color: "white", fontWeight: "400", fontSize: "large" }} />
          </button>
        </Link>
      </div>
    </>
  );
}
