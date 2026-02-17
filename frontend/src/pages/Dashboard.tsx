import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

interface Board {
  id: string;
  title: string;
}

const Dashboard = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const res = await api.get("/boards");
    setBoards(res.data);
  };

  const createBoard = async () => {
    if (!newTitle.trim()) return;

    await api.post("/boards", { title: newTitle });
    setNewTitle("");
    setShowModal(false);
    fetchBoards();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">
      {/* NAVBAR */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-tight">Hintro</h1>

        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
          >
            + Create Board
          </button>

          <button
            onClick={handleLogout}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* BOARD GRID */}
      <div className="p-8 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {boards.map((board) => (
          <div
            key={board.id}
            onClick={() => navigate(`/boards/${board.id}`)}
            className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-md hover:shadow-xl hover:bg-slate-700 transition-all duration-200 cursor-pointer"
          >
            <h2 className="text-lg font-semibold text-white">{board.title}</h2>
            <p className="text-sm text-gray-400 mt-2">Click to open board</p>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Create New Board
            </h2>

            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 p-3 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
              placeholder="Board title"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-slate-600 text-gray-200 rounded-lg hover:bg-slate-500"
              >
                Cancel
              </button>

              <button
                onClick={createBoard}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
