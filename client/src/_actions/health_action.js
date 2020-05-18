import axios from 'axios';
import {CREATE_HEALTH,UPDATE_HEALTH,DELETE_HEALTH,GET_HEALTH,GET_HEALTHS,
        GET_ALL_HEALTH,DELETE_ALL_HEALTH} from './types';



export function createHealth(data){
    const request = axios.post(`/health`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_HEALTH,
        payload: request
    }
}


export function updateHealth(id,data){
    const request = axios.patch(`/health/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_HEALTH,
        payload: request
    }
}



export function deleteHealth(id){
    const request = axios.delete(`/health/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_HEALTH,
        payload: request
    }
}


export function getHealth(id){
    const request = axios.get(`/health/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_HEALTH,
        payload: request
    }
}



//specific to breeder
export function getHealths(){
    const request = axios.get(`/health`)
        .then(response => response.data);
    
    return {
        type: GET_HEALTHS,
        payload: request
    }
}

////-------ADMIN--------
export function getAllHealths(){
    const request = axios.get(`/health/all`)
        .then(response => response.data);
    
    return {
        type: GET_ALL_HEALTH,
        payload: request
    }
}


export function deleteAllHealths(){
    const request = axios.delete(`/health/all`)
        .then(response => response.data);
    
    return {
        type: DELETE_ALL_HEALTH,
        payload: request
    }
}
