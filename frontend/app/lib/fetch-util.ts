import axios from "axios";
import { unknown } from "zod";

const BASE_URL = import.meta.env.VITE_API_URL ||  "http://localhost:3000/api-v1";

const api = axios.create({
  baseURL: BASE_URL,
})

/*
Axios request interceptor — tức là một hàm chạy trước khi request được gửi đi.
Mình sẽ phân tích từng phần:
api: thường là một instance của Axios (ví dụ const api = axios.create({...})).

.interceptors.request.use(...): đăng ký một request interceptor.
Hàm callback ở đây sẽ nhận config của request (URL, method, headers, ...).

Mục đích: cho phép bạn chỉnh sửa hoặc thêm thông tin vào request trước khi gửi lên server.
*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if(token) {
    config.headers.Authorization = `Bearer ${token}`; //Bearer aewihehr3ur9u
  }
  return config;
});

/*(
Đoạn code này là Axios response interceptor — tức là hàm chạy sau khi nhận được phản hồi từ server.
Mình sẽ phân tích từng phần để bạn hiểu rõ

api.interceptors.response.use: đăng ký interceptor cho phản hồi (response).

Hàm đầu tiên (response) => response → xử lý khi request thành công (ở đây chỉ trả về nguyên response).

Hàm thứ hai (error) => { ... } → xử lý khi request lỗi.
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response && error.response.status === 401) {
      window.dispatchEvent(new Event("force-logout"))
    }
    //   Trả về Promise bị reject để luồng gọi API ở component vẫn nhận được lỗi và có thể xử lý thêm nếu cần.
    // Nếu không có dòng này, error có thể bị nuốt mất và không truyền về nơi gọi.
    return Promise.reject(error);
});

export const postData =  async<T>(path: string, data: unknown): Promise<T> => {
  
  const response = await api.post(path, data);
  return response.data;
};

export const fetchData =  async<T>(path: string, data: unknown): Promise<T> => {
  const response = await api.get(path);
  return response.data;
};

export const updateData =  async<T>(path: string, data: unknown): Promise<T> => {
  const response = await api.put(path, data);
  return response.data;
};

export const deleteData=  async<T>(path: string, data: unknown): Promise<T> => {
  const response = await api.delete(path, data);
  return response.data;
};