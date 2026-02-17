import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const BoardSettings = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    fetchBoard();
    fetchMembers();
  }, []);

  const fetchBoard = async () => {
    const res = await api.get("/boards");
    const board = res.data.find((b: any) => b.id === boardId);
    setTitle(board?.title || "");
    setRole(board?.role || null);
  };

  const fetchMembers = async () => {
    const res = await api.get(`/board-members/${boardId}`);
    setMembers(res.data);
  };

  const renameBoard = async () => {
    try {
      await api.put(`/boards/${boardId}`, { title });
      toast.success("Board renamed");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Only owner can rename");
    }
  };

  const deleteBoard = async () => {
    try {
      await api.delete(`/boards/${boardId}`);
      toast.success("Board deleted");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Only owner can delete");
    }
  };

  const transferOwnership = async (userId: string) => {
    try {
      await api.put(`/boards/${boardId}/transfer/${userId}`);
      toast.success("Ownership transferred");
      fetchBoard();
      fetchMembers();
    } catch (err: any) {
      toast.error("Only owner can transfer");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-gray-200">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/boards/${boardId}`)}
          className="text-sm text-gray-300 hover:text-white"
        >
          ← Back to Board
        </button>

        <h1 className="text-2xl font-bold">Board Settings</h1>
      </div>

      {/* RENAME SECTION */}
      {role === "OWNER" && (
        <div className="bg-slate-800 p-6 rounded-xl mb-6">
          <h2 className="font-semibold mb-3">Rename Board</h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 p-2 rounded mb-3"
          />
          <button
            onClick={renameBoard}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* TRANSFER OWNERSHIP */}
      {role === "OWNER" && (
        <div className="bg-slate-800 p-6 rounded-xl mb-6">
          <h2 className="font-semibold mb-4">Transfer Ownership</h2>

          {members
            .filter((m) => m.role !== "OWNER")
            .map((m) => (
              <div
                key={m.user.id}
                className="flex justify-between items-center mb-3"
              >
                <span>
                  {m.user.name} ({m.role})
                </span>

                <button
                  onClick={() => transferOwnership(m.user.id)}
                  className="bg-indigo-600 px-3 py-1 rounded text-sm"
                >
                  Make Owner
                </button>
              </div>
            ))}
        </div>
      )}

      {/* DANGER ZONE */}
      {role === "OWNER" && (
        <div className="bg-slate-800 p-6 rounded-xl border border-red-500">
          <h2 className="text-red-400 font-semibold mb-4">Danger Zone</h2>

          <button
            onClick={deleteBoard}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Delete Board
          </button>
        </div>
      )}

      {/* MEMBER VIEW MESSAGE */}
      {role !== "OWNER" && (
        <div className="bg-slate-800 p-6 rounded-xl text-gray-400">
          Only board owner can modify settings.
        </div>
      )}
    </div>
  );
};

export default BoardSettings;
