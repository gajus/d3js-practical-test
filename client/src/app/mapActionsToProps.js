/**
 * @file Binds every action a pre-initialized instance of a store.
 */
import _ from 'lodash';
import {
    bindActionCreators
} from 'redux';
import store from './store';
import * as actionCreators from './actionCreators';

let storeActions;

storeActions = _.mapValues(actionCreators, (actionCreator) => {
    return bindActionCreators(actionCreator, store.dispatch);
});

export default () => {
    return storeActions;
};
