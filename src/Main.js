import React from 'react';
import { Switch, Route } from 'react-router-dom';

import TagManagerInfo from './TagManagerInfo';

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
      path="/relay42"
      render={props => <TagManagerInfo {...props} tagManager="Relay42" />}
    />
    <Route
      exact
      path="/dtm"
      render={props => <TagManagerInfo {...props} tagManager="DTM" />}
    />
  </Switch>
);

export default Main;
