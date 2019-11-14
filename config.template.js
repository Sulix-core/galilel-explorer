/**
 * Global configuration object.
 */
const config = {
  api: {
    'host': 'https://explorer.galilel.org',
    'port': '3000',
    'portWorker': '443',
    'prefix': '/api',
    'timeout': '5s'
  },

  /**
   * Specify the RPC-API of the coin daemon. The following options are available:
   *
   * modern (default)
   * - getmasternodecount, listmasternodes, getbudgetinfo and getmasternodecount
   *
   * legacy
   * - masternode, masternodelist, mnbudget
   */
  rpcApi: 'modern',

  /**
   * If set to true there are extra logging details in cron scripts.
   */
  verboseCron: true,

  /**
   * If set to true there are extra tx logging details in cron scripts (Not recommended).
   */
  verboseCronTx: false,

  /**
   * If set to 0, cpu cores are detected and worker processes spawned accordingly.
   * If set to > 0, limit the number of worker processes.
   */
  workers: 0,

  /**
   * Configure your coin details here.
   */
  coinDetails: {
    name: 'Galilel',
    shortName: 'GALI',
    coinNumberFormat: '0,0.0000',
    coinNumberFormatFinance: '+0,0.0000'
  },

  /**
   * Set to true to extract PoS & MN data.
   */
  splitRewardsData: true,

  /**
   * API configurations.
   */
  freegeoip: {
    'api': 'https://extreme-ip-lookup.com/json/'
  },

  /**
   * API markets.
   */
  coinMarketCap: {
    'api': 'https://api.coinmarketcap.com/v1/ticker/',
    'ticker': 'galilel'
  },
  coinGecko: {
    'api': 'https://api.coingecko.com/api/v3/coins/',
    'ticker': 'galilel'
  },

  /**
   * Specify the market API provider (coinMarketCap and coinGecko are supported).
   */
  apiProvider: 'CoinMarketCap',

  /**
   * All links to social media.
   */
  socialMedia: [
    {
      'title': 'Website',
      'link': 'https://galilel.org/',
      'icon': 'fas-home'
    },
    {
      'title': 'Discord',
      'link': 'https://discord.galilel.org',
      'icon': 'fab-discord'
    },
    {
      'title': 'Telegram',
      'link': 'https://t.me/GalilelEN',
      'icon': 'fab-telegram'
    },
    {
      'title': 'Twitter',
      'link': 'https://twitter.com/GalilelEN',
      'icon': 'fab-twitter'
    },
    {
      'title': 'BitcoinTalk',
      'link': 'https://bitcointalk.galilel.org',
      'icon': 'fab-bitcoin'
    },
    {
      'title': 'Facebook',
      'link': 'https://facebook.com/GalilelEN',
      'icon': 'fab-facebook'
    },
    {
      'title': 'YouTube',
      'link': 'https://youtube.com/channel/UC26rKBciicXp33dK8NkALmg',
      'icon': 'fab-youtube'
    },
    {
      'title': 'Github',
      'link': 'https://github.com/Galilel-Project',
      'icon': 'fab-github'
    },
    {
      'title': 'Instagram',
      'link': 'https://instagram.com/galilel_en/',
      'icon': 'fab-instagram'
    },
    {
      'title': 'Reddit',
      'link': 'https://www.reddit.com/r/Galilel/',
      'icon': 'fab-reddit'
    },
    {
      'title': 'Medium',
      'link': 'https://medium.com/galilel',
      'icon': 'fab-medium'
    }
  ],

  /**
   * All exchange links.
   */
  exchanges: [
    {
      'title': 'Graviex',
      'link': 'https://graviex.net/markets/galibtc'
    },
    {
      'title': 'Crex24',
      'link': 'https://crex24.com/exchange/GALI-BTC'
    },
    {
      'title': 'Aiodex',
      'link': 'https://aiodex.com/exchange/GALI_BTC'
    },
    {
      'title': 'CRATEX',
      'link': 'https://cratex.io/index.php?pair=GALI/BTC'
    },
    {
      'title': 'Raisex',
      'link': 'https://raisex.io/trade/GALI_BTC'
    },
    {
      'title': 'MCT+',
      'link': 'https://trade.mct.plus/'
    },
    {
      'title': 'FINEXBOX',
      'link': 'https://www.finexbox.com/market/pair/GALI-BTC.html'
    },
    {
      'title': 'Block DX',
      'link': 'https://blocknet.co/galilel-2/about/'
    },
    {
      'title': 'Bisq',
      'link': 'https://bisq.network/markets/?currency=gali_btc'
    }
  ],

  /**
   * Adjustable PoS Profitability Score - How profitable is your staking, tailored for your blockchain.
   */
  profitabilityScore: {

    /**
     * Figure out how profitable you are staking. Each output is multiplied by the number below, you can configure it for your blockchain.
     * The formula is: (reward.stake.input.confirmations / ((reward.stake.reward / reward.stake.input.value) * 100)) * config.profitabilityScore.weightMultiplier
     */
    weightMultiplier: 0.1,

    /**
     * In order to get the color below (from scoreStyles) we'll use an exponential formula.
     * The formula is: profitabilityScore < weightColorScale * Math.pow(2, i + 1) 
     */
    weightColorScale: 30,

    scoreStyles: [

      /**
       * Best case.
       */
      {
        color: "#72f87b",
        title: "Rank 1/10 - Excellent!!!"
      },
      {
        color: "#84f771",
        title: "Rank 2/10 - Excellent!"
      },
      {
        color: "#a0f771",
        title: "Rank 3/10 - Excellent"
      },
      {
        color: "#bcf671",
        title: "Rank 4/10 - Very Good"
      },
      {
        color: "#d8f671",
        title: "Rank 5/10 - Above Average"
      },
      {
        color: "#f3f671",
        title: "Rank 6/10 - Average"
      },
      {
        color: "#f5dc71",
        title: "Rank 7/10 - Below Average"
      },
      {
        color: "#f5c071",
        title: "Rank 8/10 - Not Optimal"
      },
      {
        color: "#f4a471",
        title: "Rank 9/10 - Not Optimal!"
      },

      /**
       * Worst case (default).
       */
      {
        color: "#f48871",
        title: "Rank 10/10 - Not Optimal!!!"
      }
    ]
  },

  /**
   * Community and address related. If you comment out all of these addresses the 'Community Addresses' section will not show up on the homepage. You can add as many addresses to highlight as you wish.
   */
  community: {
    highlightedAddresses: [
      { label: 'Community Donations', address: 'UUr5nDmykhun1HWM7mJAqLVeLzoGtx19dX' },
      { label: 'Development Budget', address: '7U3FMDhKv4j5bzauurPoX1TtqE7hPowSJi' },
    ]
  },

  /**
   * Each address can contain it's own set of widgets and configs for those widgets.
   */
  addressWidgets: {
    'XXXXXXXXXXXXXXXXXXXXXXXXXXX': {

      /**
       * WIDGET: Adds a list of masternodes when viewing address. We use this to show community-ran masternodes.
       */
      masternodesAddressWidget: {
        title: 'Community Masternodes',
        description: 'Profits from these masternodes fund & fuel community talent',

        /**
         * If you have more than 10 you should enable this.
         */
        isPaginationEnabled: false,
        addresses: [
          'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
          'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
          'XXXXXXXXXXXXXXXXXXXXXXXXXXX',
        ]
      }
    }
  }
};

module.exports = config;
