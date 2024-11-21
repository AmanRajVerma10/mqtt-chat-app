import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import PrivateRoute from "./pages/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/register" component={Register} />
        {/* <Route path="/dashboard" component={Dashboard} />
        <Route path="/chat" component={Chat} /> */}
        <PrivateRoute path="/dashboard" component={Dashboard} />
        <PrivateRoute path="/chat" component={Chat} />
      </Switch>
    </Router>
  );
}
