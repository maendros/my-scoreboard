import React from "react";

interface DividerProps {
  className?: string;
  topText?: string;
  bottomText?: string;
}

const Divider: React.FC<DividerProps> = ({
  className = "",
  topText,
  bottomText,
}) => {
  return (
    <div className={`w-full ${className}`}>
      {topText && (
        <p className="text-gray-500 dark:text-gray-400 mb-8">{topText}</p>
      )}
      <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
      {bottomText && (
        <p className="text-gray-500 dark:text-gray-400 mt-8">{bottomText}</p>
      )}
    </div>
  );
};

export default Divider;
