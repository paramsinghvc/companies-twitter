import React from "react";
import { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Companies from "scenes/Companies";
import { theme } from "./theme";
import CompanyDetails from "scenes/CompanyDetails";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path="/" exact component={Companies} />
          <Route path="/company/:companyName" component={CompanyDetails} />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
