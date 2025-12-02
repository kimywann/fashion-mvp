export function SizeSelector({
  value,
  onChange,
}: {
  value: string[];
  onChange: (val: string[]) => void;
}) {
  const sizes = ["S", "M", "L", "XL", "FREE"];

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
}

export default SizeSelector;
