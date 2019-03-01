import React from 'react';
import { Switch, Route } from 'react-router-dom';

import TagManagerInfo from './tag-manager-info';

const Main = () => (
  <Switch>
    <Route
      exact
      path="/"
      render={props => <TagManagerInfo {...props} tagManager="GTM" />}
    />
    <Route
      exact
      path="/gtm"
      render={props => <TagManagerInfo {...props} tagManager="GTM" />}
    />
    <Route
      exact
      path="/tealium"
      render={props => <TagManagerInfo {...props} tagManager="Tealium" />}
    />
    <Route
      exact
      path="/dtm"
      render={props => <TagManagerInfo {...props} tagManager="DTM" />}
    />
  </Switch>
);

export default Main;
