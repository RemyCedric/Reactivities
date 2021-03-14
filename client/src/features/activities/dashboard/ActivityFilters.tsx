import React from 'react';
import Calendar from 'react-calendar';
import { Header, Menu } from 'semantic-ui-react';

const ActivityFilters = (): React.ReactElement => (
    <>
        <Menu vertical size="large" style={{ width: '100%', marginTop: 28 }}>
            <Header icon="filter" attached color="teal" content="Filters" />
            <Menu.Item content="All activities" />
            <Menu.Item content="I'm going" />
            <Menu.Item content="I'm hosting" />
        </Menu>
        <Header />
        <Header />
        <Calendar />
    </>
);

export default ActivityFilters;
