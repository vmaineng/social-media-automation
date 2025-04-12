import React from "react";

interface StatusDisplayProps {
  status: string;
}

function StatusDisplay({ status }: StatusDisplayProps) {
  return (
    <div>
      <p> Status: {status}</p>
    </div>
  );
}

export default StatusDisplay;
