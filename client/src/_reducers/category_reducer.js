import {CREATE_CATEGORY,UPDATE_CATEGORY,DELETE_CATEGORY,
    GET_CATEGORY,GET_CATEGORIES} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_CATEGORY:
            return {...state, create: action.payload }
        case UPDATE_CATEGORY:
            return {...state, update: action.payload }
        case DELETE_CATEGORY:
            return {...state, delete: action.payload }


        case GET_CATEGORY:
            return {...state, get: action.payload }
        case GET_CATEGORIES:
            return {...state, getall: action.payload }
        default:
            return state;
    }
}
