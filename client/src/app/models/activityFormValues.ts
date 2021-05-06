export default class ActivityFormValues {
    id?: string = undefined;

    title = '';

    date: Date | null = null;

    description = '';

    city = '';

    category = '';

    venue = '';

    constructor(activity?: ActivityFormValues) {
        if (activity) {
            this.id = activity.id;
            this.title = activity.title;
            this.date = activity.date;
            this.description = activity.description;
            this.city = activity.city;
            this.category = activity.category;
            this.venue = activity.venue;
        }
    }
}
