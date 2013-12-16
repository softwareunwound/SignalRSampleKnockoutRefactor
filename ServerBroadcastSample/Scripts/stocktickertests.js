/// <reference path="stockticker.js" />
/// <reference path="jasmine.js" />
/// <reference path="knockout-2.3.0.debug.js" />

describe("RealtimeTicker.StockTicker: ", function () {
	var stocksArray = [
		{ Symbol: 'GOOG', Price: 569.5, DayOpen: 570.3, Change: -0.8, PercentChange: -0.0014 },
		{ Symbol: 'MSFT', Price: 32.03, DayOpen: 30.31, Change: 1.72, PercentChange: 0.0537 },
		{ Symbol: 'APPL', Price: 577.18, DayOpen: 578.18, Change: -1, PercentChange: -0.0017 }
	];

	it("fillStocks should fill the stocks array", function () {
		//Arrange
		var ticker = new RealtimeTicker.StockTicker();

		//Act
		ticker.fillStocks(stocksArray);

		//Assert
		expect(ticker.stocks().length).toBe(3);
	});

	it("updateStock correctly updates stock", function () {
		//Arrange
		var ticker = new RealtimeTicker.StockTicker();
		ticker.fillStocks(stocksArray);
		var newGoogle = { Symbol: 'GOOG', Price: 9001, DayOpen: 38, Change: 9023, PercentChange: 10 };
		var updatedStock;

		//Act
		ticker.updateStock(newGoogle);
		updatedStock = ko.toJS(ko.utils.arrayFirst(ticker.stocks(), function (stock) {
			return stock.Symbol() === 'GOOG';
		}));


		//Assert
		expect(updatedStock.Symbol).toBe('GOOG');
		expect(updatedStock.Price).toBe(9001);
		expect(updatedStock.DayOpen).toBe(38);
		expect(updatedStock.Change).toBe(9023);
		expect(updatedStock.PercentChange).toBe(10);
		expect(updatedStock.priceFormatted).toBe('9001.00');
		expect(updatedStock.percentChangeFormatted).toBe('1000.00%');
		expect(updatedStock.direction).toBe('▲');
	});
});

describe("RealtimeTicker.Stock: ", function () {
	it("priceFormatted should contain a correctly formatted price", function () {
		//Arrange
		var stock = { Symbol: "foo", Price: 569.5, DayOpen: 0, Change: 1, PercentChange: 1 };
		var expectedPriceFormatted = '569.50';
		var actualPriceFormatted;

		//Act
		var mappedStock = new RealtimeTicker.Stock(stock);
		actualPriceFormatted = mappedStock.priceFormatted();

		//Assert
		expect(actualPriceFormatted).toBe(expectedPriceFormatted);
	});

	it("percentChangeFormatted should contain a properly formatted percentage", function () {
		//Arrange
		var stock = { Symbol: "foo", Price: 569.5, DayOpen: 0, Change: 1, PercentChange: -0.0014 };
		var expectedPercentChangeFormatted = '-0.14%';
		var actualPercentChangeFormatted;

		//Act
		var mappedStock = new RealtimeTicker.Stock(stock);
		actualPercentChangeFormatted = mappedStock.percentChangeFormatted();

		//Assert
		expect(actualPercentChangeFormatted).toBe(expectedPercentChangeFormatted);
	});

	it("with a positive change should have an up arrow for direction", function () {
		//Arrange
		var stock = { Symbol: "foo", Price: 1, DayOpen: 0, Change: 1, PercentChange: 1 };
		var expectedDirection = '▲';
		var actualDirection;

		//Act
		var mappedStock = new RealtimeTicker.Stock(stock);
		actualDirection = mappedStock.direction();

		//Assert
		expect(actualDirection).toBe(expectedDirection);
	});

	it("with a negative change should have a down arrow for direction", function () {
		//Arrange
		var stock = { Symbol: "foo", Price: 1, DayOpen: 2, Change: -1, PercentChange: -1 };
		var expectedDirection = '▼';
		var actualDirection;

		//Act
		var mappedStock = new RealtimeTicker.Stock(stock);
		actualDirection = mappedStock.direction();

		//Assert
		expect(actualDirection).toBe(expectedDirection);
	});

	it("with no change should not have an arrow for direction", function () {
		//Arrange
		var stock = { Symbol: "foo", Price: 1, DayOpen: 1, Change: 0, PercentChange: 0 };
		var expectedDirection = '';
		var actualDirection;

		//Act
		var mappedStock = new RealtimeTicker.Stock(stock);
		actualDirection = mappedStock.direction();

		//Assert
		expect(actualDirection).toBe(expectedDirection);
	});
});