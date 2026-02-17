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
  const [inviteEmail, setInviteEmail] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [renaming, setRenaming] = useState(false);

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

  /* ================= INVITE ================= */
  const inviteUser = async () => {
    try {
      await api.post(`/boards/${boardId}/invite`, {
        email: inviteEmail,
      });

      toast.success("User invited successfully");
      setInviteEmail("");
      fetchMembers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invite failed");
    }
  };

  /* ================= RENAME ================= */
  const renameBoard = async () => {
    setRenaming(true);
    try {
      await api.put(`/boards/${boardId}`, { title });
      toast.success("Board renamed");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Only owner can rename");
    } finally {
      setRenaming(false);
    }
  };

  /* ================= TRANSFER ================= */
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

  /* ================= DELETE ================= */
  const deleteBoard = async () => {
    try {
      await api.delete(`/boards/${boardId}`);
      toast.success("Board deleted");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Only owner can delete");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 text-gray-200 relative">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(`/boards/${boardId}`)}
          className="text-sm text-gray-300 hover:text-white"
        >
          ← Back to Board
        </button>

        <h1 className="text-2xl font-bold">Board Settings</h1>
      </div>

      {/* INVITE */}
      {(role === "OWNER" || role === "ADMIN") && (
        <div className="bg-slate-800 p-6 rounded-xl mb-6">
          <h2 className="font-semibold mb-3">Invite Member</h2>

          <div className="flex gap-3">
            <input
              type="email"
              placeholder="User email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="flex-1 bg-slate-700 border border-slate-600 p-2 rounded"
            />
            <button
              onClick={inviteUser}
              className="bg-green-600 px-4 py-2 rounded"
            >
              Invite
            </button>
          </div>
        </div>
      )}

      {/* RENAME */}
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
            disabled={renaming}
            className="bg-blue-600 px-4 py-2 rounded disabled:opacity-50"
          >
            {renaming ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}

      {/* TRANSFER */}
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
            onClick={() => setShowDeleteModal(true)}
            className="bg-red-600 px-4 py-2 rounded"
          >
            Delete Board
          </button>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl w-96 shadow-xl">
            <h3 className="text-lg font-semibold text-red-400 mb-4">
              Are you absolutely sure?
            </h3>

            <p className="text-sm text-gray-400 mb-4">
              This action cannot be undone. Type{" "}
              <span className="text-red-400 font-semibold">DELETE</span> to
              confirm.
            </p>

            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 p-2 rounded mb-4"
              placeholder="Type DELETE"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                }}
                className="bg-slate-600 px-4 py-2 rounded"
              >
                Cancel
              </button>

              <button
                disabled={confirmText !== "DELETE"}
                onClick={deleteBoard}
                className={`px-4 py-2 rounded ${
                  confirmText === "DELETE"
                    ? "bg-red-600"
                    : "bg-red-900 cursor-not-allowed"
                }`}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MEMBER VIEW */}
      {role !== "OWNER" && (
        <div className="bg-slate-800 p-6 rounded-xl text-gray-400">
          Only board owner can modify settings.
        </div>
      )}
    </div>
  );
};

export default BoardSettings;
