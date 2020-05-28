import axios from 'axios';
import {CREATE_GROUP,UPDATE_GROUP,DELETE_GROUP,GET_GROUP,GET_GROUPS,
    CREATE_GROUP_LOG,UPDATE_GROUP_LOG,DELETE_GROUP_LOG,GET_GROUP_LOG,GET_GROUP_LOGS} from './types';



export function createGroup(data){
    const request = axios.post(`/group`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_GROUP,
        payload: request
    }
}


export function updateGroup(id,data){
    const request = axios.patch(`/group/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_GROUP,
        payload: request
    }
}



export function deleteGroup(id){
    const request = axios.delete(`/group/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_GROUP,
        payload: request
    }
}


export function getGroup(id){
    const request = axios.get(`/group/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_GROUP,
        payload: request
    }
}



//specific to breeder
export function getGroups(){
    const request = axios.get(`/group`)
        .then(response => response.data);
    
    return {
        type: GET_GROUPS,
        payload: request
    }
}


///GroupLog
export function createGroupLog(data){
    const request = axios.post(`/grouplog`,data)
        .then(response => response.data);
    
    return {
        type: CREATE_GROUP_LOG,
        payload: request
    }
}


export function updateGroupLog(id,data){
    const request = axios.patch(`/grouplog/${id}`,data)
        .then(response => response.data);
    
    return {
        type: UPDATE_GROUP_LOG,
        payload: request
    }
}



export function deleteGroupLog(id){
    const request = axios.delete(`/grouplog/${id}`)
        .then(response => response.data);
    
    return {
        type: DELETE_GROUP_LOG,
        payload: request
    }
}


export function getGroupLog(id){
    const request = axios.get(`/grouplog/${id}`)
        .then(response => response.data);
    
    return {
        type: GET_GROUP_LOG,
        payload: request
    }
}




export function getGroupLogs(){
    const request = axios.get(`/grouplog`)
        .then(response => response.data);
    
    return {
        type: GET_GROUP_LOGS,
        payload: request
    }
}
