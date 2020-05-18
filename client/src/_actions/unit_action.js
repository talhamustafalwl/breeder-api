import axios from 'axios';
import {CREATE_UNIT,UPDATE_UNIT,DELETE_UNIT,GET_UNIT,GET_UNITS} from './types';



export function createUnit(data){
    const request = axios.post(`/unit`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_UNIT,
        payload: request
    }
}


export function updateUnit(id,data){
    const request = axios.patch(`/unit/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_UNIT,
        payload: request
    }
}



export function deleteUnit(id){
    const request = axios.delete(`/unit/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_UNIT,
        payload: request
    }
}


export function getUnit(id){
    const request = axios.get(`/unit/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_UNIT,
        payload: request
    }
}




export function getUnits(){
    const request = axios.get(`/unit/all`)
        .then(response => response.data);
    
    return {
        type: GET_UNITS,
        payload: request
    }
}

