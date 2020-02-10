import React from "react";
import { ApolloProvider } from "react-apollo";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-boost";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./pages/login";
import MapPage from "./pages/mapPage";
import ViewProject from "./pages/viewProject";
import CreateProject from "./pages/createProject";
import AuthLayout from "./pages/AuthLayout";

const GraphqlClientURL =
  "https://frontendassesment20200204015954.azurewebsites.net/graphql";

const client = new ApolloClient({
  uri: GraphqlClientURL,
  cache: new InMemoryCache({
    addTypename: false
  }),
  request: async operation => {
    const token = await localStorage.getItem("ctoken");
    operation.setContext({
      headers: {
        authorization: token ? token : ""
      }
    });
  }
});

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Switch>
          <Route path="/login" exact component={Login} />
          <Route
            path="/"
            component={props => (
              <AuthLayout {...props}>
                <Route path="/view-project" exact component={ViewProject} />
                <Route path="/create-project" exact component={CreateProject} />
                <Route path="/" exact component={MapPage} />
              </AuthLayout>
            )}
          />
        </Switch>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
