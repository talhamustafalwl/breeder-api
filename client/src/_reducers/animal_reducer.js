import {GET_ALL_ANIMALS,DELETE_ALL_ANIMALS,
    CREATE_ANIMAL,UPDATE_ANIMAL,DELETE_ANIMAL, GET_ANIMAL,GET_ANIMALS,FILTER_ANIMALS
    } from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case GET_ALL_ANIMALS:
            return {...state, allanimal: action.payload }
        case DELETE_ALL_ANIMALS:
            return {...state, alldelete: action.payload }

        case CREATE_ANIMAL:
            return {...state, create: action.payload }
        case UPDATE_ANIMAL:
            return {...state, update: action.payload }
        case DELETE_ANIMAL:
            return {...state, delete: action.payload }
        case GET_ANIMAL:
            return {...state, get: action.payload }
        case GET_ANIMALS:
            return {...state, getall: action.payload }
        case FILTER_ANIMALS:
            return {...state, filter: action.payload }

            
        default:
            return state;
    }
}
