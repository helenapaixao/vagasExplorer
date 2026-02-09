import axios from 'axios';

/**
 * Cliente para a API interna do Next (API Routes).
 * As chamadas ao GitHub são feitas no servidor (com cache e token).
 */
const api = axios.create({
  baseURL: '',
});

export default api;
