import axios from 'axios';
import {CREATE_CURRENCY,UPDATE_CURRENCY,DELETE_CURRENCY,GET_CURRENCY,GET_CURRENCIES} from './types';



export function createCurrency(data){
    const request = axios.post(`/currency`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_CURRENCY,
        payload: request
    }
}


export function updateCurrency(id,data){
    const request = axios.put(`/currency/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_CURRENCY,
        payload: request
    }
}



export function deleteCurrency(id){
    const request = axios.delete(`/currency/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_CURRENCY,
        payload: request
    }
}


export function getCurrency(id){
    const request = axios.get(`/currency/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_CURRENCY,
        payload: request
    }
}




export function getCurrencies(){
    const request = axios.get(`/currency`)
        .then(response => response.data);
    
    return {
        type: GET_CURRENCIES,
        payload: request
    }
}

