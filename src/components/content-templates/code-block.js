import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Prism from 'prismjs';
import { js, html } from 'js-beautify';

const beautifierOptions = {
  indent_size: 4,
  indent_char: ' ',
  max_preserve_newlines: 1,
};

export default function CodeBlock(props) {
  const { codeString, codeType } = props;
  let beautifiedCode = codeString;

  if (codeType === 'html') {
    beautifiedCode = html(codeString, beautifierOptions);
  }

  if (codeType === 'javascript') {
    beautifiedCode = js(codeString, beautifierOptions);
  }

  useEffect(() => () => Prism.highlightAll(), [props]);

  return (
    <>
      <Typography variant="h6">{`${codeType.toUpperCase()} (Minified):`}</Typography>
      <pre className="line-numbers">
        <code className={`language-${codeType}`}>
          {beautifiedCode}
        </code>
      </pre>
    </>
  );
}

CodeBlock.propTypes = {
  codeString: PropTypes.string.isRequired,
  codeType: PropTypes.string.isRequired,
};
