import axios from 'axios';
import {GET_BUSINESS,CREATE_BUSINESS,DELETE_BUSINESS,UPDATE_BUSINESS} from './types';



export function getBusiness(id){
    const request = axios.get(`/business/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_BUSINESS,
        payload: request
    }
}


export function createBusiness(data){
    const request = axios.post(`/business`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_BUSINESS,
        payload: request
    }
}

export function updateBusiness(id,data){
    const request = axios.post(`/business/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_BUSINESS,
        payload: request
    }
}

export function deleteBusiness(id){
    const request = axios.post(`/business${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_BUSINESS,
        payload: request
    }
}