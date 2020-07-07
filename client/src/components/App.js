import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import "../App.css"
import Auth from "../hoc/auth";
import Navbar from './views/Navbar/Navbar'
import LoginPage from "./views/LoginPage.js";

function App() {
  return (
    
      <Suspense fallback={(<div>Loading...</div>)}>
        <Navbar />

      <Switch>
        <Route exact path="/login" component={Auth(LoginPage, false)}  />
      </Switch>
   
      </Suspense>
  );
}

export default App;
