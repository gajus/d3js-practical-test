import {
    API_URL
} from './../config';

let TradeDataActionCreator;

TradeDataActionCreator = {};

TradeDataActionCreator.fetch = () => {
    return (dispatch) => {
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
        data,
        type: 'TRADE_DATA___FETCH_RECEIVE'
    };
};

TradeDataActionCreator.setStockFilter = (sym) => {
    return {
        data: {
            sym
        },
        type: 'TRADE_DATA___SET_STOCK_FILTER'
    };
};

export default TradeDataActionCreator;
