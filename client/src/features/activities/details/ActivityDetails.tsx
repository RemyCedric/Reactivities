import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import { useStore } from '../../../app/store/store';

const ActivityDetails = (): React.ReactElement => {
    const { activityStore } = useStore();
    const { selectedActivity: activity, cancelSelectedActivity, openForm } = activityStore;
    if (!activity) {
        return <></>;
    }

    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activity.title}</Card.Header>
                <Card.Meta>
                    <span>{activity.date}</span>
                </Card.Meta>
                <Card.Description>{activity.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths="2">
                    <Button basic color="blue" content="edit" onClick={() => openForm(activity.id)} />
                    <Button basic color="grey" content="cancel" onClick={cancelSelectedActivity} />
                </Button.Group>
            </Card.Content>
        </Card>
    );
};

export default ActivityDetails;
