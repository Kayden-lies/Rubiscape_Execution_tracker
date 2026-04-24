import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreateExecutionForm from '../components/CreateExecutionForm';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import useDebouncedValue from '../hooks/useDebouncedValue';
import usePolling from '../hooks/usePolling';
import { createExecution, getExecutions } from '../services/executions';
import { useToast } from '../components/ToastProvider';

const initialFilters = {
  job_name: '',
  status: '',
  user: '',
  start_date: '',
  end_date: '',
};

const ExecutionsPage = () => {
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [executionsData, setExecutionsData] = useState({ items: [], total: 0 });
  const debouncedFilters = useDebouncedValue(filters, 450);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const queryParams = useMemo(
    () => ({ ...debouncedFilters, page, page_size: pageSize }),
    [debouncedFilters, page, pageSize],
  );

  const fetchExecutions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExecutions(queryParams);
      const items = data.items || data.results || data.executions || data.data || [];
      const total = data.total || data.count || items.length;
      setExecutionsData({ items, total });
    } finally {
      setLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    fetchExecutions();
  }, [fetchExecutions]);

  usePolling(fetchExecutions, 8000, [fetchExecutions]);

  const handleCreate = async (form, reset) => {
    setCreating(true);
    try {
      const payload = { ...form, inputs: JSON.parse(form.inputs) };
      await createExecution(payload);
      showToast('Execution created successfully.', 'success');
      reset();
      fetchExecutions();
    } catch {
      showToast('Invalid JSON payload for inputs.');
    } finally {
      setCreating(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(executionsData.total / pageSize));

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold text-slate-800">Executions</h2>
        <p className="text-sm text-slate-500">Auto-refresh every 8 seconds</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="grid gap-3 md:grid-cols-5">
              <input className="rounded-md border px-3 py-2 text-sm" placeholder="Filter by job name" value={filters.job_name} onChange={(e) => { setPage(1); setFilters((prev) => ({ ...prev, job_name: e.target.value })); }} />
              <select className="rounded-md border px-3 py-2 text-sm" value={filters.status} onChange={(e) => { setPage(1); setFilters((prev) => ({ ...prev, status: e.target.value })); }}>
                <option value="">All statuses</option>
                <option value="PENDING">PENDING</option>
                <option value="RUNNING">RUNNING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="FAILED">FAILED</option>
              </select>
              <input className="rounded-md border px-3 py-2 text-sm" placeholder="Filter by user" value={filters.user} onChange={(e) => { setPage(1); setFilters((prev) => ({ ...prev, user: e.target.value })); }} />
              <input type="date" className="rounded-md border px-3 py-2 text-sm" value={filters.start_date} onChange={(e) => { setPage(1); setFilters((prev) => ({ ...prev, start_date: e.target.value })); }} />
              <input type="date" className="rounded-md border px-3 py-2 text-sm" value={filters.end_date} onChange={(e) => { setPage(1); setFilters((prev) => ({ ...prev, end_date: e.target.value })); }} />
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : executionsData.items.length === 0 ? (
            <EmptyState message="No executions found for selected filters." />
          ) : (
            <>
              <div className="hidden overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 md:block">
                <table className="min-w-full divide-y divide-slate-200 text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      {['Job Name', 'Status', 'User', 'Created At', 'Duration (s)'].map((head) => (
                        <th key={head} className="px-4 py-3 text-left font-semibold text-slate-600">{head}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {executionsData.items.map((execution) => (
                      <tr key={execution.id} className="cursor-pointer hover:bg-slate-50" onClick={() => navigate(`/executions/${execution.id}`)}>
                        <td className="px-4 py-3">{execution.job_name}</td>
                        <td className="px-4 py-3"><StatusBadge status={execution.status} /></td>
                        <td className="px-4 py-3">{execution.user || execution.created_by || '-'}</td>
                        <td className="px-4 py-3">{new Date(execution.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3">{execution.duration_seconds ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid gap-3 md:hidden">
                {executionsData.items.map((execution) => (
                  <div key={execution.id} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200" onClick={() => navigate(`/executions/${execution.id}`)}>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-800">{execution.job_name}</h3>
                      <StatusBadge status={execution.status} />
                    </div>
                    <p className="mt-2 text-sm text-slate-500">User: {execution.user || execution.created_by || '-'}</p>
                    <p className="text-sm text-slate-500">Created: {new Date(execution.created_at).toLocaleString()}</p>
                    <p className="text-sm text-slate-500">Duration: {execution.duration_seconds ?? '-'}s</p>
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div className="text-sm text-slate-500">Page {page} of {totalPages}</div>
            <div className="flex items-center gap-2">
              <select className="rounded-md border px-2 py-1 text-sm" value={pageSize} onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}>
                {[10, 20, 50].map((size) => (<option key={size} value={size}>{size}/page</option>))}
              </select>
              <button className="rounded border px-3 py-1 text-sm disabled:opacity-40" disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>Prev</button>
              <button className="rounded border px-3 py-1 text-sm disabled:opacity-40" disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>Next</button>
            </div>
          </div>
        </div>

        <CreateExecutionForm loading={creating} onSubmit={handleCreate} />
      </div>
    </section>
  );
};

export default ExecutionsPage;
