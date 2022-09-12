// Config
import CONFIG from '../config.json';
// CSS
import "./Component.css"; 
// React Redux
import { useSelector, useDispatch } from 'react-redux';




/**
 * Component
 * @returns {JSX.Element}
 */
const Component = () => {
  const store = useSelector(state => state.store);
  const dispatch = useDispatch();

/**************************************************** */
  return (
    <>
    </>
  );
}

export default Component;