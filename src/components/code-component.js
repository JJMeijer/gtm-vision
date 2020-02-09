import React from 'react';
import { html } from 'js-beautify';
import PropTypes from 'prop-types';

const CodeComponent = (props) => {
  const { code, type } = props;
  return (
    <div>
      <pre>
        <code>
          {
            html(code, {
              indent_size: 2,
              type,
            })
          }
        </code>
      </pre>
    </div>
  );
};

CodeComponent.propTypes = {
  code: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default CodeComponent;
