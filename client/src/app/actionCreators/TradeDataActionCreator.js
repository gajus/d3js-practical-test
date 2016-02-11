import _ from 'lodash';
import {
    API_URL
} from './../config';

let TradeDataActionCreator;

TradeDataActionCreator = {};

TradeDataActionCreator.fetch = () => {
    return (dispatch, state) => {
        dispatch(TradeDataActionCreator.fetchRequest());

        return fetch(API_URL + 'data')
            .then((response) => {
                return response.json();
            })
            .then((response) => {
                dispatch(TradeDataActionCreator.fetchReceive(response));
                dispatch(TradeDataActionCreator.setStockFilter(response.stocks[0].sym));
            });
    };
};

TradeDataActionCreator.fetchRequest = () => {
    return {
        type: 'TRADE_DATA___FETCH_REQUEST'
    };
};

TradeDataActionCreator.fetchReceive = (data) => {
    return {
        type: 'TRADE_DATA___FETCH_RECEIVE',
        data
    };
};

TradeDataActionCreator.setStockFilter = (sym) => {
    return {
        type: 'TRADE_DATA___SET_STOCK_FILTER',
        data: {
            sym
        }
    };
};

export default TradeDataActionCreator;
