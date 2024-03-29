import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import { registerMicroApps, start } from "../../../dist";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

const appList = [
  {
    name: "vue",
    activeRule: "/vue",
    container: "#micro-container",
    entry: "http://localhost:8080",
  },
  {
    name: "vanillaJs",
    activeRule: "/vanilla",
    container: "#micro-container",
    entry: "http://localhost:5500/micro-fe/apps/sub2/index.html",
  },
  {
    name: "reactSub3",
    activeRule: "/react2",
    container: "#micro-container",
    entry: "http://localhost:3000/",
  },
];

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

registerMicroApps(appList);
start();
