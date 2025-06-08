import { Loader, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import React from "react";

const UrlFormField = ({ field, index, register, remove, loadingIndexes, autoGenerateTitleTag }) => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const isLoading = loadingIndexes[index];

  const inputStyle = `w-full px-9 py-2 pr-3 rounded-lg border outline-none transition duration-200 relative
    ${isDark ? "bg-zinc-900 text-white border-cyan-600 placeholder-gray-400" : "bg-white text-black border-cyan-400"}
    focus:ring-2 focus:ring-blue-400`;

  const containerStyle = `space-y-4 relative border p-5 rounded-xl shadow-md transition
    ${isDark 
      ? "bg-gradient-to-br from-zinc-900 to-zinc-800 border-cyan-700 text-white" 
      : "bg-gradient-to-br from-cyan-50 to-blue-100 border-cyan-300 text-black"}`;

  return (
    <div key={field.id} className={containerStyle}>
      {/* URL input with loader inside */}
      <div className="relative">
        <input
          type="text"
          placeholder="Paste URL"
          {...register(`urls.${index}.url`, {
            required: true,
            onBlur: (e) => autoGenerateTitleTag(index, e.target.value),
          })}
          className={inputStyle}
        />
       
      </div>

      {/* Title input with loader inside */}
      <div className="relative">
        <input
          type="text"
          placeholder="Generated Title"
          {...register(`urls.${index}.title`, { required: true })}
          className={inputStyle}
          disabled
        />
        {isLoading && (
          <Loader size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
        )}
      </div>

      {/* Hashtag input */}
      <div className="relative">
      <input
        type="text"
        placeholder="#Hashtag"
        {...register(`urls.${index}.tag`)}
        className={inputStyle}
        disabled
      />
       {isLoading && (
          <Loader size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
        )}
        </div>

      {/* Delete Button */}
      <button
        type="button"
        onClick={() => remove(index)}
        className="absolute top-3 right-3 p-1 rounded-full bg-red-500 hover:bg-red-600 transition"
        title="Remove"
      >
        <Trash2 size={16} className="text-white" />
      </button>
    </div>
  );
};

export default UrlFormField;
