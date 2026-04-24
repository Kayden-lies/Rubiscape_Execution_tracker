import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import AuditTimeline from '../components/AuditTimeline';
import EmptyState from '../components/EmptyState';
import JsonViewer from '../components/JsonViewer';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import usePolling from '../hooks/usePolling';
import { getExecutionAudit, getExecutions, updateExecution } from '../services/executions';
import { useToast } from '../components/ToastProvider';

const statusActions = [
  { label: 'Start', value: 'RUNNING', className: 'bg-blue-600' },
  { label: 'Complete', value: 'COMPLETED', className: 'bg-emerald-600' },
  { label: 'Fail', value: 'FAILED', className: 'bg-rose-600' },
];

const ExecutionDetailsPage = () => {
  const { id } = useParams();
  const [execution, setExecution] = useState(null);
  const [audit, setAudit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { showToast } = useToast();

  const fetchExecution = useCallback(async () => {
    try {
      const data = await getExecutions({ id, page: 1, page_size: 1 });
      const items = data.items || data.results || data.executions || data.data || [];
      const found = items.find((item) => `${item.id}` === `${id}`) || items[0] || null;
      setExecution(found);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchAudit = useCallback(async () => {
    const data = await getExecutionAudit(id);
    setAudit(data.items || data.results || data.audit || data.data || []);
  }, [id]);

  useEffect(() => {
    Promise.all([fetchExecution(), fetchAudit()]);
  }, [fetchExecution, fetchAudit]);

  usePolling(fetchExecution, 6000, [fetchExecution]);
  usePolling(fetchAudit, 6000, [fetchAudit]);

  const onUpdateStatus = async (status) => {
    setUpdating(true);
    try {
      await updateExecution(id, { status });
      showToast(`Execution updated to ${status}.`, 'success');
      fetchExecution();
      fetchAudit();
    } finally {
      setUpdating(false);
    }
  };

  const prettyCreatedAt = useMemo(
    () => (execution?.created_at ? new Date(execution.created_at).toLocaleString() : '-'),
    [execution?.created_at],
  );

  const copyId = async () => {
    await navigator.clipboard.writeText(String(id));
    showToast('Execution ID copied.', 'success');
  };

  if (loading) return <LoadingSpinner />;
  if (!execution) return <EmptyState message="Execution not found." />;

  return (
    <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">{execution.job_name}</h2>
              <p className="text-sm text-slate-500">Execution ID: {id}</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={execution.status} />
              <button className="rounded-md border px-3 py-1 text-sm" onClick={copyId}>Copy ID</button>
            </div>
          </div>

          <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
            <p><span className="font-medium text-slate-700">User:</span> {execution.user || execution.created_by || '-'}</p>
            <p><span className="font-medium text-slate-700">Created:</span> {prettyCreatedAt}</p>
            <p><span className="font-medium text-slate-700">Duration:</span> {execution.duration_seconds ?? '-'}s</p>
            <p><span className="font-medium text-slate-700">Error:</span> {execution.error_details || execution.error || '-'}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {statusActions.map((action) => (
              <button
                key={action.value}
                disabled={updating}
                onClick={() => onUpdateStatus(action.value)}
                className={`rounded-md ${action.className} px-3 py-1.5 text-sm text-white disabled:opacity-50`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">Inputs</h3>
            <JsonViewer value={execution.inputs} />
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <h3 className="mb-2 text-sm font-semibold text-slate-700">Outputs</h3>
            <JsonViewer value={execution.outputs} />
          </div>
        </div>
      </div>

      <AuditTimeline items={audit} />
    </section>
  );
};

export default ExecutionDetailsPage;
