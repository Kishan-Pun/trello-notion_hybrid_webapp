interface BoardCardProps {
  id: string;
  title: string;
  onClick: () => void;
}

const BoardCard = ({ title, onClick }: BoardCardProps) => {
  return (
    <div
      onClick={onClick}
      className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow hover:shadow-xl hover:bg-slate-700 transition cursor-pointer"
    >
      {title}
    </div>
  );
};

export default BoardCard;
