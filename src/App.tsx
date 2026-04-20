import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from "./redux/store";
import Header from "./components/Header";
import PublicRoute from "./middlewares/public.middleware";
import AdminMiddleware from "./middlewares/admin.middleware";

const HomePage = lazy(() => import('./pages/public/HomePage'));
const LoginPage = lazy(() => import('./pages/public/LoginPage'));
const ResetPasswordPage = lazy(() => import('./pages/public/ResetPasswordPage'));
const ResetPasswordVerifyPage = lazy(() => import('./pages/public/ResetPasswordVerifyPage'));
const NotFound = lazy(() => import('./pages/public/NotFound'));
const AdminHomePage = lazy(() => import('./pages/admin/AdminHomepage'));
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu'));
const AdminTransaction = lazy(() => import('./pages/admin/AdminTransaction'));

const CustomerMenu = lazy(() => import('./pages/customer/CustomerMenu'));
const CustomerCart = lazy(() => import('./pages/customer/CustomerCart'));
const CustomerOrderCompletion = lazy(() => import('./pages/customer/CustomerOrderCompletion'));
const CustomerPayAtMachine = lazy(() => import('./pages/customer/CustomerPayAtMachine'));
const CustomerPayAtCashier = lazy(() => import('./pages/customer/CustomerPayAtCashier'));

export default function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Header>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/reset-password/verify" element={<ResetPasswordVerifyPage />} />
            </Route>
            <Route element={<AdminMiddleware />}>
              <Route path="/admin" element={<AdminHomePage />} />
              <Route path="/admin/menu" element={<AdminMenu />} />
              <Route path="/admin/transaction" element={<AdminTransaction />} />
            </Route>
            <Route path="*" element={<NotFound />} />

            <Route path="/customer" element={<CustomerMenu />} />
            <Route path="/customer/cart" element={<CustomerCart />} />
            <Route path="/customer/cart/order-completion" element={<CustomerOrderCompletion />} />
            <Route path="/customer/cart/order-completion/pay-at-machine" element={<CustomerPayAtMachine />} />
            <Route path="/customer/cart/order-completion/pay-at-cashier" element={<CustomerPayAtCashier />} />
          </Routes>
        </Header>
      </BrowserRouter>
    </Provider>
  );
}