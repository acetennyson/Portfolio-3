import { getProjects } from "../../../firebase/firestore";

export const revalidate = 60;

export default async function ProjectsPage() {
  const allProjects = await getProjects();

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
              {project.coverImage ? (
                <img src={project.coverImage} alt={project.title} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">No Image</div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xl text-gray-900">{project.title}</h3>
                  {project.featured && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-gray-500 mt-1 text-sm line-clamp-2">{project.description}</p>
              </div>
              <div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.technologies?.map((tech: string) => (
                    <span key={tech} className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">{tech}</span>
                  ))}
                </div>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-blue-600 font-medium mt-4 hover:underline"
                  >
                    View Project
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                      <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" />
                      <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" />
                    </svg>
                  </a>
                )}
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
