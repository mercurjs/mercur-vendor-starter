import { useCallback, useState } from 'react';
import { Table } from '@tanstack/react-table';

export function useTableRowsSelection<T extends { id: string }>() {
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const reset = useCallback((table: Table<T>) => {
    table.toggleAllRowsSelected(false);
    setSelectedRows({});
  }, []);

  return {
    selectedRows,
    setSelectedRows,
    reset,
  };
}
