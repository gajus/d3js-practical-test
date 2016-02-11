import React from 'react';
import ReactDOM from 'react-dom';
import {
    Provider
} from 'react-redux';
import store from './store';
import {
    TradePriceView
} from './views';

ReactDOM.render(<Provider store={store}>
    <TradePriceView />
</Provider>, document.querySelector('#app'));
