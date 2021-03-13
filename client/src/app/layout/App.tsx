import React, { useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';

const App = (): React.ReactElement => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        agent.Activities.list().then((response) => {
            const activitiesApi: Activity[] = [];
            response.forEach((activity) => {
                activitiesApi.push({ ...activity, date: activity.date.split('T')[0] });
            });
            setActivities(activitiesApi);
            setLoading(false);
        });
    }, []);

    const handleSelectActivity = (id: string): void => {
        setSelectedActivity(activities.find((x) => x.id === id));
    };

    const handleCancelSelectActivity = (): void => {
        setSelectedActivity(undefined);
    };

    const handleFormOpen = (id?: string): void => {
        id ? handleSelectActivity(id) : handleCancelSelectActivity();
        setEditMode(true);
    };

    const handleFormClose = (): void => {
        setEditMode(false);
    };

    const handleCreateOrUpdateActivity = (activity: Activity): void => {
        setSubmitting(true);
        if (activity.id) {
            agent.Activities.update(activity).then(() => {
                setActivities([...activities.filter((x) => x.id !== activity.id), activity]);
                setSelectedActivity(activity);
                setEditMode(false);
                setSubmitting(false);
            });
        } else {
            agent.Activities.create({ ...activity, id: uuid() }).then(() => {
                setActivities([...activities, { ...activity, id: uuid() }]);
                setSelectedActivity(activity);
                setEditMode(false);
                setSubmitting(false);
            });
        }
    };

    const handleDeleteActivity = (id: string): void => {
        setSubmitting(true);
        agent.Activities.delete(id).then(() => {
            setActivities([...activities.filter((x) => x.id !== id)]);
            setSubmitting(false);
        });
    };

    if (loading) {
        return <LoadingComponent />;
    }
    return (
        <>
            <NavBar openForm={handleFormOpen} />
            <Container style={{ marginTop: '7em' }}>
                <ActivityDashboard
                    activities={activities}
                    selectedActivity={selectedActivity}
                    selectActivity={handleSelectActivity}
                    cancelSelectActivity={handleCancelSelectActivity}
                    editMode={editMode}
                    openForm={handleFormOpen}
                    closeForm={handleFormClose}
                    createOrUpdateActivity={handleCreateOrUpdateActivity}
                    deleteActivity={handleDeleteActivity}
                    submitting={submitting}
                />
            </Container>
        </>
    );
};

export default App;
