import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-800"></div>
      <p className="ml-4">Loading...</p>
    </div>
  );
};

export default Loader;
