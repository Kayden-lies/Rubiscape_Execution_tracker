import api from './api';

export const getExecutions = async (params) => {
  const { data } = await api.get('/executions', { params });
  return data;
};

export const getSummary = async () => {
  const { data } = await api.get('/executions/summary');
  return data;
};

export const createExecution = async (payload) => {
  const { data } = await api.post('/executions', payload);
  return data;
};

export const updateExecution = async (id, payload) => {
  const { data } = await api.patch(`/executions/${id}`, payload);
  return data;
};

export const getExecutionAudit = async (id) => {
  const { data } = await api.get(`/executions/${id}/audit`);
  return data;
};
