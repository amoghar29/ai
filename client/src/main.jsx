import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./router"; // Since it's a JS file, remove the .tsx extension
import { Provider } from "react-redux";
import { store } from "./store/store"; // Remove the .ts extension

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
