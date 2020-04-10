import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';

import CodeBlock from './code-block';
import VariableConnections from './variable-connections';
import Settings from './settings';

export default function Variable(props) {
  const { data, navigation } = props;
  const { variableValues = {}, usedIn = {} } = data;
  const { trigger: triggers, tag: tags, variable: variables } = usedIn;
  const { code } = variableValues;

  return (
    <Grid container direction="column" spacing={3}>
      {code && (
        <Grid item xs={12}>
          <CodeBlock codeString={code} codeType="javascript" navigation={navigation} />
        </Grid>
      )}
      {Object.keys(variableValues).length > 0 && (
        <Grid item xs={12}>
          <Settings values={variableValues} navigation={navigation} />
        </Grid>
      )}
      <Grid item xs={12}>
        <VariableConnections
          tags={tags}
          triggers={triggers}
          variables={variables}
          navigation={navigation}
        />
      </Grid>
    </Grid>
  );
}

Variable.propTypes = {
  data: PropTypes.shape({
    variableValues: PropTypes.shape({
      code: PropTypes.string,
    }),
    usedIn: PropTypes.shape({
      trigger: PropTypes.arrayOf(PropTypes.shape({
        reference: PropTypes.string.isRequired,
      })),
      tag: PropTypes.arrayOf(PropTypes.string.isRequired),
      variable: PropTypes.arrayOf(PropTypes.string.isRequired),
    }),
  }).isRequired,
  navigation: PropTypes.func.isRequired,
};
