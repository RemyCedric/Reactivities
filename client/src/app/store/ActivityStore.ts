/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { Activity } from '../models/activity';
import ActivityFormValues from '../models/activityFormValues';
import { Profile } from '../models/profile';
import { store } from './store';

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return Array.from(this.activityRegistery.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedByDateActivities(): [string, Activity[]][] {
        return Object.entries(
            this.activitiesbyDate.reduce((activities, activity) => {
                const date = activity.date?.toISOString().split('T')[0];
                if (date) {
                    activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                }
                return activities;
            }, {} as { [key: string]: Activity[] }),
        );
    }

    loadActivities = async (): Promise<void> => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => this.setActivity(activity));
            });
        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        } finally {
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
        const { user } = store.userStore;
        if (user) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            activity.isGoing = activity.attendees.some((a) => a.username === user.username);
            activity.isHost = activity.hostUsername === user.username;
            activity.host = activity.attendees.find((x) => x.username === activity.hostUsername);
        }
        activity.date = new Date(activity.date ? activity.date : '');
        this.activityRegistery.set(activity.id, activity);
    };

    createActivity = async (activity: ActivityFormValues): Promise<void> => {
        const { user } = store.userStore;
        const attendee = new Profile(user!);

        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);
            runInAction(() => {
                this.selectedActivity = newActivity;
            });
        } catch (error) {
            console.log(error);
        }
    };

    updateActivity = async (activity: ActivityFormValues): Promise<void> => {
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                if (activity.id) {
                    const updatedActivity = {
                        ...this.getActivity(activity.id),
                        ...activity,
                    };
                    this.activityRegistery.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    deleteActivity = async (id: string): Promise<void> => {
        this.loading = true;
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistery.delete(id);
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    updateAttendance = async (): Promise<void> => {
        const { user } = store.userStore;
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees.filter(
                        (x) => x.username !== user?.username,
                    );
                    this.selectedActivity.isGoing = false;
                } else {
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }
                this.activityRegistery.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };

    cancelActivityToggle = async (): Promise<void> => {
        this.loading = true;
        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistery.set(this.selectedActivity!.id, this.selectedActivity!);
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.loading = false;
            });
        }
    };
}
