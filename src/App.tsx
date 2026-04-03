import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from "./redux/store";

const HomePage = lazy(() => import('./pages/HomePage'));

export default function App(): React.JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
            </Routes>
        </BrowserRouter>
      </Provider>
    );
}