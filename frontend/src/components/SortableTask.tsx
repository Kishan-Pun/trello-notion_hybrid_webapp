import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../api/axios";
import toast from "react-hot-toast";
import { GripVertical, Pencil } from "lucide-react";

interface Label {
  id: string;
  name: string;
  color: string;
}

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
  description?: string;
  dueDate?: string;
  assignees?: Assignee[];
  labels?: Label[];
}

interface Member {
  user: {
    id: string;
    name: string;
  };
  role: string;
}

interface Props {
  task: Task;
  members: Member[];
  refreshBoard: () => void;
}

const SortableTask = ({ task, members, refreshBoard }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const [showDropdown, setShowDropdown] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const [description, setDescription] = useState(task.description || "");
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [showConfirm, setShowConfirm] = useState(false);

  const assignedIds = task.assignees?.map((a) => a.user.id) || [];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const assignUser = async (userId: string) => {
    try {
      await api.post(`/task-assignees/${task.id}/${userId}`);
      toast.success("User assigned");
      setShowDropdown(false);
      refreshBoard();
    } catch {
      toast.error("Already assigned");
    }
  };

  const removeUser = async (userId: string) => {
    try {
      await api.delete(`/task-assignees/${task.id}/${userId}`);
      toast.success("User removed");
      refreshBoard();
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-slate-700 p-3 rounded-lg shadow-sm border border-slate-600 hover:bg-slate-600 transition relative select-none touch-none"
    >
      {/* HEADER */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex items-center gap-2 w-full">
          {isEditing ? (
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  try {
                    await api.put(`/tasks/${task.id}`, {
                      title: editedTitle,
                    });

                    toast.success("Task updated");
                    setIsEditing(false);
                    refreshBoard();
                  } catch (error: any) {
                    if (error.response?.status === 403) {
                      toast.error("Only Owner or Admin can edit tasks");
                    } else {
                      toast.error("Failed to update task");
                    }
                  }
                }

                if (e.key === "Escape") {
                  setEditedTitle(task.title);
                  setIsEditing(false);
                }
              }}
              className="bg-slate-600 text-white text-sm p-1 rounded w-full"
              autoFocus
            />
          ) : (
            <>
              <div className="text-slate-100 font-medium wrap-break-words flex-1">
                {task.title}
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-white transition"
              >
                <Pencil size={14} />
              </button>
            </>
          )}
        </div>

        {/* DRAG HANDLE ONLY */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition touch-none p-1"
        >
          <GripVertical size={18} />
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="mt-3">
        <button
          onClick={() => setShowDescription(!showDescription)}
          className="text-xs text-gray-400 hover:text-gray-200 transition"
        >
          {showDescription ? "Hide description" : "Add / View description"}
        </button>

        {showDescription && (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={async () => {
              await api.put(`/tasks/${task.id}`, { description });
              toast.success("Description updated");
              refreshBoard();
            }}
            className="w-full mt-2 bg-slate-700 text-white p-2 rounded-md text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Write task description..."
          />
        )}

        <button
          onClick={() => setShowConfirm(true)}
          className="text-xs text-red-400 hover:text-red-300 mt-2"
        >
          Delete Task
        </button>
      </div>

      {/* META SECTION */}
      <div className="flex flex-col gap-3 mt-3">
        {/* Due Date */}
        <div
          className={`mt-2 text-xs p-1.5 rounded-md w-fit ${
            task.dueDate && new Date(task.dueDate) < new Date()
              ? "bg-red-600 text-white"
              : "bg-slate-600 text-gray-200"
          }`}
        >
          <input
            type="date"
            value={task.dueDate ? task.dueDate.split("T")[0] : ""}
            className="bg-transparent outline-none"
            onChange={async (e) => {
              await api.put(`/tasks/${task.id}`, {
                dueDate: e.target.value,
              });
              toast.success("Due date updated");
              refreshBoard();
            }}
          />
        </div>

        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {task.labels.map((label) => (
              <div
                key={label.id}
                className="px-2 py-1 text-[10px] rounded-md text-white"
                style={{ backgroundColor: label.color }}
              >
                {label.name}
              </div>
            ))}
          </div>
        )}

        {/* Assignees */}
        {task.assignees && task.assignees.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {task.assignees.map((a) => (
              <div
                key={a.user.id}
                onClick={() => removeUser(a.user.id)}
                className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-xs text-white font-semibold cursor-pointer hover:bg-red-500 transition"
                title="Click to remove"
              >
                {a.user.name.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ASSIGN DROPDOWN */}
      <div className="mt-4 relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="text-xs text-blue-400 hover:text-blue-300 transition"
        >
          + Assign
        </button>

        <div
          className={`absolute left-0 mt-2 w-48 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-50 overflow-hidden transition-all duration-200 ${
            showDropdown
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          {members
            .filter((member) => !assignedIds.includes(member.user.id))
            .map((member) => (
              <div
                key={member.user.id}
                onClick={() => assignUser(member.user.id)}
                className="px-3 py-2 text-sm text-gray-200 hover:bg-slate-700 cursor-pointer transition"
              >
                {member.user.name}
              </div>
            ))}

          {members.filter((m) => !assignedIds.includes(m.user.id)).length ===
            0 && (
            <div className="px-3 py-2 text-xs text-gray-400">
              All members assigned
            </div>
          )}
        </div>
      </div>

      {/* COMMENT INPUT */}
      <textarea
        placeholder="Add comment..."
        className="w-full mt-4 bg-slate-700 text-white p-2 rounded-md text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        onKeyDown={async (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await api.post(`/comments/${task.id}`, {
              content: e.currentTarget.value,
            });
            e.currentTarget.value = "";
            toast.success("Comment added");
            refreshBoard();
          }
        }}
      />

      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 p-6 rounded-xl shadow-xl w-80">
            <h3 className="text-white font-semibold mb-4">Delete this task?</h3>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-3 py-1 text-sm bg-slate-600 rounded text-white"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  try {
                    await api.delete(`/tasks/${task.id}`);
                    toast.success("Task deleted");
                    setShowConfirm(false);
                    refreshBoard();
                  } catch (error: any) {
                    if (error.response?.status === 403) {
                      toast.error("Only Owner or Admin can delete tasks");
                    } else {
                      toast.error("Failed to delete task");
                    }
                    setShowConfirm(false);
                  }
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

export default SortableTask;
