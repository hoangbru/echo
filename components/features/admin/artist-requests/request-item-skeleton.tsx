export function RequestItemSkeleton({
  currentStatus,
}: {
  currentStatus: string;
}) {
  return (
    <tr className="border-b border-border/50 animate-pulse bg-card">
      <td className="py-4 px-4 w-12">
        <div className="w-4 h-4 bg-muted rounded mx-auto"></div>
      </td>
      <td className="py-4 px-4">
        <div className="h-4 w-32 bg-muted rounded mb-2"></div>
        <div className="h-3 w-48 bg-muted rounded"></div>
      </td>
      <td className="py-4 px-4">
        <div className="h-4 w-24 bg-muted rounded"></div>
      </td>
      <td className="py-4 px-4">
        <div className="h-4 w-20 bg-muted rounded"></div>
      </td>
      <td className="py-4 px-4 text-right">
        <div className="flex justify-end gap-2">
          <div className="h-8 w-8 bg-muted rounded-md"></div>
          {currentStatus === "PENDING" && (
            <div className="h-8 w-16 bg-muted rounded-md"></div>
          )}
        </div>
      </td>
    </tr>
  );
}
