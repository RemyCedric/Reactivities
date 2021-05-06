import ActivityFormValues from './activityFormValues';
import { Profile } from './profile';

export interface Activity {
    id: string;
    title: string;
    date: Date | null;
    description: string;
    city: string;
    category: string;
    venue: string;
    hostUsername: string;
    isCancelled: boolean;
    isGoing: boolean;
    isHost: boolean;
    host?: Profile;
    attendees: Profile[];
}

export class Activity implements Activity {
    constructor(init?: ActivityFormValues) {
        Object.assign(this, init);
    }
}
