import { useState } from 'react';

const initial = {
  job_name: '',
  inputs: '{\n  \n}',
};

const CreateExecutionForm = ({ onSubmit, loading }) => {
  const [form, setForm] = useState(initial);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(form, () => setForm(initial));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-sm font-semibold text-slate-700">Create Execution</h3>
      <input
        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        placeholder="Job name"
        value={form.job_name}
        onChange={(e) => setForm((prev) => ({ ...prev, job_name: e.target.value }))}
        required
      />
      <textarea
        className="h-28 w-full rounded-md border border-slate-300 px-3 py-2 font-mono text-xs"
        placeholder="JSON inputs"
        value={form.inputs}
        onChange={(e) => setForm((prev) => ({ ...prev, inputs: e.target.value }))}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
};

export default CreateExecutionForm;
