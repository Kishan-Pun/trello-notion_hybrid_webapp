import { useState } from "react";
import api from "../api/axios";

interface Member {
  user: {
    id: string;
    name: string;
  };
  role: string;
}

interface Props {
  boardId: string;
  members: Member[];
  refreshBoard: () => void;
}

const BoardSettings = ({ boardId, members, refreshBoard }: Props) => {
  const [title, setTitle] = useState("");

  const renameBoard = async () => {
    await api.put(`/boards/${boardId}`, { title });
    refreshBoard();
  };

  const deleteBoard = async () => {
    await api.delete(`/boards/${boardId}`);
    window.location.href = "/dashboard";
  };

  const transferOwnership = async (userId: string) => {
    await api.put(`/boards/${boardId}/transfer/${userId}`);
    refreshBoard();
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
      <h2 className="text-xl font-semibold text-white mb-4">
        Board Settings
      </h2>

      <div className="mb-4">
        <input
          placeholder="New board name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 p-2 rounded text-white"
        />
        <button
          onClick={renameBoard}
          className="mt-2 bg-blue-600 px-4 py-2 rounded text-white"
        >
          Rename
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-white mb-2">Transfer Ownership</h3>
        {members
          .filter((m) => m.role !== "OWNER")
          .map((m) => (
            <div
              key={m.user.id}
              onClick={() => transferOwnership(m.user.id)}
              className="cursor-pointer text-slate-300 hover:text-white"
            >
              {m.user.name}
            </div>
          ))}
      </div>

      <button
        onClick={deleteBoard}
        className="bg-red-600 px-4 py-2 rounded text-white"
      >
        Delete Board
      </button>
    </div>
  );
};

export default BoardSettings;
