import axios, { AxiosResponse } from "axios";
import { IActivity } from "../models/activity";

//Define the base url
axios.defaults.baseURL = "http://localhost:5000";

//Var resp syntax
const responseBody = (response: AxiosResponse) => response.data;

//Add a delay:
const sleep = (ms: number) => (response: AxiosResponse) =>
    new Promise<AxiosResponse>((resolve) =>
        setTimeout(() => resolve(response), ms)
    );

//Define all the requests : get(list,details),post(create),put(update),delete(delete)
const requests = {
    get: (url: string) =>
        axios
            .get(url)
            .then(sleep(1000))
            .then(responseBody),
    post: (url: string, body: {}) =>
        axios
            .post(url, body)
            .then(sleep(1000))
            .then(responseBody),
    put: (url: string, body: {}) =>
        axios
            .put(url, body)
            .then(sleep(1000))
            .then(responseBody),
    del: (url: string) =>
        axios
            .delete(url)
            .then(sleep(1000))
            .then(responseBody)
};

//Bind(lier) functions with requests
const Activities = {
    list: (): Promise<IActivity[]> => requests.get("/activities"),
    details: (id: string) => requests.get(`/activities/${id}`),
    create: (activity: IActivity) => requests.post("/activities", activity),
    update: (activity: IActivity) =>
        requests.put(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del(`/activities/${id}`)
};

export default {
    Activities
};
