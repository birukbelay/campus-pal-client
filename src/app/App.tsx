import React, { Suspense, lazy } from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'

import {AuthRoute} from "../utils/auth_route";
import ProtectedRoute from '../utils/auth_route'



import Routes from "../Constants/routes";
import axios from "axios";
import {getAuthData} from "../api/jwt.service"
import {Spin} from "antd";


//========= ----------  pages import --------- =============


// import Apps from "../pages/tailwindUis/All";
// import SignUpPage from "../features/auth/ui/registerWIthPhone";
import {

  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

const LoginPage = lazy(()=> import("../features/auth/ui/login"));

const SignUpPage = lazy(()=> import("../features/auth/ui/registerWIthPhone"));
// const Dashboard = lazy(()=> import('../pages/admin'));
const NotFoundPage = lazy(()=> import("../components/NotFound"));
const Landing = lazy(()=> import("../pages/Landing/Landing"));

const App = () => {
  axios.interceptors.request.use(function (config) {
    config.headers.Authorization = `Bearer ${getAuthData()?.token}`;
    return config;
  });
  return (
      <QueryClientProvider client={queryClient}>
    <Router>
      <Suspense fallback={<Spin  size="large"/>} >
    <Switch>
      {/*<Route  path={Routes.ADMIN} component={Dashboard}/>*/}
      {/*<ProtectedRoute  path={Routes.ADMIN} component={Dashboard}/>*/}

      <AuthRoute  path={Routes.LOGIN} component={LoginPage}/>
      <Route path={Routes.SIGNUP}><SignUpPage /> </Route>





      <Route path="/">  < Landing/> </Route>
      <Route path="*"><NotFoundPage /> </Route>

    </Switch>
      </Suspense>
    </Router>
        <ReactQueryDevtools initialIsOpen />
      </QueryClientProvider>
  );
};

export default App;
