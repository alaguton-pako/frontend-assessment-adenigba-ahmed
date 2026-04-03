export default function Loading() {
  return (
    <div>
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-4 w-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-2 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </div>

      {/* Single card skeleton */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
        <div className="w-full h-96 bg-gray-200 animate-pulse" />

        <div className="p-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-16 mb-6 animate-pulse" />

          <div className="h-5 bg-gray-200 rounded w-16 mb-3 animate-pulse" />
          <div className="flex gap-2 mb-6">
            <div className="h-7 w-20 bg-gray-200 rounded-full animate-pulse" />
            <div className="h-7 w-20 bg-gray-200 rounded-full animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="h-5 bg-gray-200 rounded w-16 mb-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-12 animate-pulse" />
            </div>
            <div>
              <div className="h-5 bg-gray-200 rounded w-16 mb-2 animate-pulse" />
              <div className="h-5 bg-gray-200 rounded w-12 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
