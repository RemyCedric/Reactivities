import React, { ChangeEvent, useState } from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import { Activity } from '../../../app/models/activity';

interface Props {
    activity: Activity | undefined;
    closeForm: () => void;
    createOrUpdateActivity: (activity: Activity) => void;
}

const ActivityForm = ({ activity: selectedActivity, closeForm, createOrUpdateActivity }: Props): React.ReactElement => {
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
        createOrUpdateActivity(activity);
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
                <Button floated="right" positive type="submit" content="submit" />
                <Button floated="right" type="button" content="cancel" onClick={closeForm} />
            </Form>
        </Segment>
    );
};

export default ActivityForm;
