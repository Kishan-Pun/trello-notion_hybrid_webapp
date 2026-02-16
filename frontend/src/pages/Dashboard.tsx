import { useEffect, useState } from "react";
import api from "../api/axios";
// import { socket } from "../socket";

interface Board {
  id: string;
  title: string;
}

export default function Dashboard() {
  const [boards, setBoards] = useState<Board[]>([]);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    const res = await api.get("/boards");
    setBoards(res.data);
  };

  return (
    <div>
      <h2>Your Boards</h2>
      {boards.map((board) => (
        <div key={board.id}>{board.title}</div>
      ))}
    </div>
  );
}
