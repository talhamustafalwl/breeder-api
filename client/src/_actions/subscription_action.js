import axios from 'axios';
import {CREATE_SUBSCRIPTION,UPDATE_SUBSCRIPTION,DELETE_SUBSCRIPTIONS,DELETE_SUBSCRIPTION,
GET_SUBSCRIPTIONS,GET_SUBSCRIPTION,
GET_SUBSCRIBER,DELETE_SUBSCRIBER,UPDATE_SUBSCRIBER,GET_SUBSCRIBERS,
CREATE_SUBSCRIBER_STRIPE} from './types';


export function createSubscription(dataToSubmit){
    const request = axios.post(`/subscription`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: CREATE_SUBSCRIPTION,
        payload: request
    }
}


export function updateSubscription(id,dataToSubmit){
    const request = axios.patch(`/subscription/${id}`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: UPDATE_SUBSCRIPTION,
        payload: request
    }
}



export function deleteSubscription(id){
    const request = axios.delete(`/subscription/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_SUBSCRIPTION,
        payload: request
    }
}


export function deleteSubscriptions(){
    const request = axios.delete(`/subscription`)
        .then(response => response.data);
    
    return {
        type: DELETE_SUBSCRIPTIONS,
        payload: request
    }
}


export function getSubscriptions(){
    const request = axios.get(`/subscription`)
        .then(response => response.data);
    
    return {
        type: GET_SUBSCRIPTIONS,
        payload: request
    }
}

export function getSubscription(id){
    const request = axios.get(`/subscription/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_SUBSCRIPTION,
        payload: request
    }
}

export function getSubscriber(id){
    const request = axios.get(`/subscriber/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_SUBSCRIBER,
        payload: request
    }
}


export function getSubscribers(){
    const request = axios.get(`/subscriber`)
        .then(response => response.data);
    
    return {
        type: GET_SUBSCRIBERS,
        payload: request
    }
}


export function deleteSubscriber(id){
    const request = axios.delete(`/subscriber/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_SUBSCRIBER,
        payload: request
    }
}


export function updateSubscriber(id,dataToSubmit){
    const request = axios.get(`/subscriber/${id}`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: UPDATE_SUBSCRIBER,
        payload: request
    }
}

export function createSubscriberStripe(dataToSubmit){
    const request = axios.get(`/subscriber/stripe`,dataToSubmit)
        .then(response => response.data);
    
    return {
        type: CREATE_SUBSCRIBER_STRIPE,
        payload: request
    }
}



