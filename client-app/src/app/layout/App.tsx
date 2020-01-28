import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import HomePage from "../../features/home/HomePage";
import { observer } from "mobx-react-lite";
import { ToastContainer } from "react-toastify";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import {
    Route,
    withRouter,
    RouteComponentProps,
    Switch
} from "react-router-dom";

const App: React.FC<RouteComponentProps> = ({ location }) => {
    return (
        <Fragment>
            <ToastContainer position="bottom-right" />
            <Route exact path="/" component={HomePage} />
            <Route
                path={"/(.+)"}
                render={() => (
                    <Fragment>
                        <NavBar />
                        <Container style={{ marginTop: "7em" }}>
                            <Switch>
                                <Route
                                    exact
                                    path="/activities"
                                    component={ActivityDashboard}
                                />
                                <Route
                                    path="/activities/:id"
                                    component={ActivityDetails}
                                />
                                <Route
                                    key={location.key} //comment la clé change on recharge le component
                                    path={[
                                        "/createActivity",
                                        "/editActivity/:id"
                                    ]}
                                    component={ActivityForm}
                                />
                                <Route component={NotFound} />
                            </Switch>
                        </Container>
                    </Fragment>
                )}
            />
        </Fragment>
    );
};

export default withRouter(observer(App));
