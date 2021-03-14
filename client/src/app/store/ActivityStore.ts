import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Activity } from '../models/activity';

export default class ActivityStore {
    activityRegistery = new Map<string, Activity>();

    selectedActivity: Activity | undefined = undefined;

    editMode = false;

    loading = false;

    loadingInitial = false;

    constructor() {
        makeAutoObservable(this);
    }

    get activitiesbyDate(): Activity[] {
        return Array.from(this.activityRegistery.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    loadActivities = async (): Promise<void> => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => this.setActivity(activity));
                this.loadingInitial = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            });
        }
    };

    loadActivity = async (id: string): Promise<Activity | undefined> => {
        let activity = this.getActivity(id);
        if (activity) {
            this.selectedActivity = activity;
            return activity;
        }
        this.loadingInitial = true;
        try {
            activity = await agent.Activities.details(id);
            this.setActivity(activity);
            runInAction(() => {
                this.selectedActivity = activity;
                this.loadingInitial = false;
            });
            return activity;
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            });
        }
        return undefined;
    };

    private getActivity = (id: string): Activity | undefined => {
        return this.activityRegistery.get(id);
    };

    private setActivity = (activity: Activity): void => {
        // eslint-disable-next-line prefer-destructuring
        activity.date = activity.date.split('T')[0];
        this.activityRegistery.set(activity.id, activity);
    };

    createActivity = async (activity: Activity): Promise<void> => {
        this.loading = true;
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
                this.loading = false;
            });
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            });
        }
    };
}
