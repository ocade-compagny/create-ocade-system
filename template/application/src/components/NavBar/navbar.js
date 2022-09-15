// Config
import CONFIG from '../../config.json';
// CSS
import "./navbar.css"; 
// React Redux
import { useSelector, useDispatch } from 'react-redux';
import { setPage } from "../../redux.js";

/** Images */
import logo from '../../images/logo.png';
import marteauKey from "../../images/marteau-cle.png";

/** Utilitaires */
import { capitalise } from '../../utilitaires.js';


/**
 * NavBar
 * @returns {JSX.Element}
 */
const NavBar = () => {
  const store = useSelector(state => state.store);
  const dispatch = useDispatch();

/**************************************************** */
  return (
    <>
      <nav className='nav-header' style={{
        position: `fixed`,
        zIndex: 1000,
        top: 0,
        display: `flex`,
        alignItems: `center`,
        width: `100%`,
        height: `6rem`,
        backgroundColor: CONFIG.colors.one,
        borderBottom: `1px solid ${CONFIG.colors.white}`,
      }}>
        <div 
          className='nav-header__logo' 
          title='Accueil'
          onClick={ () => dispatch(setPage("home")) }
          style={{
            cursor: `pointer`,
          }}  
        >
          <img 
            src={ logo } 
            alt='logo' 
            style={{
              height: `3rem`,
              width: `3rem`,
              margin: `0.5rem`,
            }}
          />
        </div>
        <div className='nav-header__title' style={{
          marginRight: `auto`,
        }}>
          <h1
            style={{
              color: CONFIG.colors.white,
              fontSize: `1.5rem`,
              margin: `0.5rem`,
            }}
          >{ capitalise(store.page) }</h1>
        </div>
        <button style={{
            marginRight: `0.5rem`,
            cursor: `pointer`,
          }}
          title='Outils'
          onClick={ () => dispatch(setPage('outils')) }
        >
        <img src={ marteauKey } alt='Outils' style={{ height: `1.5rem`, width: `1.5rem`, margin: `0.5rem` }} />
        </button>
      </nav>
      <section style={{ 
        height: `6rem`,
      }}></section>
    </>
  );
}

export default NavBar;