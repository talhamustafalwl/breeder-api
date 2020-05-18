import axios from 'axios';
import {GET_ALL_ANIMALS,DELETE_ALL_ANIMALS,
    CREATE_ANIMAL,UPDATE_ANIMAL,DELETE_ANIMAL, GET_ANIMAL,GET_ANIMALS,FILTER_ANIMALS} from './types';


//admin
export function getAnimalall(){
    const request = axios.get(`/animal/all`)
        .then(response => response.data);
    
    return {
        type: GET_ALL_ANIMALS,
        payload: request
    }
}

//admin
export function deleteAnimalall(){
    const request = axios.delete(`/animal/all`)
        .then(response => response.data);
    
    return {
        type: DELETE_ALL_ANIMALS,
        payload: request
    }
}

//animals of breeder specific
export function getAnimals(){
    const request = axios.get(`/animal`)
        .then(response => response.data);
    
    return {
        type: GET_ANIMALS,
        payload: request
    }
}

export function getAnimal(id){
    const request = axios.get(`/animal/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_ANIMAL,
        payload: request
    }
}

export function updateAnimal(data){
    const request = axios.patch(`/animal`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_ANIMAL,
        payload: request
    }
}

export function deleteAnimal(id){
    const request = axios.delete(`/animal${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_ANIMAL,
        payload: request
    }
}

export function createAnimal(data){
    const request = axios.post(`/animal`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_ANIMAL,
        payload: request
    }
}

export function filterAnimal(name,acquired,categoryName,price,date){
    const request = axios.get(`/animal?name=${name}&acquired=${acquired}&categoryName=${categoryName}&price=${price}&date=${date}`)
        .then(response => response.data);
    
    return {
        type: FILTER_ANIMALS,
        payload: request
    }
}