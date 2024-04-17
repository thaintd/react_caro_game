import Modal from "react-modal";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaChevronRight } from "react-icons/fa";
import "./ModalWin.css";
import { useEffect } from "react";
import socket from "../../socket";
const MyModalWin = ({ isOpen, closeModal, onReplay }) => {
  const handleReplayClick = () => {
    onReplay();
  };
  const navigate = useNavigate();
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.75)"
    },

    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#FFE2B2",
      padding: "10px"
    }
  };
  useEffect(() => {
    return () => {
      socket.disconnect();
      navigate("/home");
    };
  }, [navigate]);
  const picture = localStorage.getItem("picture");
  return (
    <Modal style={customStyles} isOpen={isOpen} onRequestClose={closeModal}>
      <div className="buttonClose">
        <IoMdClose onClick={closeModal} style={{ cursor: "pointer", color: "#AD9161" }} />
      </div>
      <div className="modalWin">
        <div className="modalContent">CONGRATULATION!</div>
        <div className="modalDetail">YOU WIN</div>
        <div className="avatarUser">
          <img src={picture} style={{ maxWidth: "54px", maxHeight: "54px" }} alt="" />
        </div>
        <div style={{ textDecoration: "none" }}>
          <div>
            <button className="buttonModal" onClick={handleReplayClick}>
              REPLAY
              <FaChevronRight style={{ color: "#FFE2B2", fontWeight: "400", fontSize: "larger" }} />
            </button>
          </div>
        </div>
        <Link to="/home" style={{ textDecoration: "none" }}>
          <div>
            <button className="buttonModal">
              MAIN MENU
              <FaChevronRight style={{ color: "#FFE2B2", fontWeight: "400", fontSize: "larger" }} />
            </button>
          </div>
        </Link>
      </div>
    </Modal>
  );
};

export default MyModalWin;
