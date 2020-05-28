import axios from 'axios';
import {CREATE_CATEGORY,UPDATE_CATEGORY,DELETE_CATEGORY,
    GET_CATEGORY,GET_CATEGORIES} from './types';



export function createCategory(data){
    const request = axios.post(`/category`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_CATEGORY,
        payload: request
    }
}


export function updateCategory(id,data){
    const request = axios.patch(`/category/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_CATEGORY,
        payload: request
    }
}



export function deleteCategory(id){
    const request = axios.delete(`/category/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_CATEGORY,
        payload: request
    }
}


export function getCategory(id){
    const request = axios.get(`/category/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_CATEGORY,
        payload: request
    }
}




export function getCategories(){
    const request = axios.get(`/category/all`)
        .then(response => response.data);
    
    return {
        type: GET_CATEGORIES,
        payload: request
    }
}

