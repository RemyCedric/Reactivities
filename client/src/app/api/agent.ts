import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/activity';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    });
};

axios.interceptors.response.use(async (response) => {
    try {
        await sleep(800);
        return response;
    } catch (error) {
        return Promise.reject(error);
    }
});

axios.defaults.baseURL = 'http://localhost:5000/';

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: unknown) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: unknown) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
    list: (): Promise<Activity[]> => requests.get<Activity[]>('/api/activities'),
    details: (id: string): Promise<Activity> => requests.get<Activity>(`/api/activities/${id}`),
    create: (activity: Activity): Promise<void> => requests.post<void>('/api/activities', activity),
    update: (activity: Activity): Promise<void> => requests.put<void>(`/api/activities/${activity.id}`, activity),
    delete: (id: string): Promise<void> => requests.delete<void>(`/api/activities/${id}`),
};

const agent = {
    Activities,
};

export default agent;
