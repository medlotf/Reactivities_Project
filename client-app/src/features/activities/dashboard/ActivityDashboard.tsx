import React, { useContext, useEffect } from "react";
import { Grid, List } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite"; 
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityStore from "../../../app/stores/activityStore";


const ActivityDashboard: React.FC = () => {

    //All methods and actions:
    const activityStore = useContext(ActivityStore);

    //useEffect=didMount-willMount-...
    useEffect(() => {
        activityStore.loadActivities();
    }, [activityStore]);

    if (activityStore.loadingInitial)
        return <LoadingComponent content="Loading Activities" />;    
    return (
        <Grid>
            <Grid.Column width={10}>
                <List>
                    <ActivityList />
                </List>
            </Grid.Column>
            <h2>Activity filters</h2>
        </Grid>
    );
};
//observer:for data showed
export default observer(ActivityDashboard);
