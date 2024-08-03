import React from "react";

interface TableHeadersProps {
  headers: string[];
  className?: string; // Optional, if you want to pass custom styles
}

const TableHeaders: React.FC<TableHeadersProps> = ({ headers, className }) => {
  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header} className={`border px-4 py-2 ${className}`}>
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeaders;
