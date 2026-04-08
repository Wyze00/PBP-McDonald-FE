import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from "./redux/store";
import Header from "./components/Header";
import PublicRoute from "./middlewares/public.middleware";
import AdminMiddleware from "./middlewares/admin.middleware";

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const AdminHomePage = lazy(() => import('./pages/admin/AdminHomepage'));
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu'));

export default function App(): React.JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Header>
            <Routes>
                <Route path="/" element={<HomePage />} />
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<LoginPage />} />
              </Route>
              <Route element={<AdminMiddleware />}>
                <Route path="/admin" element={<AdminHomePage />}/>
                <Route path="/admin/menu" element={<AdminMenu />}/>
              </Route>
              <Route path="*" element= {<NotFound />} />
            </Routes>
          </Header>
        </BrowserRouter>
      </Provider>
    );
}