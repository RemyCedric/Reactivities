import { makeAutoObservable, runInAction } from 'mobx';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import { Activity } from '../models/activity';

export default class ActivityStore {
    activityRegistery = new Map<string, Activity>();

    selectedActivity: Activity | undefined = undefined;

    editMode = false;

    loading = false;

    loadingInitial = true;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesbyDate(): Activity[] {
        return Array.from(this.activityRegistery.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async (): Promise<void> => {
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => {
                    // eslint-disable-next-line prefer-destructuring
                    activity.date = activity.date.split('T')[0];
                    this.activityRegistery.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            });
        }
    };

    createActivity = async (activity: Activity): Promise<void> => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistery.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    updateActivity = async (activity: Activity): Promise<void> => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistery.set(activity.id, activity);
                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    deleteActivity = async (id: string): Promise<void> => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistery.delete(id);
                if (this.selectedActivity?.id === id) {
                    this.editMode = false;
                    this.cancelSelectedActivity();
                }
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    selectActivity = (id: string): void => {
        this.selectedActivity = this.activityRegistery.get(id);
    };

    cancelSelectedActivity = (): void => {
        this.selectedActivity = undefined;
    };

    openForm = (id?: string): void => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    };

    closeForm = (): void => {
        this.editMode = false;
    };
}
