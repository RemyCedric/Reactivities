import { makeAutoObservable, runInAction } from 'mobx';
import { history } from '../..';
import agent from '../api/agent';
import { User, UserFormValues } from '../models/user';
import { store } from './store';

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn(): boolean {
        return !!this.user;
    }

    register = async (creds: UserFormValues): Promise<void> => {
        const user = await agent.Account.register(creds);
        runInAction(() => {
            store.commonStore.setToken(user.token);
            this.user = user;
        });
        history.push('/activities');
        store.modalStore.closeModal();
    };

    login = async (creds: UserFormValues): Promise<void> => {
        const user = await agent.Account.login(creds);
        runInAction(() => {
            store.commonStore.setToken(user.token);
            this.user = user;
        });
        history.push('/activities');
        store.modalStore.closeModal();
    };

    logout = (): void => {
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user = null;
        history.push('/');
    };

    getUser = async (): Promise<void> => {
        try {
            const user = await agent.Account.current();
            runInAction(() => {
                this.user = user;
            });
        } catch (error) {
            console.log(error);
        }
    };
}
