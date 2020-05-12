import React, { Suspense } from 'react';
import { Route, Switch } from "react-router-dom";
import "../App.css"
import Auth from "../hoc/auth";

import LoginPage from "./views/LoginPage.js";

function App() {
  return (
    
      <Suspense fallback={(<div>Loading...</div>)}>

      <h1>Welcome to breeder start</h1>
      <a href="/login">go to login page</a>

      <Switch>
        <Route exact path="/login" component={Auth(LoginPage, false)}  />
      </Switch>
   
      </Suspense>
  );
}

export default App;
