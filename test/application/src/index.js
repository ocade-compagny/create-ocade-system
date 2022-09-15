// React / Redux
import { React, StrictMode } from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { store } from "./redux.js";

// Composants
import App from './app/App.js';

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <Provider store={store}>
      <App></App>
    </Provider>
  </StrictMode>
);