import React from 'react';
import ReactDOM from 'react-dom';
import App from './pages/App/App';
import './index.css';
import {BrowserRouter, Route} from 'react-router-dom';

ReactDOM.render(
    <BrowserRouter>
        <Route path='/' render={(props) => <App {...props} /> }/>
    </BrowserRouter>, document.getElementById('root'));