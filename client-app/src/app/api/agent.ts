//Fichier lien end tre front-end and back-end:

import axios, { AxiosResponse } from "axios";
import { IActivity } from "../models/activity";
import { history } from "../..";
import { toast } from "react-toastify";

//Define the base url
axios.defaults.baseURL = "http://localhost:5000";

axios.interceptors.response.use(undefined, (error) => {
    if (error.message === "Network Error" && !error.response) {
        toast.error("Network error - make sure your API is running!");
    }
    const { status, data, config } = error.response;
    if (status === 404) {
        history.push("/notfound");
    }
    if (
        status === 400 &&
        config.method === "get" &&
        data.errors.hasOwnProperty("id")
    ) {
        history.push("/notfound");
    }

    if (status === 500) {
        toast.error("Server error - check the console for more info!");
    }
});

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
