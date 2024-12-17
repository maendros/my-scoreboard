import React from "react";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="text-center text-red-600 bg-red-100 p-4 rounded">
      <p>Error: {message || "Something went wrong."}</p>
    </div>
  );
};

export default ErrorMessage;
