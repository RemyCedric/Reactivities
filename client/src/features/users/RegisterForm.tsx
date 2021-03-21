import React from 'react';
import { ErrorMessage, Form, Formik } from 'formik';
import { Button, Header } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/store/store';
import ValidationErrors from '../errors/ValidationErrors';

const RegisterForm = (): React.ReactElement => {
    const { userStore } = useStore();

    const validationSchema = Yup.object({
        displayName: Yup.string().required(),
        username: Yup.string().required(),
        email: Yup.string().required().email(),
        password: Yup.string().required(),
    });

    return (
        <Formik
            initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
            validationSchema={validationSchema}
            onSubmit={(values, { setErrors }) => userStore.register(values).catch((error) => setErrors({ error }))}
        >
            {({ handleSubmit, isValid, dirty, isSubmitting, errors }) => (
                <Form className="ui form error" onSubmit={handleSubmit} autoComplete="off">
                    <Header as="h2" content="Sign up to Reactivties" color="teal" textAlign="center" />
                    <MyTextInput name="displayName" placeholder="display Name" />
                    <MyTextInput name="username" placeholder="Username" />
                    <MyTextInput name="email" placeholder="Email" />
                    <MyTextInput name="password" placeholder="Password" type="password" />
                    <ErrorMessage name="error" render={() => <ValidationErrors errors={errors.error} />} />
                    <Button
                        disabled={!isValid || !dirty || isSubmitting}
                        loading={isSubmitting}
                        positive
                        content="Register"
                        type="submit"
                        fluid
                    />
                </Form>
            )}
        </Formik>
    );
};

export default observer(RegisterForm);
