import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border p-4 bg-white shadow">{children}</div>;
}

export function CardHeader({ children }: { children: React.ReactNode }) {
  return <div className="border-b pb-2 mb-2">{children}</div>;
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>;
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="pt-2">{children}</div>;
}
