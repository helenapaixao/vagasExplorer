import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';
import Search from '../pages/Search';
import Home from '../pages/Home';

const Routes: React.FC = () => (
  <Switch>
    <Route exact path="/" component={Home} />
    <Route exact path="/dashboard" component={Dashboard} />
    <Route exact path="/search" component={Search} />
    <Route path="/repository/:repository+" component={Repository} />
  </Switch>
);

export default Routes;
