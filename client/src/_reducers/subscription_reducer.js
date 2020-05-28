import {CREATE_SUBSCRIPTION,UPDATE_SUBSCRIPTION,DELETE_SUBSCRIPTIONS,DELETE_SUBSCRIPTION,
    GET_SUBSCRIPTIONS,GET_SUBSCRIPTION,
    GET_SUBSCRIBER,DELETE_SUBSCRIBER,UPDATE_SUBSCRIBER,GET_SUBSCRIBERS,
    CREATE_SUBSCRIBER_STRIPE} from '../_actions/types';

export default function(state={},action){
    switch(action.type){
        case CREATE_SUBSCRIPTION:
            return {...state, create: action.payload }
        case UPDATE_SUBSCRIPTION:
            return { ...state, update: action.payload }
        case DELETE_SUBSCRIPTION:
            return {...state, delete: action.payload}
        case DELETE_SUBSCRIPTIONS:
            return {...state, deleteall: action.payload }
        case GET_SUBSCRIPTIONS:
            return {...state, getall: action.payload }
        case GET_SUBSCRIPTION:
            return {...state, get: action.payload }
        case GET_SUBSCRIBER:
            return {...state, getSubscriber: action.payload }
        case DELETE_SUBSCRIBER:
            return {...state, deleteSubscriber: action.payload }
        case UPDATE_SUBSCRIBER:
            return {...state, updateSubscriber: action.payload }
        case GET_SUBSCRIBERS:
            return {...state, getSubscriberall: action.payload }

   ///---by breeder         
        case CREATE_SUBSCRIBER_STRIPE:
            return {...state, getStripe: action.payload }  
            
        default:
            return state;
    }
}
