import React from 'react';
import { Container } from 'semantic-ui-react';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router-dom';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDetails from '../../features/activities/details/ActivityDetails';

const App = (): React.ReactElement => {
    const location = useLocation();
    return (
        <>
            <Route exact path="/" component={HomePage} />
            <Route
                path="/(.+)"
                render={() => (
                    <>
                        <NavBar />
                        <Container style={{ marginTop: '7em' }}>
                            <Route exact path="/activities" component={ActivityDashboard} />
                            <Route path="/activities/:id" component={ActivityDetails} />
                            <Route
                                path={['/createActivity', '/manage/:id']}
                                key={location.key}
                                component={ActivityForm}
                            />
                        </Container>
                    </>
                )}
            />
        </>
    );
};

export default observer(App);
