import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { ToggleTheme } from '../utils/ToggleThemeInterface';
import Dashboard from '../pages/Dashboard';
import Repository from '../pages/Repository';
import Home from '../pages/Home';

const Routes: React.FC<ToggleTheme> = ({ toggleTheme }) => (
  <Route
    render={({ location }) => (
      <TransitionGroup>
        <CSSTransition key={location.key} timeout={300} classNames="fade">
          <Switch location={location}>
            <Route
              exact
              path="/"
              component={() => <Home toggleTheme={toggleTheme} />}
            />
            <Route
              exact
              path="/dashboard"
              component={() => <Dashboard toggleTheme={toggleTheme} />}
            />
            <Route
              path="/repository/:repository+"
              component={() => <Repository toggleTheme={toggleTheme} />}
            />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    )}
  />
);

export default Routes;
