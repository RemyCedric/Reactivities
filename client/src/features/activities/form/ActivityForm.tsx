import { Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Header, Segment } from 'semantic-ui-react';
import { v4 as uuid } from 'uuid';
import * as Yup from 'yup';
import MyDateInput from '../../../app/common/form/MyDateInput';
import MySelectInput from '../../../app/common/form/MySelectInput';
import MyTextArea from '../../../app/common/form/MyTextArea';
import MyTextInput from '../../../app/common/form/MyTextInput';
import categoryOptions from '../../../app/common/options/categoryOption';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Activity } from '../../../app/models/activity';
import { useStore } from '../../../app/store/store';

const ActivityForm = (): React.ReactElement => {
    const { activityStore } = useStore();
    const { createActivity, updateActivity, loading, loadActivity, loadingInitial } = activityStore;
    const { id } = useParams<{ id: string }>();
    const history = useHistory();

    const [activity, setActivity] = useState<Activity>({
        id: '',
        title: '',
        date: null,
        description: '',
        city: '',
        category: '',
        venue: '',
    });

    const validationSchema = Yup.object({
        title: Yup.string().required('The activity title is required'),
        description: Yup.string().required('The activity description is required'),
        category: Yup.string().required(),
        date: Yup.string().required('The activity date is required').nullable(),
        venue: Yup.string().required(),
        city: Yup.string().required(),
    });

    useEffect(() => {
        if (id) {
            loadActivity(id).then((a) => {
                if (a) setActivity(a);
            });
        }
    }, [loadActivity, id]);

    const handleFormSubmit = (activityToSave: Activity): void => {
        if (activityToSave.id.length === 0) {
            const newactivity = {
                ...activityToSave,
                id: uuid(),
            };
            createActivity(newactivity).then(() => {
                history.push(`/activities/${newactivity.id}`);
            });
        } else {
            updateActivity(activityToSave).then(() => {
                history.push(`/activities/${activityToSave.id}`);
            });
        }
    };

    if (loadingInitial) {
        return <LoadingComponent content="Loading activity..." />;
    }

    return (
        <Segment clearing>
            <Header content="Activity Details" sub color="teal" />
            <Formik
                validationSchema={validationSchema}
                enableReinitialize
                initialValues={activity}
                onSubmit={(values) => handleFormSubmit(values)}
            >
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
                        <MyTextInput placeholder="Title" name="title" />
                        <MyTextArea placeholder="Description" name="description" rows={3} />
                        <MySelectInput options={categoryOptions} placeholder="Category" name="category" />
                        <MyDateInput
                            placeholderText="Date"
                            name="date"
                            showTimeSelect
                            timeCaption="time"
                            dateFormat="MMMM d, yyyy h:mm aa"
                        />
                        <Header content="Location Details" sub color="teal" />
                        <MyTextInput placeholder="City" name="city" />
                        <MyTextInput placeholder="Venue" name="venue" />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading}
                            floated="right"
                            positive
                            type="submit"
                            content="submit"
                        />
                        <Button as={Link} to="/activities" floated="right" type="button" content="cancel" />
                    </Form>
                )}
            </Formik>
        </Segment>
    );
};

export default observer(ActivityForm);
