import Link from "next/link";
import { useSelector } from "react-redux";
import clsx from "clsx";

const UrlCard = ({ card, previewImages, onDelete }) => {
  const isDark = useSelector((state) => state.theme.isDarkMode);

  return (
    <div
      className={clsx(
        "flex items-center justify-between rounded-xl p-4 shadow-md transition",
        isDark
          ? "bg-gradient-to-br from-zinc-900 to-zinc-800 border border-cyan-700 text-white"
          : "bg-gradient-to-br from-cyan-50 to-blue-100 border border-cyan-300 text-black"
      )}
    >
      <div className="flex items-center gap-4">
        {previewImages[card.url] && (
          <img
            src={previewImages[card.url]}
            alt="Preview"
            width={60}
            height={60}
            className="rounded border shadow-sm"
          />
        )}

        <div className="flex flex-col">
          <span className="font-semibold line-clamp-1">{card.title}</span>
          <span className="text-xs mt-1 text-gray-400">{card.tags}</span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Link
          href={card.url}
          target="_blank"
          className="text-sm font-medium text-blue-400 hover:underline break-all"
        >
          Visit
        </Link>
        <button
          onClick={() => onDelete(card.id)}
          className="text-sm font-medium text-red-400 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default UrlCard;
