/* eslint-disable react/jsx-props-no-spreading */
import { useField } from 'formik';
import React from 'react';
import { DropdownItemProps, Form, Label, Select } from 'semantic-ui-react';

interface Props {
    placeholder: string;
    name: string;
    options: DropdownItemProps[];
    label?: string;
}

const MySelectInput = ({ name, label, placeholder, options }: Props): React.ReactElement => {
    const [field, meta, helpers] = useField(name);
    return (
        <Form.Field error={meta.touched && !!meta.error}>
            <label htmlFor={name}>{label}</label>
            <Select
                clearable
                options={options}
                value={field.value || null}
                onChange={(_, data) => helpers.setValue(data.value)}
                onBlur={() => helpers.setTouched(true)}
                placeholder={placeholder}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red">
                    {meta.error}
                </Label>
            ) : null}
        </Form.Field>
    );
};

export default MySelectInput;
