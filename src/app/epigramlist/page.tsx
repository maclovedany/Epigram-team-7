"use client";

import Header from "@/components/layout/Header";
import { EpigramListContent } from "./components";

export default function EpigramListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <EpigramListContent />
    </div>
  );
}
