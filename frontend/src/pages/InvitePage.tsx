import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

const InvitePage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const joinBoard = async () => {
      try {
        await api.post(`/board-members/${boardId}`);
        toast.success("Joined board successfully");
        navigate(`/boards/${boardId}`);
      } catch {
        toast.error("Failed to join board");
        navigate("/dashboard");
      }
    };

    if (boardId) {
      joinBoard();
    }
  }, [boardId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      Joining board...
    </div>
  );
};

export default InvitePage;
