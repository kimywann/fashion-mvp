import { CATEGORY_SIZES, DEFAULT_SIZES } from "@/lib/constants";

export const SizeSelector = ({
  value,
  onChange,
  category,
}: {
  value: string[];
  onChange: (val: string[]) => void;
  category?: string;
}) => {
  const sizes =
    category && CATEGORY_SIZES[category]
      ? CATEGORY_SIZES[category]
      : DEFAULT_SIZES;

  const toggleSize = (size: string) => {
    if (value.includes(size)) {
      onChange(value.filter((v) => v !== size));
    } else {
      onChange([...value, size]);
    }
  };

  return (
    <div className="flex gap-2">
      {sizes.map((size) => (
        <button
          key={size}
          type="button"
          onClick={() => toggleSize(size)}
          className={`cursor-pointer rounded-md border px-3 py-1 text-sm ${
            value.includes(size)
              ? "border-black bg-black text-white"
              : "border-gray-300 bg-white text-black"
          } `}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export default SizeSelector;
