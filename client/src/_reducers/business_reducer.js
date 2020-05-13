import {GET_BUSINESS,CREATE_BUSINESS,DELETE_BUSINESS,UPDATE_BUSINESS} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case GET_BUSINESS:
            return {...state, get: action.payload }
        case CREATE_BUSINESS:
            return {...state, create: action.payload }
        case DELETE_BUSINESS:
            return {...state, delete: action.payload }
        case UPDATE_BUSINESS:
            return {...state, update: action.payload }
        
        default:
            return state;
    }
}
