import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
import { history } from '../..';
import { Activity } from '../models/activity';
import ActivityFormValues from '../models/activityFormValues';
import { User, UserFormValues } from '../models/user';
import { store } from '../store/store';

axios.defaults.baseURL = 'http://localhost:5000/';

axios.interceptors.request.use((config) => {
    const { token } = store.commonStore;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axios.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response) {
            const { data, status, config } = error.response;
            switch (status) {
                case 400:
                    if (typeof data === 'string') {
                        toast.error(data);
                    }
                    // eslint-disable-next-line no-prototype-builtins
                    else if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                        history.push('/not-found');
                    } //
                    else if (data.errors) {
                        const modalStateError = [];
                        // eslint-disable-next-line no-restricted-syntax
                        for (const key in data.errors) {
                            if (data.errors[key]) {
                                modalStateError.push(data.errors[key]);
                            }
                        }
                        throw modalStateError.flat();
                    }
                    break;
                case 401:
                    toast.error('Unauthorized');
                    break;
                case 404:
                    history.push('/not-found');
                    break;
                case 500:
                    store.commonStore.setServerError(data);
                    history.push('/server-error');
                    break;
                default:
                    break;
            }
        }
        return Promise.reject(error);
    },
);

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
    create: (activity: ActivityFormValues): Promise<void> => requests.post<void>('/api/activities', activity),
    update: (activity: ActivityFormValues): Promise<void> =>
        requests.put<void>(`/api/activities/${activity.id}`, activity),
    delete: (id: string): Promise<void> => requests.delete<void>(`/api/activities/${id}`),
    attend: (id: string): Promise<void> => requests.post<void>(`api/activities/${id}/attend`, {}),
};

const Account = {
    login: (user: UserFormValues): Promise<User> => requests.post<User>('/api/account/login', user),
    register: (user: UserFormValues): Promise<User> => requests.post<User>('/api/account/register', user),
    current: (): Promise<User> => requests.get<User>('/api/account'),
};

const agent = {
    Activities,
    Account,
};

export default agent;
