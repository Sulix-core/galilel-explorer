require('babel-polyfill');

const config = require('../public/config');
const { exit, rpc } = require('../lib/cron');
const fetch = require('../lib/fetch');
const locker = require('../lib/locker');
const moment = require('moment');

/**
 * Models.
 */
const Coin = require('../model/coin');

/**
 * Get the coin related information including things
 * like price coinmarketcap.com data.
 */
async function syncCoin() {
  const date = moment().utc().startOf('minute').toDate();

  /**
   * Setup the market api url.
   */
  const provider = `${ config.apiProvider }`;

  /**
   * Get RPC-API model.
   */
  const rpcApi = `${ config.rpcApi }`;

  const info = await rpc.call('getinfo');
  const nethashps = await rpc.call('getnetworkhashps');

  /* shared variables. */
  let mnsOff;
  let mnsOn;
  let supply;

  if (rpcApi === "modern") {
    const masternodes = await rpc.call('getmasternodecount');
    mnsOff = masternodes.total - masternodes.stable;
    mnsOn = masternodes.stable;
    supply = info.moneysupply;
  }

  if (rpcApi === "legacy") {
    const masternodes = await rpc.call('masternode', ['count']);
    const txoutsetinfo = await rpc.call('gettxoutsetinfo');
    mnsOff = masternodes;
    mnsOn = masternodes;
    supply = txoutsetinfo.total_amount;
  }

  /**
   * CoinMarketCap
   */
  if (provider === "CoinMarketCap") {
    const url = `${ config.coinMarketCap.api }${ config.coinMarketCap.ticker }`;
    let market = await fetch(url);
    if (Array.isArray(market)) {
      market = market.length ? market[0] : {};
    }

    const coin = new Coin({
      cap: market.market_cap_usd,
      createdAt: date,
      blocks: info.blocks,
      btc: market.price_btc,
      diff: info.difficulty,
      mnsOff: mnsOff,
      mnsOn: mnsOn,
      netHash: nethashps,
      peers: info.connections,
      status: 'Online',
      supply: supply,
      usd: market.price_usd
    });

    await coin.save();
  }

  /**
   * CoinGecko
   */
  if (provider === "CoinGecko") {
    const url = `${ config.coinGecko.api }${ config.coinGecko.ticker }`;
    let market = await fetch(url);
    if (Array.isArray(market)) {
      market = market.length ? market[0] : {};
    }

    const coin = new Coin({
      cap: market.market_data.market_cap.usd,
      createdAt: date,
      blocks: info.blocks,
      btc: market.market_data.current_price.btc,
      diff: info.difficulty,
      mnsOff: mnsOff,
      mnsOn: mnsOn,
      netHash: nethashps,
      peers: info.connections,
      status: 'Online',
      supply: supply,
      usd: market.market_data.current_price.usd
    });

    await coin.save();
  }
}

/**
 * Handle locking.
 */
async function update() {
  const type = 'coin';
  let code = 0;

  try {
    locker.lock(type);
    await syncCoin();
  } catch(err) {
    console.log(err);
    code = 1;
  } finally {
    try {
      locker.unlock(type);
    } catch(err) {
      console.log(err);
      code = 1;
    }
    exit(code);
  }
}

update();
