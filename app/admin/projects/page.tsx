"use client";

import React, { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Button } from "../../../components/ui/Button";
import { addProject } from "../../../firebase/firestore";

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Project Form State
  const [name, setName] = useState("");
  const [status, setStatus] = useState("live");
  const [image, setImage] = useState("");

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "projects"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    try {
      await addProject({ name, status, image });
      setName("");
      setImage("");
      setStatus("live");
      fetchProjects();
      alert("Project added!");
    } catch (err) {
      console.error(err);
      alert("Failed to add project");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Manage Projects</h1>
        <p className="text-gray-500 mt-2">Add new portfolio items or manage existing ones.</p>
      </header>

      <section className="bg-white p-6 rounded-xl border shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Add New Project</h2>
        <form onSubmit={handleAddProject} className="flex items-end gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-sm font-medium">Project Name</label>
            <input 
              className="w-full flex h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={name} onChange={e => setName(e.target.value)} placeholder="e.g. NextJS Portfolio" required 
            />
          </div>
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select 
              className="w-full h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={status} onChange={e => setStatus(e.target.value)}
            >
              <option value="live">Live</option>
              <option value="pending">Pending</option>
              <option value="upcoming">Upcoming</option>
              <option value="update">Update</option>
            </select>
          </div>
          <div className="flex-1 min-w-[200px] space-y-2">
            <label className="text-sm font-medium">Image URL</label>
            <input 
              className="w-full flex h-10 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={image} onChange={e => setImage(e.target.value)} placeholder="https://..." 
            />
          </div>
          <Button type="submit">Add</Button>
        </form>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Existing Projects</h2>
        <div className="grid gap-4 bg-white rounded-xl border p-4 shadow-sm">
          {loading ? (
            <div className="animate-pulse text-gray-500 text-sm p-4 text-center">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-gray-500 text-sm p-4 text-center border border-dashed rounded-lg">No projects added yet.</div>
          ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-700 font-medium">
                   <tr>
                     <th className="px-4 py-3 rounded-tl-lg">Project Name</th>
                     <th className="px-4 py-3">Status</th>
                     <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {projects.map((p) => (
                     <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                       <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                       <td className="px-4 py-3">
                         <span className="capitalize px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                           {p.status}
                         </span>
                       </td>
                       <td className="px-4 py-3">
                         <span className="text-gray-400 text-xs cursor-not-allowed">Edit/Delete Coming Soon</span>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      </section>
    </div>
  );
}
