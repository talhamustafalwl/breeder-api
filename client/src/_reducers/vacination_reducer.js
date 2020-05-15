import {CREATE_VACINATION,UPDATE_VACINATION,DELETE_VACINATION,GET_VACINATION,GET_VACINATIONS,
   
    CREATE_VACINATIONANIMAL,UPDATE_VACINATIONANIMAL,DELETE_VACINATIONANIMAL,GET_VACINATIONANIMAL,GET_VACINATIONANIMALS} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_VACINATION:
            return {...state, create: action.payload }
        case UPDATE_VACINATION:
            return {...state, update: action.payload }
        case DELETE_VACINATION:
            return {...state, delete: action.payload }
        case GET_VACINATION:
            return {...state, get: action.payload }
        case GET_VACINATIONS:
            return {...state, getall: action.payload }


/////// va== vacination animal
        case CREATE_VACINATIONANIMAL:
            return {...state, create_va: action.payload }
        case UPDATE_VACINATIONANIMAL:
            return {...state, update_va: action.payload }
        case DELETE_VACINATIONANIMAL:
            return {...state, delete_va: action.payload }
        case GET_VACINATIONANIMAL:
            return {...state, get_va: action.payload }
        case GET_VACINATIONANIMALS:
            return {...state, getall_va: action.payload }
    
        default:
            return state;
    }
}
