import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from "react-router-dom";
import { Form as FinalForm, Field } from "react-final-form";
import { values } from "mobx";
import TextInput from "../../../app/common/form/TextInput";

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
    match,
    history
}) => {
    const activityStore = useContext(ActivityStore);
    const {
        createActivity,
        editActivity,
        submitting,
        selectedActivity: InitialActivity,
        loadActivity,
        clearActivity
    } = activityStore;

    const [activity, setActivity] = useState<IActivity>({
        id: "",
        title: "",
        description: "",
        category: "",
        date: "",
        city: "",
        venue: ""
    });

    const handleInputChange = (
        event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.currentTarget;
        setActivity({ ...activity, [name]: value });
    };
    /*
    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            };
            createActivity(newActivity).then(() =>
                history.push(`/activities/${newActivity.id}`)
            );
        } else {
            editActivity(activity).then(() =>
                history.push(`/activities/${activity.id}`)
            );
        }
    };*/

    const handleFinalFormSubmit = (values: any) => {
        console.log(values);
    };

    useEffect(() => {
        if (match.params.id && activity.id.length === 0) {
            loadActivity(match.params.id).then(
                () => InitialActivity && setActivity(InitialActivity)
            );
        }
        return () => {
            clearActivity();
        };
    }, [
        loadActivity,
        clearActivity,
        match.params.id,
        InitialActivity,
        activity.id.length
    ]);

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit }) => (
                            <Form onSubmit={handleSubmit}>
                                <Field
                                    name="title"
                                    placeholder="Title"
                                    value={activity.title}
                                    component={TextInput}
                                />
                                <Field
                                    rows={2}
                                    placeholder="Description"
                                    value={activity.description}
                                    name="description"
                                    component={TextInput}
                                ></Field>
                                <Field
                                    placeholder="Category"
                                    value={activity.category}
                                    name="category"
                                    component={TextInput}
                                ></Field>
                                <Field
                                    placeholder="Date"
                                    value={activity.date}
                                    name="date"
                                    component={TextInput}
                                ></Field>
                                <Field
                                    placeholder="City"
                                    value={activity.city}
                                    name="city"
                                    component={TextInput}
                                ></Field>
                                <Field
                                    placeholder="Venue"
                                    value={activity.venue}
                                    name="venue"
                                    component={TextInput}
                                ></Field>
                                <Button
                                    loading={submitting}
                                    floated="right"
                                    positive
                                    content="Submit"
                                    type="submit"
                                />
                                <Button
                                    floated="right"
                                    content="Cancel"
                                    type="submit"
                                    onClick={() => history.push("/activities")}
                                />
                            </Form>
                        )}
                    />
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityForm);
