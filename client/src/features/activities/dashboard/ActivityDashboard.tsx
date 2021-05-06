import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/store/store';
import ActivityFilters from './ActivityFilters';
import ActivityList from './ActivityList';

const ActivityDashboard = (): React.ReactElement => {
    const {
        activityStore: { loadActivities, activityRegistery, loadingInitial },
    } = useStore();
    useEffect(() => {
        if (activityRegistery.size <= 1) {
            loadActivities();
        }
    }, [loadActivities, activityRegistery.size]);

    if (loadingInitial) {
        return <LoadingComponent />;
    }

    return (
        <Grid>
            <Grid.Column width="10">
                <ActivityList />
            </Grid.Column>
            <Grid.Column width="6">
                <ActivityFilters />
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDashboard);
