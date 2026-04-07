'use client';

import { TableRow } from '@/data/types';

export default function ComparisonTable({ rows }: { rows: TableRow[] }) {
  if (rows.length === 0) return null;
  const header = rows[0];
  const body = rows.slice(1);

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-navy text-white">
            {header.cells.map((cell, i) => (
              <th key={i} className="px-3 py-2 text-left font-bold text-xs">{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {row.cells.map((cell, j) => (
                <td key={j} className={`px-3 py-2 text-xs ${j === 0 ? 'font-medium text-navy' : 'text-gray-600'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
