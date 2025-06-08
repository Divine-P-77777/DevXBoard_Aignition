import Image from "next/image";
import clsx from "clsx";
import UrlCard from "./UrlCard";

const UrlCardGroup = ({ cardName, items, isDark, previewImages, onDelete }) => {
  return (
    <div
      className={clsx(
        "rounded-xl p-6 mb-10 shadow",
        isDark ? "bg-slate-900 border border-slate-700" : "bg-white border border-gray-200"
      )}
    >
      <div className="flex items-center gap-4 mb-6">
        {items[0]?.pic && (
          <Image
            src={items[0].pic}
            alt="Card Group Preview"
            width={60}
            height={60}
            className="rounded border shadow"
          />
        )}
        <h2 className="text-2xl font-bold">{cardName}</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {items.map((card) => (
          <UrlCard
            key={card.id}
            card={card}
            previewImages={previewImages}
            isDark={isDark}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default UrlCardGroup;