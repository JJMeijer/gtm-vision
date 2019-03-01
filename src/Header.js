import React from 'react';
import { NavLink } from 'react-router-dom';

import './header.css';

const Header = () => (
  <header>
    <nav>
      <ul>
        <li><NavLink to="/gtm" activeClassName="active">GTM</NavLink></li>
        <li><NavLink to="/tealium" activeClassName="active">Tealium</NavLink></li>
        <li><NavLink to="/dtm" activeClassName="active">Adobe DTM</NavLink></li>
      </ul>
    </nav>
  </header>
);

export default Header;
