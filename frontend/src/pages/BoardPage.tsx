import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { socket } from "../socket";
import api from "../api/axios";
import ListColumn from "../components/ListColumn";
import ActivityPanel from "../components/ActivityPanel";

interface Assignee {
  user: {
    id: string;
    name: string;
  };
}

interface Task {
  id: string;
  title: string;
  listId: string;
  assignees?: Assignee[];
}

interface List {
  id: string;
  title: string;
  tasks: Task[];
}

const BoardPage = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [lists, setLists] = useState<List[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [showActivity, setShowActivity] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
  );

  useEffect(() => {
    if (!boardId) return;

    fetchLists();
    fetchMembers();

    socket.connect();
    socket.emit("join_board", boardId);

    socket.on("task_created", fetchLists);
    socket.on("task_updated", fetchLists);
    socket.on("task_deleted", fetchLists);
    socket.on("task_moved", fetchLists);

    return () => {
      socket.disconnect();
    };
  }, [boardId]);

  const fetchLists = async () => {
    const res = await api.get(`/lists/${boardId}`);
    setLists(res.data);
  };

  const fetchMembers = async () => {
    const res = await api.get(`/board-members/${boardId}`);
    setMembers(res.data);

    const currentUserId = localStorage.getItem("userId");
    const me = res.data.find((m: any) => m.user.id === currentUserId);
    setCurrentRole(me?.role || null);
  };

  const createList = async () => {
    if (!newListTitle.trim()) return;

    try {
      await api.post("/lists", {
        title: newListTitle,
        boardId,
      });

      setNewListTitle("");
      fetchLists();
    } catch (error: any) {
      if (error.response?.status === 403) {
        alert("Only Owner or Admin can create lists");
      }
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let sourceList: List | undefined;
    let targetList: List | undefined;

    lists.forEach((list) => {
      if (list.tasks.some((t) => t.id === active.id)) {
        sourceList = list;
      }
      if (list.tasks.some((t) => t.id === over.id)) {
        targetList = list;
      }
    });

    if (!sourceList || !targetList) return;

    const targetIndex = targetList.tasks.findIndex((t) => t.id === over.id);

    await api.put(`/tasks/${active.id}/move`, {
      newListId: targetList.id,
      newPosition: targetIndex,
    });

    fetchLists();
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">
      <div className="flex flex-col md:flex-row h-screen">
        {/* LEFT SIDE */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-gray-300 hover:text-white"
            >
              ← Back to Boards
            </button>

            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">Board</h1>

              <button
                onClick={() => navigate(`/boards/${boardId}/settings`)}
                className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-1 rounded-md text-sm"
              >
                ⚙ Settings
              </button>
            </div>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 overflow-x-auto pb-6">
              {lists.map((list) => (
                <ListColumn
                  key={list.id}
                  list={list}
                  members={members}
                  refreshBoard={fetchLists}
                />
              ))}

              {currentRole !== "MEMBER" && (
                <div className="w-64 bg-slate-800 p-4 rounded-xl">
                  <input
                    value={newListTitle}
                    onChange={(e) => setNewListTitle(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 p-2 rounded text-white mb-2"
                    placeholder="New list title"
                  />
                  <button
                    onClick={createList}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                  >
                    Add List
                  </button>
                </div>
              )}
            </div>
          </DndContext>
        </div>

        {/* RIGHT SIDE ACTIVITY */}
        <div
          className={`hidden md:flex flex-col bg-slate-800 border-l border-slate-700 transition-all duration-300 ${
            showActivity ? "w-80" : "w-14"
          }`}
        >
          <div
            onClick={() => setShowActivity(!showActivity)}
            className="p-3 cursor-pointer text-gray-300 hover:text-white border-b border-slate-700"
          >
            {showActivity ? "→" : "←"}
          </div>

          {showActivity && (
            <div className="flex-1 overflow-y-auto">
              <ActivityPanel boardId={boardId!} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
