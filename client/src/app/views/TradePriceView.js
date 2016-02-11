import React from 'react';
import {
    connect
} from 'react-redux';
import mapActionsToProps from './../mapActionsToProps';
import {
    ViewportComponent,
    TradePriceChart,
    TradeVolumeChart
} from './../components';

let HomeView,
    mapStateToProps;

HomeView = class extends React.Component {
    componentDidMount () {
        this.props.TradeDataActionCreator.fetch();
    }

    setStockFilter = (e) => {
        this.props.TradeDataActionCreator.setStockFilter(e.target.value);
    };

    render () {
        if (!this.props.dataAvailable) {
            return <ViewportComponent>Fetching data.</ViewportComponent>
        }

        return <ViewportComponent>
            <div style={({border: '1px solid #eee', marginBottom: 20})}>
                <TradePriceChart trades={this.props.trades} stockName={this.props.stockFilter.name} />
                <TradeVolumeChart trades={this.props.trades} stockName={this.props.stockFilter.name} />
            </div>

            <select onChange={this.setStockFilter}>
                {this.props.stocks.map((stock) => {
                    return <option value={stock.sym} key={stock.sym} defaultValue={this.props.stockFilter.sym === stock.sym}>{stock.name}</option>;
                })}
            </select>
        </ViewportComponent>;
    }
};

mapStateToProps = (state) => {
    let tradeData = state.get('tradeDataReducer');

    return {
        trades: tradeData.get('filteredTrades').toJS(),
        exchanges: tradeData.get('exchanges').toJS(),
        stocks: tradeData.get('stocks').toJS(),
        stockFilter: tradeData.get('stockFilter').toJS(),
        dataAvailable: tradeData.get('dataAvailable')
    };
};

export default connect(mapStateToProps, mapActionsToProps)(HomeView);
