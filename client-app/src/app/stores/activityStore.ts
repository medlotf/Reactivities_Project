import { observable, action , computed, configure,runInAction} from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({enforceActions:'always'});

class ActivityStore {
    @observable activitiesRegistry=new Map();
    @observable activities: IActivity[] = [];
    @observable selectedActivity: IActivity | undefined;
    @observable loadingInitial = false;
    @observable editMode = false;
    @observable submitting=false;
    @observable target='';

    @computed get activitiesByDate(){
        return Array.from(this.activitiesRegistry.values()).sort((a,b)=>Date.parse(a.date)-Date.parse(b.date));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;
        try{
            const activities=await agent.Activities.list();
            runInAction('Loading activities',()=>{
                activities.forEach((activity) => {
                    activity.date = activity.date.split(".")[0];
                    this.activitiesRegistry.set(activity.id,activity);
                });
                this.loadingInitial = false;
            })
        }
        catch(error){
            runInAction('Loading activities error',()=>{
                console.log(error);
                this.loadingInitial = false;
            })
        }
    };

    @action selectActivity=(id:string)=>{
        this.selectedActivity=this.activitiesRegistry.get(id);
        this.editMode=false;
    }

    @action createActivity=async (activity:IActivity)=>{
        this.submitting=true;
        try{
            await agent.Activities.create(activity);
            runInAction('Create activities',()=>{
                this.activitiesRegistry.set(activity.id,activity);
                this.editMode=false;
                this.selectedActivity=activity;
                this.submitting=false;
            })
        }catch(err){
            runInAction('Create activities error',()=>{
                console.log(err);
                this.submitting=false;
            })
        }  
    }

    @action openCreateForm= ()=>{
        this.editMode=true;
        this.selectedActivity=undefined;
    }

    @action openEditForm=(id:string)=>{
        this.activitiesRegistry.get(id);
        this.editMode=true;
    }

    @action cancelSelectedActivity=()=>{
        this.selectedActivity=undefined;
    }

    @action closeForm=()=>{
        this.editMode=false;
    }

    @action editActivity=async (activity:IActivity)=>{
        this.submitting=true;
        try{
            await agent.Activities.update(activity);
            runInAction('Edit activities',()=>{
                this.activitiesRegistry.set(activity.id,activity);
                this.selectedActivity=activity;
                this.editMode=false;
                this.submitting=false;
            })
        }catch(err){
            runInAction('Edit activities error',()=>{
                console.log(err);
                this.submitting=false;
            })
        }  
    }

    @action deleteActivity=async (event: SyntheticEvent<HTMLButtonElement>,id:string)=>{
        this.submitting=true;
        this.target=event.currentTarget.name;
        try{
            await agent.Activities.delete(id);
            runInAction('Delete activities',()=>{
                this.activitiesRegistry.delete(id);
                this.submitting=false;
                this.target='';
            })
        }catch(err){
            runInAction('Delete activities error',()=>{
                console.log(err);
                this.target='';
                this.submitting=false;
            })
        }  
    }
}

export default createContext(new ActivityStore());
