import axios from 'axios';
import {CREATE_VACINATION,UPDATE_VACINATION,DELETE_VACINATION,GET_VACINATION,GET_VACINATIONS,
   
    CREATE_VACINATIONANIMAL,UPDATE_VACINATIONANIMAL,DELETE_VACINATIONANIMAL,GET_VACINATIONANIMAL,GET_VACINATIONANIMALS} from './types';



export function createVacination(data){
    const request = axios.post(`/vacination`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_VACINATION,
        payload: request
    }
}


export function updateVacination(id,data){
    const request = axios.patch(`/vacination/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_VACINATION,
        payload: request
    }
}



export function deleteVacination(id){
    const request = axios.delete(`/vacination/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_VACINATION,
        payload: request
    }
}


export function getVacination(id){
    const request = axios.get(`/vacination/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_VACINATION,
        payload: request
    }
}



//of specific breeder
export function getVacinations(){
    const request = axios.get(`/vacination`)
        .then(response => response.data);
    
    return {
        type: GET_VACINATIONS,
        payload: request
    }
}


///vacination animal


export function createVacinationAnimal(data){
    const request = axios.post(`/vacinationanimal`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_VACINATIONANIMAL,
        payload: request
    }
}


export function updateVacinationAnimal(id,data){
    const request = axios.patch(`/vacinationanimal/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_VACINATIONANIMAL,
        payload: request
    }
}



export function deleteVacinationAnimal(id){
    const request = axios.delete(`/vacinationanimal/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_VACINATIONANIMAL,
        payload: request
    }
}


export function getVacinationAnimal(id){
    const request = axios.get(`/vacinationanimal/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_VACINATIONANIMAL,
        payload: request
    }
}



//of specific breeders
export function getVacinationAnimals(){
    const request = axios.get(`/vacinationanimal/`)
        .then(response => response.data);
    
    return {
        type: GET_VACINATIONANIMALS,
        payload: request
    }
}
