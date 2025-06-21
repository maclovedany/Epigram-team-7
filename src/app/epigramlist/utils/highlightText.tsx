import React from "react";

export function highlightText(
  text: string,
  searchQuery: string
): React.ReactNode {
  if (!searchQuery.trim()) {
    return text;
  }

  const regex = new RegExp(
    `(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "gi"
  );
  const parts = text.split(regex);

  return parts.map((part, index) => {
    if (regex.test(part)) {
      return (
        <mark
          key={index}
          className="bg-yellow-200 px-1 rounded"
          style={{ backgroundColor: "#fef08a" }}
        >
          {part}
        </mark>
      );
    }
    return part;
  });
}

export function searchInText(text: string, searchQuery: string): boolean {
  if (!searchQuery.trim()) {
    return true;
  }

  return text.toLowerCase().includes(searchQuery.toLowerCase());
}
