using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;

namespace ServerBroadcastSample
{
	public class StockTicker
	{
		private readonly static Lazy<StockTicker> instance = new Lazy<StockTicker>(GenerateTicker);
		private readonly ConcurrentDictionary<string, Stock> stocks = new ConcurrentDictionary<string, Stock>();
		private readonly object updateStockPricesLock = new object();
		private readonly double rangePercent = .002;
		private readonly TimeSpan updateInterval = TimeSpan.FromMilliseconds(250);
		private readonly Random updateOrNotRandom = new Random();
		private readonly Timer timer;
		private volatile bool updatingStockPrices = false;

		private static StockTicker GenerateTicker()
		{
			return new StockTicker(GlobalHost.ConnectionManager.GetHubContext<StockTickerHub>().Clients);
		}

		private StockTicker(IHubConnectionContext clients)
		{
			Clients = clients;

			stocks.Clear();
			var stocksTemp = new List<Stock> 
			{
				new Stock { Symbol = "MSFT", Price = 30.31m },
				new Stock { Symbol = "APPL", Price = 578.18m },
				new Stock { Symbol = "GOOG", Price = 570.30m }
			};
			stocksTemp.ForEach(stock => stocks.TryAdd(stock.Symbol, stock));

			timer = new Timer(UpdateStockPrices, null, updateInterval, updateInterval);
		}

		public static StockTicker Instance
		{
			get { return instance.Value; }
		}

		private IHubConnectionContext Clients { get; set; }

		public IEnumerable<Stock> GetAllStocks()
		{
			return stocks.Values;
		}

		private void UpdateStockPrices(object state)
		{
			lock (updateStockPricesLock)
			{
				if (!updatingStockPrices)
				{
					updatingStockPrices = true;

					foreach (var stock in stocks.Values)
					{
						if (TryUpdateStockPrice(stock))
						{
							BroadcastStockPrice(stock);
						}
					}

					updatingStockPrices = false;
				}
			}
		}

		private bool TryUpdateStockPrice(Stock stock)
		{
			var r = updateOrNotRandom.NextDouble();
			if (r > .1)
			{
				return false;
			}

			var random = new Random((int)Math.Floor(stock.Price));
			var percentChange = random.NextDouble() * rangePercent;
			var pos = random.NextDouble() > .51;
			var change = Math.Round(stock.Price * (decimal)percentChange, 2);
			change = pos ? change : -change;

			stock.Price += change;
			return true;
		}

		private void BroadcastStockPrice(Stock stock)
		{
			Clients.All.updateStockPrice(stock);
		}
	}
}
