/// <reference path="knockout-2.3.0.debug.js" />
/// <reference path="knockout.mapping-latest.debug.js" />

RealtimeTicker = {};

RealtimeTicker.Stock = function (newStock) {
	var stock = ko.mapping.fromJS(newStock);
	stock.priceFormatted = ko.computed(function () {
		return stock.Price().toFixed(2);
	});
	stock.percentChangeFormatted = ko.computed(function () {
		return (stock.PercentChange() * 100).toFixed(2) + '%';
	});
	stock.direction = ko.computed(function () {
		var stockChange = stock.Change();
		return stockChange === 0 ? '' : stockChange >= 0 ? '▲' : '▼';
	});
	return stock;
}

RealtimeTicker.StockTicker = function () {
	var stockMap = {
		create: function (options) {
			return new RealtimeTicker.Stock(options.data);
		}
	}

	var stockTicker = this;
	stockTicker.stocks = ko.observableArray([]);

	stockTicker.fillStocks = function (stocks) {
		ko.mapping.fromJS(stocks, stockMap, stockTicker.stocks);
	}

	stockTicker.updateStock = function (stock) {
		var updatedStock = ko.utils.arrayFirst(stockTicker.stocks(), function (stockCandidate) {
			return stockCandidate.Symbol() === stock.Symbol;
		});
		ko.mapping.fromJS(stock, updatedStock);
	}
};

RealtimeTicker.initializeWith = function (stocktickerViewModel) {
	var tickerHub = $.connection.stockTickerMini;

	var init = function () {
		tickerHub.server.getAllStocks().done(stocktickerViewModel.fillStocks);
	};

	tickerHub.client.updateStockPrice = stocktickerViewModel.updateStock;

	$.connection.hub.start().done(init);
};