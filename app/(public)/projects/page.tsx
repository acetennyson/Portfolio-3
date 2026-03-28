import { getProjects } from "../../../firebase/firestore";

export const revalidate = 60; // Revalidate every minute

export default async function ProjectsPage() {
  const allProjects = await getProjects(); // Fetch all projects, not just 'live'

  return (
    <div className="max-w-5xl mx-auto py-12">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Port<span className="text-blue-600">folio</span></h1>
        <p className="text-gray-500 max-w-2xl mx-auto">Explore all of my past and current projects below.</p>
      </header>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {allProjects.map((project: any) => (
          <div key={project.id} className="group relative overflow-hidden rounded-2xl bg-white shadow ring-1 ring-gray-100 flex flex-col hover:shadow-xl transition-shadow">
            <div className="aspect-video bg-gray-100 relative">
              {project.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={project.image} alt={project.name} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xl text-gray-900">{project.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    project.status === "live" ? "bg-green-100 text-green-700" :
                    project.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {allProjects.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            No projects found. Check back later!
          </div>
        )}
      </div>
    </div>
  );
}
