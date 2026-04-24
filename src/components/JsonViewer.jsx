const JsonViewer = ({ value }) => {
  const parsed = typeof value === 'string' ? value : JSON.stringify(value ?? {}, null, 2);

  return (
    <pre className="max-h-64 overflow-auto rounded-lg bg-slate-900 p-4 text-xs text-slate-100">
      {parsed}
    </pre>
  );
};

export default JsonViewer;
