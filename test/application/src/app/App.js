// Styles
import "../styles/css/main.css";

/** React / Redux */
import React from "react"
import { useDispatch, useSelector } from "react-redux";
/** Page */

export default function App() {
  const store = useSelector(state => state.store);
  const dispatch = useDispatch();

  return (
  <>
  <h1>Bienvenue !</h1>
  </>
  )
}