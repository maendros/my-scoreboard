import React, { useState, useEffect, useRef } from "react";

const MultiSelect: React.FC<{
  options: { id: number; name: string }[];
  selected: number[];
  onChange: (selected: number[]) => void;
  disabled?: boolean;
}> = ({ options, selected, onChange, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (id: number) => {
    if (selected.includes(id)) {
      onChange(selected.filter((optionId) => optionId !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block w-full max-w-md" ref={dropdownRef}>
      {/* Button to toggle dropdown */}
      <button
        className="w-full text-left p-2 border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={toggleDropdown}
        disabled={disabled}
      >
        {selected.length > 0
          ? options
              .filter((option) => selected.includes(option.id))
              .map((option) => option.name)
              .join(", ")
          : "Select Teams"}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg">
          <ul className="max-h-48 overflow-y-auto">
            {options.map((option) => (
              <li
                key={option.id}
                className="flex items-center p-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <input
                  type="checkbox"
                  checked={selected.includes(option.id)}
                  onChange={() => handleSelect(option.id)}
                  className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 dark:border-gray-600 rounded"
                />
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  {option.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
