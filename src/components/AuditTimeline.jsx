const AuditTimeline = ({ items = [] }) => {
  return (
    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">Audit Timeline</h3>
      <div className="space-y-3">
        {items.length === 0 && <p className="text-sm text-slate-500">No audit entries available.</p>}
        {items.map((item, index) => (
          <div key={`${item.id || index}`} className="flex gap-3">
            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-600" />
            <div>
              <p className="text-sm font-medium text-slate-700">{item.action || item.status || 'Update'}</p>
              <p className="text-xs text-slate-500">{new Date(item.created_at || item.timestamp).toLocaleString()}</p>
              {item.details && <p className="mt-1 text-xs text-slate-500">{item.details}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuditTimeline;
