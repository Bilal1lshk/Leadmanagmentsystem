export default function LoadingRows() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <tr
          key={rowIndex}
          className="border-b border-gray-100"
        >
          {Array.from({ length: 7 }).map(
            (_, cellIndex) => (
              <td
                key={cellIndex}
                className="px-4 py-5"
              >
                <div className="h-4 animate-pulse rounded bg-gray-200" />
              </td>
            )
          )}
        </tr>
      ))}
    </>
  );
}