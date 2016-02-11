import Immutable from 'immutable';
import {
    createReducer
} from 'redux-create-reducer';

let initialState;

initialState = Immutable.fromJS({
    trades: [],
    filteredTrades: [],
    exchanges: [],
    stocks: [],
    dataAvailable: false,
    stockFilter: {}
});

let normalizeTradeData = (tradeData) => {
    return tradeData.map((data) => {
        return {
            ...data,
            time: new Date(data.time)
        };
    });
};

export default createReducer(initialState, {
    TRADE_DATA___FETCH_RECEIVE (state, action) {
        return state.merge({
            trades: normalizeTradeData(action.data.trades),
            exchanges: action.data.exchanges,
            stocks: action.data.stocks,
            dataAvailable: true
        });
    },
    TRADE_DATA___SET_STOCK_FILTER (state, action) {
        let selectedStock = state
            .get('stocks')
            .filter((stock) => {
                return stock.get('sym') === action.data.sym;
            })
            .first();

        let filteredTrades = state
            .get('trades')
            .filter((trade) => {
                return trade.get('stock') === action.data.sym;
            });

        return state.merge({
            stockFilter: selectedStock,
            filteredTrades
        });
    }
});
