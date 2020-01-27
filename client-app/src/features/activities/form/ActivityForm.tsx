import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from "react-router-dom";

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
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input
                    placeholder="Title"
                    value={activity.title}
                    name="title"
                    onChange={handleInputChange}
                ></Form.Input>
                <Form.TextArea
                    rows={2}
                    placeholder="Description"
                    value={activity.description}
                    name="description"
                    onChange={handleInputChange}
                ></Form.TextArea>
                <Form.Input
                    placeholder="Category"
                    value={activity.category}
                    name="category"
                    onChange={handleInputChange}
                ></Form.Input>
                <Form.Input
                    type="datetime-local"
                    placeholder="Date"
                    value={activity.date}
                    name="date"
                    onChange={handleInputChange}
                ></Form.Input>
                <Form.Input
                    placeholder="City"
                    value={activity.city}
                    name="city"
                    onChange={handleInputChange}
                ></Form.Input>
                <Form.Input
                    placeholder="Venue"
                    value={activity.venue}
                    name="venue"
                    onChange={handleInputChange}
                ></Form.Input>
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
        </Segment>
    );
};

export default observer(ActivityForm);
