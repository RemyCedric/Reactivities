/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik';
import React from 'react';
import { Form, Label } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    rows: number;
    label?: string;
}

const MyTextArea = ({ name, label, placeholder, rows }: Props): React.ReactElement => {
    const [field, meta] = useField(name);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label htmlFor={name}>{label}</label>
            <textarea {...field} name={name} placeholder={placeholder} rows={rows} />
            {meta.touched && meta.error ? (
                <Label basic color="red">
                    {meta.error}
                </Label>
            ) : null}
        </Form.Field>
    );
};

export default MyTextArea;
