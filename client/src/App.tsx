import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Header, List } from 'semantic-ui-react';
import './App.css';

interface Activity {
    id: string;
    title: string;
}

export function App(): JSX.Element {
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/activities').then((response) => {
            setActivities(response.data);
        });
    }, []);

    return (
        <div>
            <Header as="h2" icon="users" content="Reactivities" />
            <List>
                {activities.map((activity: Activity) => {
                    return <List.Item key={activity.id}>{activity.title}</List.Item>;
                })}
            </List>
        </div>
    );
}

export default App;
