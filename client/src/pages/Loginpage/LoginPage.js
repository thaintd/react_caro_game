import FacebookLogin from "@greatsumini/react-facebook-login";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/public/tagline-logo.png";
import "./LoginPage.css";
import { useUser } from "../../useContext";
import { useGoogleLogin } from "@react-oauth/google";

function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = useUser();

  const selectRandomAvatar = () => {
    const avatarList = [
      "https://res.cloudinary.com/dligpgeta/image/upload/v1710832509/avatar5_sp2sq0.png",
      "https://res.cloudinary.com/dligpgeta/image/upload/v1710832502/avatar4_nffdkw.png",
      "https://res.cloudinary.com/dligpgeta/image/upload/v1710832497/avatar3_yo89tc.png",
      "https://res.cloudinary.com/dligpgeta/image/upload/v1710832484/avatar2_mvfwk7.png",
      "https://res.cloudinary.com/dligpgeta/image/upload/v1710832456/avatar1_fb8mas.png"
    ];

    // Chọn ngẫu nhiên một hình ảnh từ danh sách
    const randomIndex = Math.floor(Math.random() * avatarList.length);
    return avatarList[randomIndex];
  };

  const login = useGoogleLogin({
    onSuccess: async (response) => {
      const accessTokenGoogle = response.access_token;
      const resultGoogle = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessTokenGoogle}`);
      const { id, family_name } = resultGoogle.data;
      const picture = selectRandomAvatar();
      const callApiGoogle = await axios.post(`http://localhost:5001/api/v1/auth/google`, {
        id,
        family_name,
        picture,
        type: "google"
      });
      console.log(callApiGoogle);
      const { data } = callApiGoogle.data;
      const token = data.access_token;
      const getUserInfo = async (userId) => {
        try {
          const response = await axios.get(`http://localhost:5001/api/v1/user/${userId}`, {
            headers: {
              Authorization: `${token}`
            }
          });
          const userData = response.data.users;
          const picture = userData.picture;
          localStorage.setItem("picture", picture);
        } catch (error) {
          console.error("Error updating player score:", error);
        }
      };
      getUserInfo(id);
      localStorage.setItem("userId", id);
      localStorage.setItem("userName", family_name);
      localStorage.setItem("accessToken", accessTokenGoogle);
      navigate("/home");
    }
  });

  const onSuccess = async (response) => {
    const accessToken = response.accessToken;
    const result = await axios.get(`https://graph.facebook.com/me?fields=id,name,picture&access_token=${accessToken}`);
    const { id, name } = result.data;
    const picture = selectRandomAvatar();
    const callApi = await axios.post(`http://localhost:5001/api/v1/auth/facebook`, {
      id,
      name,
      picture,
      type: "facebook"
    });
    const { data } = callApi.data;
    const token = data.access_token;
    const getUserInfo = async (userId) => {
      try {
        const response = await axios.get(`http://localhost:5001/api/v1/user/${userId}`, {
          headers: {
            Authorization: `${token}`
          }
        });
        const userData = response.data.users;
        const picture = userData.picture;
        localStorage.setItem("picture", picture);
      } catch (error) {
        console.error("Error to get info user:", error);
      }
    };
    getUserInfo(id);

    localStorage.setItem("userId", id);
    localStorage.setItem("userName", name);
    localStorage.setItem("accessToken", accessToken);

    setUser({ picture, name, id });
    navigate("/home");
  };

  return (
    <>
      <div id="login">
        <div className="image">
          <img src={logo} alt="" />
        </div>
        <FacebookLogin
          appId="1329926178401307"
          autoLoad={false}
          fields="id,name,picture"
          onSuccess={onSuccess}
          responseType="token"
          style={{
            backgroundColor: "#4267b2",
            color: "#fff",
            fontSize: "16px",
            padding: "12px 24px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        />
        <br />
        <button onClick={login}>Sign in with Google 🚀 </button>
      </div>
    </>
  );
}

export default LoginPage;
