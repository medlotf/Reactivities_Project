import React, { useState, FormEvent } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";

interface IProps {
    setEditMode: (editMode: boolean) => void;
    activity: IActivity;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
}

const ActivityForm: React.FC<IProps> = ({
    setEditMode,
    activity: InitialActivity,
    editActivity,
    createActivity
}) => {
    const initializeForm = () => {
        if (InitialActivity) return InitialActivity;
        return {
            id: "",
            title: "",
            description: "",
            category: "",
            date: "",
            city: "",
            venue: ""
        };
    };

    const [activity, setActivity] = useState<IActivity>(initializeForm);

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
            createActivity(newActivity);
        } else {
            editActivity(activity);
        }
    };

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
                    type="date"
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
                    floated="right"
                    positive
                    content="Submit"
                    type="submit"
                />
                <Button
                    floated="right"
                    content="Cancel"
                    type="submit"
                    onClick={() => setEditMode(false)}
                />
            </Form>
        </Segment>
    );
};

export default ActivityForm;
