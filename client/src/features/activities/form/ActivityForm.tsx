import { observer } from 'mobx-react-lite';
import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/store/store';

const ActivityForm = (): React.ReactElement => {
    const { activityStore } = useStore();
    const { selectedActivity, closeForm, createActivity, updateActivity, loading } = activityStore;

    const initialState = selectedActivity ?? {
        id: '',
        title: '',
        date: '',
        description: '',
        city: '',
        category: '',
        venue: '',
    };

    const [activity, setActivity] = useState(initialState);

    const handleSubmit = (): void => {
        activity.id ? updateActivity(activity) : createActivity(activity);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const { name, value } = event.target;
        setActivity({
            ...activity,
            [name]: value,
        });
    };

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
                <Button floated="right" type="button" content="cancel" onClick={closeForm} />
            </Form>
        </Segment>
    );
};

export default observer(ActivityForm);
