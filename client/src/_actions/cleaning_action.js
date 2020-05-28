import axios from 'axios';
import {CREATE_CLEANING,UPDATE_CLEANING,DELETE_CLEANING,GET_CLEANING,GET_CLEANINGS,
   
    CREATE_CLEANINGANIMAL,UPDATE_CLEANINGANIMAL,DELETE_CLEANINGANIMAL,GET_CLEANINGANIMAL,GET_CLEANINGANIMALS} from './types';



export function createCleaning(data){
    const request = axios.post(`/cleaning`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_CLEANING,
        payload: request
    }
}


export function updateCleaning(id,data){
    const request = axios.patch(`/cleaning/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_CLEANING,
        payload: request
    }
}



export function deleteCleaning(id){
    const request = axios.delete(`/cleaning/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_CLEANING,
        payload: request
    }
}


export function getCleaning(id){
    const request = axios.get(`/cleaning/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_CLEANING,
        payload: request
    }
}



//of specific breeder
export function getCleanings(){
    const request = axios.get(`/cleaning`)
        .then(response => response.data);
    
    return {
        type: GET_CLEANINGS,
        payload: request
    }
}


///cleaning animal


export function createCleaningAnimal(data){
    const request = axios.post(`/cleaninganimal`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_CLEANINGANIMAL,
        payload: request
    }
}


export function updateCleaningAnimal(id,data){
    const request = axios.patch(`/cleaninganimal/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_CLEANINGANIMAL,
        payload: request
    }
}



export function deleteCleaningAnimal(id){
    const request = axios.delete(`/cleaninganimal/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_CLEANINGANIMAL,
        payload: request
    }
}


export function getCleaningAnimal(id){
    const request = axios.get(`/cleaninganimal/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_CLEANINGANIMAL,
        payload: request
    }
}



//of specific breeders
export function getCleaningAnimals(){
    const request = axios.get(`/cleaninganimal/`)
        .then(response => response.data);
    
    return {
        type: GET_CLEANINGANIMALS,
        payload: request
    }
}
