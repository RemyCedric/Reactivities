/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    label?: string;
}

const MyTextInput = ({ name, label, placeholder }: Props): React.ReactElement => {
    const [field, meta] = useField(name);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label htmlFor={name}>{label}</label>
            <input {...field} name={name} placeholder={placeholder} />
            {meta.touched && meta.error ? (
                <Label basic color="red">
                    {meta.error}
                </Label>
            ) : null}
        </Form.Field>
    );
};

export default MyTextInput;
