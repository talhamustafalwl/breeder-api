import axios from 'axios';
import {CREATE_FEED,UPDATE_FEED,DELETE_FEED,GET_FEED,GET_FEEDS,
   
    CREATE_FEEDANIMAL,UPDATE_FEEDANIMAL,DELETE_FEEDANIMAL,GET_FEEDANIMAL,GET_FEEDANIMALS} from './types';



export function createFeed(data){
    const request = axios.post(`/feed`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_FEED,
        payload: request
    }
}


export function updateFeed(id,data){
    const request = axios.patch(`/feed/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_FEED,
        payload: request
    }
}



export function deleteFeed(id){
    const request = axios.delete(`/feed/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_FEED,
        payload: request
    }
}


export function getFeed(id){
    const request = axios.get(`/feed/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_FEED,
        payload: request
    }
}




export function getFeeds(){
    const request = axios.get(`/feed/all`)
        .then(response => response.data);
    
    return {
        type: GET_FEEDS,
        payload: request
    }
}


///feed animal


export function createFeedAnimal(data){
    const request = axios.post(`/feedanimal`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_FEEDANIMAL,
        payload: request
    }
}


export function updateFeedAnimal(id,data){
    const request = axios.patch(`/feedanimal/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_FEEDANIMAL,
        payload: request
    }
}



export function deleteFeedAnimal(id){
    const request = axios.delete(`/feedanimal/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_FEEDANIMAL,
        payload: request
    }
}


export function getFeedAnimal(id){
    const request = axios.get(`/feedanimal/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_FEEDANIMAL,
        payload: request
    }
}




export function getFeedAnimals(){
    const request = axios.get(`/feedanimal/all`)
        .then(response => response.data);
    
    return {
        type: GET_FEEDANIMALS,
        payload: request
    }
}
