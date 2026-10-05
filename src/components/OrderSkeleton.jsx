/**
 * Skeleton loading placeholder for table rows and cards
 */
export function TableSkeletonRows({ rowCount = 4 }) {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, index) => (
        <tr
          key={index}
          className="border-b border-navy-700/50 animate-pulse-subtle"
        >
          {/* Order ID */}
          <td className="py-4 px-4">
            <div className="h-4 w-20 bg-navy-800 rounded"></div>
          </td>
          {/* Customer */}
          <td className="py-4 px-4">
            <div className="h-4 w-28 bg-navy-800 rounded mb-1.5"></div>
            <div className="h-3 w-20 bg-navy-850 rounded"></div>
          </td>
          {/* Product */}
          <td className="py-4 px-4">
            <div className="h-4 w-36 bg-navy-800 rounded mb-1.5"></div>
            <div className="h-3 w-16 bg-navy-850 rounded"></div>
          </td>
          {/* Total */}
          <td className="py-4 px-4">
            <div className="h-4 w-24 bg-navy-800 rounded"></div>
          </td>
          {/* Status */}
          <td className="py-4 px-4">
            <div className="h-5 w-24 bg-navy-800 rounded-full"></div>
          </td>
          {/* Date */}
          <td className="py-4 px-4">
            <div className="h-3.5 w-16 bg-navy-800 rounded"></div>
          </td>
          {/* Action */}
          <td className="py-4 px-4 text-right">
            <div className="h-7 w-20 bg-navy-800 rounded-lg inline-block"></div>
          </td>
        </tr>
      ))}
    </>
  );
}

export function MobileCardSkeleton({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="p-4 rounded-2xl border border-navy-700/60 bg-navy-900/60 animate-pulse-subtle space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 w-20 bg-navy-800 rounded"></div>
            <div className="h-4 w-24 bg-navy-800 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-36 bg-navy-800 rounded"></div>
            <div className="h-3 w-24 bg-navy-850 rounded"></div>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-navy-800">
            <div className="h-4 w-20 bg-navy-800 rounded"></div>
            <div className="h-6 w-16 bg-navy-800 rounded-lg"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
