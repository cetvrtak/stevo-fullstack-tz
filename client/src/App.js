import React, { useState } from 'react';
import Login from './Login';
import Clients from './Clients';
import './App.css';

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <div className="App">
      {token ? <Clients token={token} /> : <Login setToken={setToken} />}
    </div>
  );
};

export default App;
