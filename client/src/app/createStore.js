import _ from 'lodash';
import {
    createStore,
    applyMiddleware
} from 'redux';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import Immutable from 'immutable';
import rootReducer from './rootReducer';
import {
    ENVIRONMENT
} from './config';

let defaultInitialState;

defaultInitialState = Immutable.Map();

export default (initialState = defaultInitialState) => {
    let createStoreWithMiddleware,
        store;

    if (ENVIRONMENT === 'production') {
        createStoreWithMiddleware = applyMiddleware(thunk)(createStore);
    }

    if (ENVIRONMENT === 'development') {
        let logger;

        logger = createLogger({
            collapsed: true,
            stateTransformer: (state) => {
                return state.toJS();
            }
        });

        createStoreWithMiddleware = applyMiddleware(thunk, logger)(createStore);
    }

    store = createStoreWithMiddleware(rootReducer, initialState);

    if (ENVIRONMENT === 'development') {
        if (module.hot) {
            module.hot.accept('./rootReducer', () => {
                return store.replaceReducer(require('./rootReducer').default);
            });
        }
    }

    return store;
};
