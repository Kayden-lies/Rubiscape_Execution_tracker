const MetricCard = ({ label, value, loading }) => {
  if (loading) {
    return <div className="h-28 animate-pulse rounded-xl bg-white shadow-sm" />;
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-slate-800">{value}</p>
    </div>
  );
};

export default MetricCard;
