import { Loader, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import React, { useRef } from "react";
import { toast } from 'react-toastify';

const UrlFormField = ({
  field,
  index,
  register,
  remove,
  loadingIndexes,
  autoGenerateTitleTag,
  totalFields,
  getValues
}) => {
  const isDark = useSelector((state) => state.theme.isDarkMode);
  const isLoading = loadingIndexes[index];
  const urlFilled = getValues(`urls.${index}.url`)?.trim();

  const inputStyle = `w-full px-9 py-2 pr-3 rounded-lg border outline-none transition duration-200 relative
    ${isDark
      ? "bg-black text-white border-transparent placeholder-gray-400"
      : "bg-white text-black border-purple-300 placeholder-purple-400"}
    focus:ring-2 focus:ring-pink-400`;

  const containerStyle = `space-y-4 relative border p-5 rounded-2xl shadow-xl transition overflow-hidden ${
    isDark
      ? "bg-black text-white"
      : "bg-gradient-to-br from-pink-50 to-purple-100 border-pink-300 text-black"
  }`;

  const gradientBorder = isDark
    ? "before:content-[''] before:absolute before:inset-0 before:rounded-2xl before:p-[2px] before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:z-0"
    : "";

  return (
    <div key={field.id} className={`${containerStyle} ${gradientBorder}`}>
      {/* Overlay inner content to keep z-index above gradient */}
      <div className="relative z-10 space-y-4">
        {/* URL Input */}
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

        {/* Title Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Generated Title"
            maxLength={80}
            {...register(`urls.${index}.title`, {
              required: true,
              maxLength: 100,
            })}
            disabled={isLoading}
            onClick={() => {
              if (!urlFilled) toast.error("First fill the URL");
            }}
            className={inputStyle}
          />
          {isLoading && (
            <Loader size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-500 animate-spin" />
          )}
        </div>

        {/* Tag Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="#Hashtag"
            maxLength={80}
            {...register(`urls.${index}.tag`, {
              maxLength: 20,
              pattern: {
                value: /^.{0,20}$/,
                message: "Too long tag!",
              },
            })}
            disabled={isLoading}
            onClick={() => {
              if (!urlFilled) toast.error("First fill the URL");
            }}
            className={inputStyle}
          />
          {isLoading && (
            <Loader size={18} className="absolute left-2 top-1/2 -translate-y-1/2 text-pink-500 animate-spin" />
          )}
        </div>
      </div>

      {/* Delete Button (if more than one entry) */}
      {totalFields > 1 && (
        <button
          type="button"
          onClick={() => remove(index)}
          className="absolute top-3 right-3 p-1 rounded-full bg-black hover:bg-red-600 transition z-10"
          title="Remove"
        >
          <Trash2 size={16} className="text-white" />
        </button>
      )}
    </div>
  );
};

export default UrlFormField;
