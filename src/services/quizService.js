import api from './apiClient';

export async function analyzeSkinQuiz(payload) {
  const res = await api.post('/quiz/analyze', payload);
  return res.data;
}
