import { useState } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableTask from "./SortableTask";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { Pencil } from "lucide-react";

interface Task {
  id: string;
  title: string;
  listId: string;
}

interface List {
  id: string;
  title: string;
  tasks: Task[];
}

interface Props {
  list: List;
  members: any[];
  refreshBoard: () => void;
}

const ListColumn = ({ list, members, refreshBoard }: Props) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [isEditingList, setIsEditingList] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="min-w-65 w-[85%] sm:w-[70%] md:w-64 shrink-0 bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        {isEditingList ? (
          <input
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={async () => {
              await api.put(`/lists/${list.id}`, {
                title: editedTitle,
              });
              toast.success("List renamed");
              setIsEditingList(false);
              refreshBoard();
            }}
            className="bg-slate-600 text-white text-sm p-1 rounded w-full"
            autoFocus
          />
        ) : (
          <>
            <h2 className="font-semibold text-white flex-1">{list.title}</h2>

            <button
              onClick={() => setIsEditingList(true)}
              className="text-gray-400 hover:text-white transition"
            >
              <Pencil size={14} />
            </button>
          </>
        )}
      </div>

      <div className="space-y-2">
        <SortableContext
          items={list.tasks?.map((t) => t.id) || []}
          strategy={verticalListSortingStrategy}
        >
          {list.tasks?.map((task) => (
            <SortableTask
              key={task.id}
              task={task}
              members={members}
              refreshBoard={refreshBoard}
            />
          ))}
        </SortableContext>
      </div>

      <input
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        onKeyDown={async (e) => {
          if (e.key === "Enter" && taskTitle.trim()) {
            await api.post("/tasks", {
              title: taskTitle,
              listId: list.id,
            });

            setTaskTitle("");
          }
        }}
        className="w-full bg-slate-700 border border-slate-600 p-2 rounded mt-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="New task..."
      />

      <button
        onClick={() => setShowDeleteConfirm(true)}
        className="text-xs text-red-400 hover:text-red-300 mt-3"
      >
        Delete List
      </button>
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl shadow-xl w-80">
            <h3 className="text-white font-semibold mb-4">Delete this list?</h3>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 text-sm bg-slate-600 rounded text-white"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await api.delete(`/lists/${list.id}`);
                    toast.success("List deleted");
                    refreshBoard();
                  } catch (error: any) {
                    if (error.response?.status === 403) {
                      toast.error("Only Owner or Admin can delete lists");
                    } else {
                      toast.error("Failed to delete list");
                    }
                  }
                  setShowDeleteConfirm(false);
                }}
                className="px-3 py-1 text-sm bg-red-600 rounded text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListColumn;
