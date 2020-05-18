import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import {message } from 'antd';
import { useSelector, useDispatch } from "react-redux";
export default function (ComposedClass) {
    function AuthenticationCheck(props) {

        let user = useSelector(state => state.user);
        const dispatch = useDispatch();
        
        useEffect(() => {

            dispatch(auth()).then(response => {
                //console.log("auth response--->",response.payload)
                if (!response.payload.isAuth) {
                        message.error("please login");
                        props.history.push('/login')
                } 
                else {
                    if (response.payload.isAdmin) {
                        message.success("admin is logged in already");
                        props.history.push('/admin')
                    }
                    else {
                            message.success("breeder is logged in already");
                            props.history.push('/')   
                    }
                }
            })
            
        }, [dispatch, props.history])

        return (

            <ComposedClass {...props} user={user} />
        )
    }
    return AuthenticationCheck
}


