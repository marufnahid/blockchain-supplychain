import './App.css';
import AssignRoles from './AssignRoles';
import Home from './Home';
import AddMed from './AddMed';
import Supply from './Supply'
import Track from './Track'
import RawMatSupplier from './RawMatSupplier'
import Manufacturer from './Manufacturer'
import Distributor from './Distributor'
import Retailer from './Retailer'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"

function App() {
  return (
    <div className="App">
      
      <Router>
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/roles" component={AssignRoles} />
          <Route path="/raw-materials" component={RawMatSupplier} />
          <Route path="/manufacturer" component={Manufacturer} />
          <Route path="/distributor" component={Distributor} />
          <Route path="/retailer" component={Retailer} />
          <Route path="/addmed" component={AddMed} />
          <Route path="/supply" component={Supply} />
          <Route path="/track" component={Track} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
