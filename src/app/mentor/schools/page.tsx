"use client";
import { useRouter } from "next/navigation";
import AddSchoolForm from "../../../components/AddSchoolForm";
import { schools } from "../../data";

export default function AddSchoolPage() {
  const router = useRouter();
  function handleBack() {
    router.push("/mentor/dashboard");
  }
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-8 overflow-hidden">
      {/* School-relevant image background with overlay */}
      <div className="absolute inset-0 -z-10">
        <img src="https://images.unsplash.com/photo-1503676382389-4809596d5290?auto=format&fit=crop&w=1600&q=80" alt="School" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-indigo-800/70 to-green-900/80 opacity-80" />
      </div>
      <h1 className="text-4xl font-extrabold text-blue-100 mb-8 drop-shadow-lg">Schools</h1>
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {schools.map((school, i) => (
          <div key={i} className="bg-white/80 rounded-2xl shadow-xl p-6 flex flex-col hover:scale-105 transition-transform">
            <div className="flex items-center gap-3 mb-2">
              {school.logo ? (
                <img src={school.logo} alt={school.name} className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">🏫</div>
              )}
              <h3 className="text-lg font-bold text-blue-800">{school.name}</h3>
            </div>
            <p className="text-gray-700">Location: {school.location}</p>
            <p className="text-gray-600 text-sm">Contact: {school.contact}</p>
            <p className="text-gray-600 text-sm">Students: {school.students}</p>
          </div>
        ))}
      </div>
      <div className="flex gap-4 mt-8">
        <a href="/mentor/schools/add" className="bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition-transform transform hover:scale-105">Add School</a>
        <button
          onClick={handleBack}
          className="bg-gradient-to-r from-gray-300 to-blue-400 text-blue-900 font-bold py-3 px-6 rounded-lg shadow hover:scale-105 hover:shadow-xl transition-transform text-lg tracking-wide border border-blue-300"
        >
          ← Back to Dashboard
        </button>
      </div>
    </main>
  );
}
