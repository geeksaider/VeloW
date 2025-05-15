import axios from 'axios';

// Создаем экземпляр axios с настроенным baseURL
const instance = axios.create({
  // Используем относительный путь для API - это работает с Vue CLI proxy
  baseURL: '/api',
  withCredentials: true, // Важно для передачи httpOnly cookie
  timeout: 30000, // 30 секунд тайм-аут - увеличиваем для медленных соединений
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Добавляем перехватчик для обработки ошибок
instance.interceptors.response.use(
  response => response,
  error => {
    console.error('Axios error:', error);
    
    // Подробное логирование ошибки
    if (error.response) {
      // Ошибка с ответом от сервера (HTTP ошибка)
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      // Ошибка без ответа от сервера (нет соединения)
      console.error('Request was made but no response received:', error.request);
    } else {
      // Ошибка при создании запроса
      console.error('Error during request setup:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default instance;
