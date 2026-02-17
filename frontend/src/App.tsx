import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import BoardPage from "./pages/BoardPage";
import BoardSettings from "./pages/BoardSettings";
import InvitePage from "./pages/InvitePage";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/boards/:boardId" element={<BoardPage />} />
          <Route path="/boards/:boardId/settings" element={<BoardSettings />} />
          <Route path="/invite/:boardId" element={<InvitePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
