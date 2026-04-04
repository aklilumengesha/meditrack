"use client";

export default function Pagination({ total, page, perPage, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <p className="text-sm text-gray-400">
        Showing {Math.min((page - 1) * perPage + 1, total)}–{Math.min(page * perPage, total)} of {total}
      </p>
      <div className="flex gap-1">
        <button onClick={() => onChange(page - 1)} disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          ‹
        </button>
        {visible.map((p, i) => (
          <span key={p}>
            {i > 0 && visible[i - 1] !== p - 1 && <span className="px-2 py-1.5 text-gray-300 text-sm">…</span>}
            <button onClick={() => onChange(p)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                p === page ? "bg-blue-600 text-white font-semibold" : "border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}>
              {p}
            </button>
          </span>
        ))}
        <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
          className="px-3 py-1.5 rounded-lg text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
          ›
        </button>
      </div>
    </div>
  );
}
