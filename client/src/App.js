import HomePage from "./pages/HomePage/HomePage";
import PlayWithFriend from "./pages/PlayPage/PlayWithFriend";
import LoginPage from "./pages/Loginpage/LoginPage";
import PlayWithBot from "./pages/PlayPage/PlayWithBot";
import LeaderBoard from "./pages/LeaderBoard/LeaderBoard";
import WatchGamePage from "./pages/WatchGamePage/WatchGamePage";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./useContext";
import PrivateRouter from "./components/PrivateRouter/PrivateRouter";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/watch/:roomCode" element={<WatchGamePage />} />
        <Route
          path="/home"
          element={
            <PrivateRouter>
              <HomePage />
            </PrivateRouter>
          }
        />
        <Route
          path="/play"
          element={
            <PrivateRouter>
              <PlayWithFriend />
            </PrivateRouter>
          }
        />
        <Route
          path="/playWithBot"
          element={
            <PrivateRouter>
              <PlayWithBot />
            </PrivateRouter>
          }
        />
        <Route
          path="/leaderBoard"
          element={
            <PrivateRouter>
              <LeaderBoard />
            </PrivateRouter>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
