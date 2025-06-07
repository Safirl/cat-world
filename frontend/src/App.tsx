import './style/app.scss';
import { lazy, Suspense } from 'react';
import AppLayout from './layouts/AppLayout';
import { Routes, Route } from "react-router-dom";
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Letters = lazy(() => import('./pages/Letters'));
const Register = lazy(() => import('./pages/Register'));
const Landing = lazy(() => import('./pages/landing'));
const CreateLetter = lazy(() => import('./pages/CreateLetter'));
const Account = lazy(() => import('./pages/Account'));
const ShowLetter = lazy(() => import('./pages/ShowLetter'));
const Mentions = lazy(() => import('./pages/Mentions'));
import NavLayout from './layouts/NavLayout';
import { routes } from "./config/route";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Suspense>
      <Routes>
        {/* Global layout */}
        <Route element={<AppLayout />}>
          {/* Private route */}
          <Route element={<PrivateRoute />}>
            {/* Routes that require a navbar */}
            <Route element={<NavLayout />}>
              <Route path={routes.home} element={<Home />} />
              <Route path={routes.letters} element={<Letters />} />
              <Route path={routes.account} element={<Account />} />
              <Route path={routes.createLetter} element={<CreateLetter />} />
            </Route>
            <Route path={routes.showLetter} element={<ShowLetter />} />
          </Route>
          <Route path={routes.login} element={<Login />} />
          <Route path={routes.register} element={<Register />} />
          <Route path={routes.landing} element={<Landing />} />
          <Route path={routes.mentions} element={<Mentions />} />
          {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Route>
      </Routes>
    </Suspense >
  )
}

export default App