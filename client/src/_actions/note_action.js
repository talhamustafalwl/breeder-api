import axios from 'axios';
import {CREATE_NOTE,UPDATE_NOTE,DELETE_NOTE,GET_NOTE,GET_NOTES,
        } from './types';



export function createNote(data){
    const request = axios.post(`/note`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_NOTE,
        payload: request
    }
}


export function updateNote(id,data){
    const request = axios.patch(`/note/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_NOTE,
        payload: request
    }
}



export function deleteNote(id){
    const request = axios.delete(`/note/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_NOTE,
        payload: request
    }
}


export function getNote(id){
    const request = axios.get(`/note/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_NOTE,
        payload: request
    }
}



//specific to breeder
export function getNotes(){
    const request = axios.get(`/note`)
        .then(response => response.data);
    
    return {
        type: GET_NOTES,
        payload: request
    }
}

