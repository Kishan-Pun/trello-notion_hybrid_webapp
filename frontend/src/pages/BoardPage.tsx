import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { useNavigate } from "react-router-dom";
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
  const [lists, setLists] = useState<List[]>([]);
  const [newListTitle, setNewListTitle] = useState("");
  const [members, setMembers] = useState<any[]>([]);
  const [showActivity, setShowActivity] = useState(false);

  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    }),
  );

  useEffect(() => {
    if (!boardId) return;

    const fetchMembers = async () => {
      const res = await api.get(`/board-members/${boardId}`);
      setMembers(res.data);
    };

    fetchLists();
    fetchMembers();

    socket.connect();
    socket.emit("join_board", boardId);

    socket.on("task_created", (task: Task) => {
      setLists((prevLists) =>
        prevLists.map((list) =>
          list.id === task.listId
            ? { ...list, tasks: [...list.tasks, task] }
            : list,
        ),
      );
    });

    return () => {
      socket.off("task_created");
    };
  }, [boardId]);

  const fetchLists = async () => {
    const res = await api.get(`/lists/${boardId}`);
    setLists(res.data);
  };

  const createList = async () => {
    if (!newListTitle.trim()) return;

    await api.post("/lists", {
      title: newListTitle,
      boardId,
    });

    setNewListTitle("");
    fetchLists();
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

    const sourceIndex = sourceList.tasks.findIndex((t) => t.id === active.id);
    const targetIndex = targetList.tasks.findIndex((t) => t.id === over.id);

    const updatedLists = lists.map((list) => {
      if (list.id === sourceList!.id && sourceList === targetList) {
        // Reordering inside same list
        const newTasks = [...list.tasks];
        const [moved] = newTasks.splice(sourceIndex, 1);
        newTasks.splice(targetIndex, 0, moved);
        return { ...list, tasks: newTasks };
      }

      if (list.id === sourceList!.id) {
        // Remove from source list
        const newTasks = list.tasks.filter((t) => t.id !== active.id);
        return { ...list, tasks: newTasks };
      }

      if (list.id === targetList!.id) {
        // Insert into target list
        const newTasks = [...list.tasks];
        const movedTask = sourceList!.tasks[sourceIndex];
        newTasks.splice(targetIndex, 0, movedTask);
        return { ...list, tasks: newTasks };
      }

      return list;
    });

    setLists(updatedLists);

    await api.put(`/tasks/${active.id}/move`, {
      newListId: targetList.id,
      newPosition: targetIndex,
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200">
      <div className="flex flex-col md:flex-row h-screen">
        {/* LEFT SIDE (BOARD AREA) */}
        <div className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="text-sm text-gray-300 hover:text-white"
            >
              ← Back to Boards
            </button>

            <h1 className="text-2xl font-bold text-white">Board</h1>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-6 flex-nowrap touch-pan-x an-x min-h-full">
              {lists.map((list) => (
                <ListColumn
                  key={list.id}
                  list={list}
                  members={members}
                  refreshBoard={fetchLists}
                />
              ))}

              <div className="w-full md:w-64 bg-slate-800 p-4 rounded-xl shadow-lg">
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
            </div>
          </DndContext>
        </div>

        {/* RIGHT SIDE (ACTIVITY PANEL) */}
        <div
          className={`fixed top-0 right-0 h-full bg-slate-800 border-l border-slate-700 shadow-xl transition-all duration-300 ${
            showActivity ? "w-80" : "w-12"
          }`}
        >
          <div
            onClick={() => setShowActivity(!showActivity)}
            className="p-3 cursor-pointer text-gray-300 hover:text-white"
          >
            {showActivity ? "→" : "←"}
          </div>

          {showActivity && (
            <div className="hidden md:block">
              <ActivityPanel boardId={boardId!} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardPage;
