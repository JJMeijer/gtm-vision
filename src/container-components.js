import React from 'react';
import PropTypes from 'prop-types';

import AevParser from './parsers';

const autoEventVariable = ({ vtp_varType }) => (
  <div>
    <ul>
      <li>Auto Event Variable 1</li>
      <li>{vtp_varType}</li>
      <li>5</li>
    </ul>
  </div>
);

