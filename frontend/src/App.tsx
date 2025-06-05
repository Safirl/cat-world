import '../public/style/App.scss';
import AppLayout from './layouts/AppLayout';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from "./pages/Login";
import Letters from './pages/Letters';
import Register from "./pages/Register";
import { routes } from "./config/route";
import PrivateRoute from "./routes/PrivateRoute";
import Landing from "./pages/landing"
import CreateLetter from "./pages/CreateLetter";
import Account from "./pages/Account";
import ShowLetter from "./pages/ShowLetter";
import NavLayout from './layouts/NavLayout';

function App() {
  return (
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
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>
    </Routes>
  )
}

export default App