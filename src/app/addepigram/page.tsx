"use client";

import Header from "@/components/layout/Header";
import { PageHeader, AddEpigramForm } from "./components";

export default function AddEpigramPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-xl mx-auto py-12">
        <PageHeader />
        <AddEpigramForm />
      </main>
    </div>
  );
}
