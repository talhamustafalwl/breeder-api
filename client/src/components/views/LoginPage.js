import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Input, Button, Checkbox, Typography,Modal,message } from 'antd';
import { useDispatch } from "react-redux";
import { loginUser,forgetPassword } from "../../_actions/user_actions";
import {MailOutlined,LockOutlined,UserOutlined} from '@ant-design/icons';
const { Title } = Typography;

function LoginPage(props) {
    const dispatch = useDispatch();
    const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;
    const [formErrorMessage, setFormErrorMessage] = useState('')
    const [formErrorMessageRecover, setFormErrorMessageRecover] = useState('')
    const [rememberMe, setRememberMe] = useState(rememberMeChecked)

    const handleRememberMe = () => {
      setRememberMe(!rememberMe)
    };
    const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';
   
    
    const [visible, setvisible] = useState(false)
    const showModal = () => {
      setvisible(true)
    };
  

    const handleCancel = e => {
    setvisible(false)
  };
    
    return (

        <Formik
            initialValues={{
                email: initialEmail,
                password: '',
            }}

            validationSchema={Yup.object().shape({
                email: Yup.string().email('Email is invalid').required('Email is required'),
                password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
              })}

              onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                  let dataToSubmit = {
                    email: values.email,
                    password: values.password
                  };
                  //call action login
                  dispatch(loginUser(dataToSubmit)).then(response => {
                    if (response.payload.status === 200) {
                        window.localStorage.setItem('userId', response.payload.data.userId);
                        if (rememberMe === true) {
                            window.localStorage.setItem('rememberMe', response.payload.data.email);
                           
                          } else {
                            localStorage.removeItem('rememberMe');
                            
                          } 
                         
                           message.success(response.payload.message);
                          props.history.push("/");
                        } else {
                          setFormErrorMessage('Check out your Account or Password again')
                          setTimeout(() => {
                            setFormErrorMessage("")
                          }, 3000);
                        }
                      }).catch(err => {
                        setFormErrorMessage('Check out your Account or Password again')
                        setTimeout(() => {
                          setFormErrorMessage("")
                        }, 3000);
                      });
                    setSubmitting(false);
                  }, 500);
                }} >
                

        {props => {
        //get values from props
        const {values,touched,errors,isSubmitting,handleChange,handleBlur,handleSubmit
            } = props;

        return (
            <div className="app">
                 <Title level={2}>Log In</Title>
            <form onSubmit={handleSubmit} style={{ width: '350px' }}>

             <Form.Item required>
                <Input id="email"
                
                  prefix={<MailOutlined />}
                  placeholder="Enter your email" type="email" value={values.email}
                  onChange={handleChange} onBlur={handleBlur}
                  className={
                    errors.email && touched.email ? 'text-input error' : 'text-input'
                  }/>
                  {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
              </Form.Item>


              <Form.Item required>
                <Input id="password"
                  prefix={<LockOutlined />}
                  placeholder="Enter your password" type="password" value={values.password}
                  onChange={handleChange} onBlur={handleBlur}
                  className={
                    errors.password && touched.password ? 'text-input error' : 'text-input'
                  }
                />
                {errors.password && touched.password && (
                  <div className="input-feedback">{errors.password}</div>
                )}
              </Form.Item>

              {formErrorMessage && (
                <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessage}</p></label>
              )}

              <Form.Item>
              <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe} >Remember me</Checkbox>

             

                  <Button className="login-form-forgot" onClick={showModal} style={{ float: 'right' }}>
                  forgot password
                   </Button>
                   <Modal
                        title="Forget Password"
                        visible={visible}
                        onCancel={handleCancel}
                        footer={null}
                      >
                       
                        
                        <Formik
                        initialValues={{
                            email: ''
                        }}
                        validationSchema={Yup.object().shape({
                          email: Yup.string().email('Email is invalid').required('Email is required'),
                          })}
                          
                          onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                              let dataToSubmit = {
                                email: values.email,
                              };
                              //call action login
                              dispatch(forgetPassword(dataToSubmit)).then(response => {
                                if (response.payload.status === 200) {
                                  values.email=''
                                  setTimeout(() => {
                                   setvisible(false)
                                   
                                  }, 1000);
                                     
                                  
                                }
                                  }).catch(err => {
                                    setFormErrorMessageRecover ('Kindly provide vald email',err)
                                    setTimeout(() => {
                                      setFormErrorMessageRecover ("")
                                    }, 3000);
                                  });
                                setSubmitting(false);
                              }, 500);
                            }} >

        {props => {
        //get values from props
        const {values,touched,errors,isSubmitting,handleChange,handleBlur,handleSubmit
            } = props;

        return (

                <form onSubmit={handleSubmit} style={{ width: '350px' }}>             
             <Form.Item required>
                <Input id="email"
                  prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Enter your email" type="email" value={values.email}
                  onChange={handleChange} onBlur={handleBlur}
                  className={
                    errors.email && touched.email ? 'text-input error' : 'text-input'
                  }/>
                  {errors.email && touched.email && (
                  <div className="input-feedback">{errors.email}</div>
                )}
             {formErrorMessageRecover && (
                <label ><p style={{ color: '#ff0000bf', fontSize: '0.7rem', border: '1px solid', padding: '1rem', borderRadius: '10px' }}>{formErrorMessageRecover }</p></label>
              )}
              
              <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                    Submit</Button>
                   
                    </Form.Item>
              </form>

)}}
              </Formik>
       
                      </Modal>
                  
                <div>

                <Button type="primary" htmlType="submit" className="login-form-button" style={{ minWidth: '100%' }} disabled={isSubmitting} onSubmit={handleSubmit}>
                    Log in</Button>
                </div>

                Or <a href="/register">register now!</a>

                </Form.Item>
            </form>
          </div>
    );
    }}
           </Formik> 

    )
}


export default withRouter(LoginPage);