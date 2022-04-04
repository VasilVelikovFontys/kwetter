import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'

import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import rootReducer from './store/reducers/rootReducer';

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>,
  document.getElementById('root')
)
