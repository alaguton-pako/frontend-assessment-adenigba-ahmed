export default function Loading() {
  return (
    <div>
      <div className="h-10 bg-gray-200 rounded w-64 mb-6 animate-pulse" />

      {/* Search bar skeleton */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
        <div className="w-36 h-10 bg-gray-200 rounded-lg animate-pulse" />
      </div>

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white">
            <div className="w-full h-48 bg-gray-200 rounded mb-4 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
