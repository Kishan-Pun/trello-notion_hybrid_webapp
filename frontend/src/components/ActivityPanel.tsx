import { useEffect, useState } from "react";
import api from "../api/axios";
import { socket } from "../socket";

interface Activity {
  id: string;
  action: string;
  createdAt: string;
  user: {
    name: string;
  };
  metadata: any;
}

interface Props {
  boardId: string;
}

const ActivityPanel = ({ boardId }: Props) => {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchActivities();

    socket.on("activity_created", (activity: Activity) => {
      setActivities((prev) => [activity, ...prev]);
    });

    return () => {
      socket.off("activity_created");
    };
  }, [boardId]);

  const fetchActivities = async () => {
    const res = await api.get(`/activity/${boardId}`);
    setActivities(res.data);
  };

  return (
    <div className="w-80 bg-slate-800 border-l border-slate-700 p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold text-white mb-4">
        Activity
      </h2>

      <div className="space-y-3 text-sm">
        {activities.map((a) => (
          <div key={a.id} className="bg-slate-700 p-3 rounded-lg">
            <div className="text-slate-200">
              <span className="font-semibold">
                {a.user?.name}
              </span>{" "}
              {a.action.replace("_", " ").toLowerCase()}
            </div>

            <div className="text-xs text-slate-400 mt-1">
              {new Date(a.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityPanel;
