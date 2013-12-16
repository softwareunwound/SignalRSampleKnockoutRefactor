using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ServerBroadcastSample
{
	public class Stock
	{
		private decimal price;

		public string Symbol { get; set; }

		public decimal Price
		{
			get
			{
				return price;
			}
			set
			{
				if (price == value)
				{
					return;
				}
				price = value;
				if (DayOpen == 0)
				{
					DayOpen = price;
				}
			}
		}

		public decimal DayOpen { get; set; }

		public decimal Change
		{
			get
			{
				return Price - DayOpen;
			}
		}

		public double PercentChange
		{
			get
			{
				return (double)Math.Round(Change / Price, 4);
			}
		}
	}
}