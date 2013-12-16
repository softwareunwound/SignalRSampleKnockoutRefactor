using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace ServerBroadcastSample
{
	[HubName("stockTickerMini")]
	public class StockTickerHub : Hub
	{
		private readonly StockTicker stockTicker;

		public StockTickerHub() : this(StockTicker.Instance) { }

		public StockTickerHub(StockTicker stockTicker)
		{
			this.stockTicker = stockTicker;
		}

		public IEnumerable<Stock> GetAllStocks()
		{
			return stockTicker.GetAllStocks();
		}
	}
}