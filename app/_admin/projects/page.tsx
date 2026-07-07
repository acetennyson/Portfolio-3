"use client";

import React, { useEffect, useState } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { Button } from "../../../components/ui/Button";
import { addProject } from "../../../firebase/firestore";

export default function ManageProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [featured, setFeatured] = useState(false);

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
    if (!title) return;
    try {
      await addProject({
        title,
        description,
        coverImage: coverImage || null,
        technologies: technologies.split(",").map(t => t.trim()).filter(Boolean),
        liveUrl: liveUrl || null,
        featured,
      });
      setTitle("");
      setDescription("");
      setCoverImage("");
      setTechnologies("");
      setLiveUrl("");
      setFeatured(false);
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
        <form onSubmit={handleAddProject} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. NextJS Portfolio" required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Image URL</label>
              <input value={coverImage} onChange={e => setCoverImage(e.target.value)} placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Live URL</label>
              <input value={liveUrl} onChange={e => setLiveUrl(e.target.value)} placeholder="https://..."
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Technologies (comma-separated)</label>
              <input value={technologies} onChange={e => setTechnologies(e.target.value)} placeholder="React, Node.js, TypeScript"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Project description..." rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="featured" checked={featured} onChange={e => setFeatured(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="featured" className="text-sm font-medium">Featured project</label>
            </div>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add Project</Button>
          </div>
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
                     <th className="px-4 py-3 rounded-tl-lg">Project</th>
                     <th className="px-4 py-3">Technologies</th>
                     <th className="px-4 py-3">Featured</th>
                     <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   {projects.map((p) => (
                     <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                       <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                       <td className="px-4 py-3">
                         <div className="flex flex-wrap gap-1">
                           {(p.technologies || []).slice(0, 3).map((t: string) => (
                             <span key={t} className="text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{t}</span>
                           ))}
                         </div>
                       </td>
                       <td className="px-4 py-3">
                         {p.featured ? (
                           <span className="text-xs rounded-full bg-blue-100 text-blue-700 font-medium px-2 py-1">Featured</span>
                         ) : (
                           <span className="text-xs text-gray-400">—</span>
                         )}
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