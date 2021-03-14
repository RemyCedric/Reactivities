import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Card, Image } from 'semantic-ui-react';
import { useStore } from '../../../app/store/store';

const ActivityDetails = (): React.ReactElement => {
    const { activityStore } = useStore();
    const { selectedActivity: activity, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        if (id) {
            loadActivity(id);
        }
    }, [id, loadActivity]);

    if (loadingInitial || !activity) {
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
                    <Button as={Link} to={`/manage/${activity.id}`} basic color="blue" content="edit" />
                    <Button as={Link} to="/activities" basic color="grey" content="cancel" />
                </Button.Group>
            </Card.Content>
        </Card>
    );
};

export default observer(ActivityDetails);
