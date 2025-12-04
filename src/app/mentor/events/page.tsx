"use client";
import MissionForm from "../../../components/MissionForm";

export default function NewMissionPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-purple-800 mb-8">Create New Mission</h1>
      <div className="w-full max-w-2xl">
        <MissionForm />
      </div>
    </main>
  );
}
