import {CREATE_CLEANING,UPDATE_CLEANING,DELETE_CLEANING,GET_CLEANING,GET_CLEANINGS,
   
    CREATE_CLEANINGANIMAL,UPDATE_CLEANINGANIMAL,DELETE_CLEANINGANIMAL,GET_CLEANINGANIMAL,GET_CLEANINGANIMALS} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_CLEANING:
            return {...state, create: action.payload }
        case UPDATE_CLEANING:
            return {...state, update: action.payload }
        case DELETE_CLEANING:
            return {...state, delete: action.payload }
        case GET_CLEANING:
            return {...state, get: action.payload }
        case GET_CLEANINGS:
            return {...state, getall: action.payload }


/////// ca== cleaninganimal
        case CREATE_CLEANINGANIMAL:
            return {...state, create_ca: action.payload }
        case UPDATE_CLEANINGANIMAL:
            return {...state, update_ca: action.payload }
        case DELETE_CLEANINGANIMAL:
            return {...state, delete_ca: action.payload }
        case GET_CLEANINGANIMAL:
            return {...state, get_ca: action.payload }
        case GET_CLEANINGANIMALS:
            return {...state, getall_ca: action.payload }
    
        default:
            return state;
    }
}
