import { useCallback, useEffect, useState } from 'react';
import MetricCard from '../components/MetricCard';
import { getSummary } from '../services/executions';
import usePolling from '../hooks/usePolling';

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSummary = useCallback(async () => {
    try {
      const data = await getSummary();
      setSummary(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  usePolling(fetchSummary, 10000, [fetchSummary]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">Dashboard</h2>
        <p className="text-sm text-slate-500">Live execution performance overview.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Success Rate"
          loading={loading}
          value={summary ? `${Number(summary.success_rate || 0).toFixed(2)}%` : '--'}
        />
        <MetricCard
          label="Failure Count"
          loading={loading}
          value={summary ? summary.failure_count ?? '--' : '--'}
        />
        <MetricCard
          label="Average Duration"
          loading={loading}
          value={summary ? `${Number(summary.avg_duration_seconds || 0).toFixed(2)}s` : '--'}
        />
      </div>
    </section>
  );
};

export default DashboardPage;
