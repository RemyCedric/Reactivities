import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Form, Segment } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/store/store';

const ActivityForm = (): React.ReactElement => {
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    const [activity, setActivity] = useState({
        id: '',
        title: '',
        date: '',
        description: '',
        city: '',
        category: '',
        venue: '',
    });

    useEffect(() => {
        if (id) {
            loadActivity(id).then((a) => {
                if (a) setActivity(a);
            });
        }
    }, [loadActivity, id]);

    const handleSubmit = (): void => {
        if (activity.id.length === 0) {
            const newactivity = {
                ...activity,
                id: uuid(),
            };
            createActivity(newactivity).then(() => {
                history.push(`/activities/${newactivity.id}`);
            });
        } else {
            updateActivity(activity).then(() => {
                history.push(`/activities/${activity.id}`);
            });
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = event.target;
        setActivity({
            ...activity,
            [name]: value,
        });
    };

    if (loadingInitial) {
        return <LoadingComponent content="Loading activity..." />;
    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete="off">
                <Form.Input
                    placeholder="Title"
                    value={activity.title}
                    name="title"
                    onChange={(event) => handleInputChange(event)}
                />
                <Form.TextArea
                    placeholder="Description"
                    value={activity.description}
                    name="description"
                    onChange={(event) => handleInputChange(event)}
                />
                <Form.Input
                    placeholder="Category"
                    value={activity.category}
                    name="category"
                    onChange={(event) => handleInputChange(event)}
                />
                <Form.Input
                    type="date"
                    placeholder="Date"
                    value={activity.date}
                    name="date"
                    onChange={(event) => handleInputChange(event)}
                />
                <Form.Input
                    placeholder="City"
                    value={activity.city}
                    name="city"
                    onChange={(event) => handleInputChange(event)}
                />
                <Form.Input
                    placeholder="Venue"
                    value={activity.venue}
                    name="venue"
                    onChange={(event) => handleInputChange(event)}
                />
                <Button loading={loading} floated="right" positive type="submit" content="submit" />
                <Button as={Link} to="/activities" floated="right" type="button" content="cancel" />
            </Form>
        </Segment>
    );
};

export default observer(ActivityForm);
