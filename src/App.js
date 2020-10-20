import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import HomePage from './pages/home';
import ProjectPage from './pages/project';

export default function App() {
  return (
    <BrowserRouter basename="/">
      <Route exact path="/" component={HomePage} />
      <Route exact path="/nested-list" component={ProjectPage} />
    </BrowserRouter>
  );
}
