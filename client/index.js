import React from 'react';
// import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux/store';

// const root = createRoot(document.getElementById('root'));
// root.render(<App />);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
