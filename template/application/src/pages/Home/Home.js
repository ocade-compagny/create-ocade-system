// CSS
import "./Home.css"; 
// React Redux
import { useSelector, useDispatch } from 'react-redux';
import NavBar from "../../components/NavBar/navbar.js";
// Components

/**
 * Page Home
 * @returns {JSX.Element}
 */
const Home = () => {
  const store = useSelector(state => state.store);
  const dispatch = useDispatch();

/**************************************************** */
  return (
    <>
      <NavBar />
    </>
    );
}

export default Home;