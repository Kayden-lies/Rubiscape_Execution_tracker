const statusClassMap = {
  PENDING: 'bg-slate-100 text-slate-700',
  RUNNING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-rose-100 text-rose-700',
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
      statusClassMap[status] || 'bg-slate-100 text-slate-600'
    }`}
  >
    {status || 'UNKNOWN'}
  </span>
);

export default StatusBadge;
