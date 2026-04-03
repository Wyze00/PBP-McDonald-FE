import { lazy } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { store } from "./redux/store";
import Header from "./components/Header";

const HomePage = lazy(() => import('./pages/HomePage'));
const NotFound = lazy(() => import('./pages/NotFound'));

export default function App(): React.JSX.Element {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Header>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="*" element= {<NotFound />} />
            </Routes>
          </Header>
        </BrowserRouter>
      </Provider>
    );
}