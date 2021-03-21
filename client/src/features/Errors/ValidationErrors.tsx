/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Message } from 'semantic-ui-react';

interface Props {
    errors: any;
}

const ValidationErrors = ({ errors }: Props): React.ReactElement => {
    return (
        <Message error>
            {errors && (
                <Message.List>
                    {errors.map((error: any) => (
                        <Message.Item key={`${error}`}>{error}</Message.Item>
                    ))}
                </Message.List>
            )}
        </Message>
    );
};

export default ValidationErrors;
