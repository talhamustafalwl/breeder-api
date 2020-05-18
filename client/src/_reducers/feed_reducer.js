import {CREATE_FEED,UPDATE_FEED,DELETE_FEED,GET_FEED,GET_FEEDS,
   
    CREATE_FEEDANIMAL,UPDATE_FEEDANIMAL,DELETE_FEEDANIMAL,GET_FEEDANIMAL,GET_FEEDANIMALS} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_FEED:
            return {...state, create: action.payload }
        case UPDATE_FEED:
            return {...state, update: action.payload }
        case DELETE_FEED:
            return {...state, delete: action.payload }
        case GET_FEED:
            return {...state, get: action.payload }
        case GET_FEEDS:
            return {...state, getall: action.payload }


///////---fa== feedanimal
        case CREATE_FEEDANIMAL:
            return {...state, create_fa: action.payload }
        case UPDATE_FEEDANIMAL:
            return {...state, update_fa: action.payload }
        case DELETE_FEEDANIMAL:
            return {...state, delete_fa: action.payload }
        case GET_FEEDANIMAL:
            return {...state, get_fa: action.payload }
        case GET_FEEDANIMALS:
            return {...state, getall_fa: action.payload }
    
        default:
            return state;
    }
}
