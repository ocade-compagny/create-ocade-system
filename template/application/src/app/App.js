// Styles
import "../styles/css/main.css";

/** React / Redux */
import React from "react"
import { useDispatch, useSelector } from "react-redux";
/** Page */
import Home from "../pages/Home/Home.js";

export default function App() {
  const store = useSelector(state => state.store);
  const dispatch = useDispatch();

  return (
  <>
    { store.page === "home" && <Home /> }
  </>
  )
}