import React from "react";
import "./InforGame.css";
import { useUser } from "../../useContext";

function InforGame() {
  const { user } = useUser();
  const src = user?.picture;
  return (
    <div id="infoGame">
      <div className="avatarGamer">
        <img src={src} style={{ maxWidth: "26px", maxHeight: "26px" }} alt="" />
      </div>
    </div>
  );
}

export default InforGame;
