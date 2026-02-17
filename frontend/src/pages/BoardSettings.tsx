import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import toast from "react-hot-toast";

const BoardSettings = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [members, setMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchBoard();
    fetchMembers();
  }, []);

  const fetchBoard = async () => {
    const res = await api.get("/boards");
    const board = res.data.find((b: any) => b.id === boardId);
    setTitle(board?.title || "");
  };

  const fetchMembers = async () => {
    const res = await api.get(`/board-members/${boardId}`);
    setMembers(res.data);
  };

  const renameBoard = async () => {
    await api.put(`/boards/${boardId}`, { title });
    toast.success("Board renamed");
  };

  const deleteBoard = async () => {
    await api.delete(`/boards/${boardId}`);
    toast.success("Board deleted");
    navigate("/dashboard");
  };

  const transferOwnership = async (userId: string) => {
    await api.post(`/boards/${boardId}/transfer/${userId}`);
    toast.success("Ownership transferred");
    fetchMembers();
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-gray-200">
      <h1 className="text-2xl font-bold mb-6">Board Settings</h1>

      {/* Rename */}
      <div className="bg-slate-800 p-4 rounded-lg mb-6">
        <h2 className="mb-2 font-semibold">Rename Board</h2>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 p-2 rounded mb-3"
        />
        <button
          onClick={renameBoard}
          className="bg-blue-600 px-4 py-2 rounded"
        >
          Save
        </button>
      </div>

      {/* Transfer */}
      <div className="bg-slate-800 p-4 rounded-lg mb-6">
        <h2 className="mb-3 font-semibold">Transfer Ownership</h2>
        {members.map((m) => (
          <div
            key={m.user.id}
            className="flex justify-between items-center mb-2"
          >
            <span>
              {m.user.name} ({m.role})
            </span>
            {m.role !== "OWNER" && (
              <button
                onClick={() => transferOwnership(m.user.id)}
                className="text-sm bg-indigo-600 px-3 py-1 rounded"
              >
                Make Owner
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Delete */}
      <div className="bg-slate-800 p-4 rounded-lg border border-red-500">
        <h2 className="mb-3 font-semibold text-red-400">
          Danger Zone
        </h2>
        <button
          onClick={deleteBoard}
          className="bg-red-600 px-4 py-2 rounded"
        >
          Delete Board
        </button>
      </div>
    </div>
  );
};

export default BoardSettings;
