import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
    @observable activitiesRegistry = new Map(); //all activities
    @observable selectedActivity: IActivity | null = null; //activity selected or not
    @observable loadingInitial = false; //loading cirle
    @observable submitting = false; //submitting cirle
    @observable target = ""; //specify a button with name

    @computed get activitiesByDate() {
        const sortedActivities:IActivity[] = Array.from(this.activitiesRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
        return Object.entries(
            sortedActivities.reduce((activities, activity) => {
                const date = activity.date.split("T")[0];
                activities[date] = activities[date]
                    ? [...activities[date], activity]
                    : [activity];
                return activities;
            }, {} as { [key: string]: IActivity[] })
        );
    }

    //using async and await => database
    @action loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list(); // await: from database
            runInAction("Loading activities", () => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split(".")[0];
                    this.activitiesRegistry.set(activity.id, activity);
                });
                this.loadingInitial = false;
            });
        } catch (error) {
            runInAction("Loading activities error", () => {
                console.log(error);
                this.loadingInitial = false;
            });
        }
    };

    @action loadActivity = async (id: string) => {
        let activity = this.activitiesRegistry.get(id);
        if (activity) {
            this.selectedActivity = activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction("getting activity", () => {
                    this.selectedActivity = activity;
                    this.loadingInitial = false;
                });
            } catch (err) {
                console.log(err);
                runInAction("getting activity error", () => {
                    this.loadingInitial = false;
                });
            }
        }
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity); // await: from database
            runInAction("Create activities", () => {
                this.activitiesRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.submitting = false;
            });
        } catch (err) {
            runInAction("Create activities error", () => {
                console.log(err);
                this.submitting = false;
            });
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity); // await: from database
            runInAction("Edit activities", () => {
                this.activitiesRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
                this.submitting = false;
            });
        } catch (err) {
            runInAction("Edit activities error", () => {
                console.log(err);
                this.submitting = false;
            });
        }
    };

    @action deleteActivity = async (
        event: SyntheticEvent<HTMLButtonElement>,
        id: string
    ) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        try {
            await agent.Activities.delete(id); // await: from database
            runInAction("Delete activities", () => {
                this.activitiesRegistry.delete(id);
                this.submitting = false;
                this.target = "";
            });
        } catch (err) {
            runInAction("Delete activities error", () => {
                console.log(err);
                this.target = "";
                this.submitting = false;
            });
        }
    };

    @action clearActivity = () => {
        this.selectedActivity = null;
    };
}

export default createContext(new ActivityStore());
