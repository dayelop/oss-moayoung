import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import { Home } from './pages';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
      </Switch>
    </Router>
  );
}

export default App;
