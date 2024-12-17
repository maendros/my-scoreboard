import React from "react";

interface TableHeadersProps {
  headers: { label: string; field: string }[];
  className?: string; // Optional, if you want to pass custom styles
  onSort?: (field: string) => void;
  sortField?: string;
  sortOrder?: "asc" | "desc";
}

const TableHeaders: React.FC<TableHeadersProps> = ({
  headers,
  className,
  onSort,
  sortField,
  sortOrder,
}) => {
  return (
    <thead>
      <tr>
        {headers.map((header) => (
          <th
            key={header.field}
            className={`border px-4 py-2 ${className}`}
            onClick={() => onSort && onSort(header.field)}
          >
            <div className="flex items-center">
              {header.label}
              {sortField === header.field && (
                <span className="ml-2">{sortOrder === "asc" ? "▲" : "▼"}</span>
              )}
            </div>
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHeaders;
