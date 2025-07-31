interface TableColumn<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
  className?: string
  mobileHidden?: boolean
}

interface ResponsiveTableProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  onRowClick?: (item: T) => void
  emptyMessage?: string
  loading?: boolean
}

export default function ResponsiveTable<T extends { id: string }>({
  data,
  columns,
  onRowClick,
  emptyMessage = 'No data available',
  loading = false
}: ResponsiveTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-white/10 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="glass rounded-lg p-8 text-center">
        <p className="text-white/60">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className={`text-left py-3 px-4 text-sm font-medium text-white/60 ${column.className || ''}`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-white/5 hover:bg-white/5 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key as string}
                    className={`py-4 px-4 ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(item)
                      : (item[column.key as keyof T] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => onRowClick?.(item)}
            className={`glass rounded-lg p-4 ${
              onRowClick ? 'cursor-pointer hover:scale-[1.02] transition-transform' : ''
            }`}
          >
            {columns
              .filter((col) => !col.mobileHidden)
              .map((column, index) => (
                <div
                  key={column.key as string}
                  className={`${index > 0 ? 'mt-2' : ''} ${
                    index === 0 ? 'font-medium text-white' : 'text-sm text-white/60'
                  }`}
                >
                  {index > 0 && (
                    <span className="text-white/40">{column.label}: </span>
                  )}
                  {column.render
                    ? column.render(item)
                    : (item[column.key as keyof T] as React.ReactNode)}
                </div>
              ))}
          </div>
        ))}
      </div>
    </>
  )
}