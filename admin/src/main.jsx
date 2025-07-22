import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./Redux/store";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
          <Toaster
          richColors
          toastOptions={{ duration: 2000 }}
          position="bottom-right"
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
