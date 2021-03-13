import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import { Activity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';

const App = (): React.ReactElement => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Activity | undefined>(undefined);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        axios.get<Activity[]>('http://localhost:5000/api/activities').then((response) => {
            setActivities(response.data);
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
        activity.id
            ? setActivities([...activities.filter((x) => x.id !== activity.id), activity])
            : setActivities([...activities, { ...activity, id: uuid() }]);
        setEditMode(false);
        setSelectedActivity(activity);
    };

    const handleDeleteActivity = (id: string): void => {
        setActivities([...activities.filter((x) => x.id !== id)]);
    };
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
                />
            </Container>
        </>
    );
};

export default App;
