import { Skeleton } from "@components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto max-w-360 px-8 py-16 space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-5 w-96" />
      <Skeleton className="h-5 w-80" />
    </div>
  );
}
