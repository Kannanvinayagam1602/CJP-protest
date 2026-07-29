export default function Loading() {
  return (
    <div className="container flex flex-col gap-8 py-8">
      <div className="h-8 w-72 animate-pulse rounded-md bg-muted" />
      <div className="h-20 w-full animate-pulse rounded-lg bg-muted" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-lg bg-muted lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-lg bg-muted" />
      </div>
    </div>
  );
}
