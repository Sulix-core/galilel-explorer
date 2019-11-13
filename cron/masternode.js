require('babel-polyfill');
require('../lib/cron');

const config = require('../public/config');
const { exit, rpc } = require('../lib/cron');
const fetch = require('../lib/fetch');
const { forEach } = require('p-iteration');
const locker = require('../lib/locker');
const moment = require('moment');

// Models.
const Masternode = require('../model/masternode');

/**
 * Get a list of the mns and request IP information
 * from freegeopip.net.
 */
async function syncMasternode() {
  const date = moment().utc().startOf('minute').toDate();
  const inserts = [];

  /**
   * Get RPC-API model.
   */
  const rpcApi = `${ config.rpcApi }`;

  await Masternode.remove({});

  // Increase the timeout for masternode.
  rpc.timeout(10000); // 10 secs


  if (rpcApi === "modern") {
    const mns = await rpc.call('listmasternodes');
    await forEach(mns, async (mn) => {
      const masternode = new Masternode({
        active: mn.activetime,
        addr: mn.addr,
        createdAt: date,
        lastAt: new Date(mn.lastseen * 1000),
        lastPaidAt: new Date(mn.lastpaid * 1000),
        network: mn.network,
        rank: mn.rank,
        status: mn.status,
        txHash: mn.txhash,
        txOutIdx: mn.outidx,
        ver: mn.version
      });

      inserts.push(masternode);
    });
  }

  if (rpcApi === "legacy") {
    const mns = await rpc.call('masternodelist', ['full']);
    for (const prop in mns) {
      mn = mns[prop].split(' ').filter(e => String(e).trim());
      tx = prop.split('-');

      const masternode = new Masternode({
        active: mn[5],
        addr: mn[2],
        createdAt: date,
        lastAt: new Date(mn[4] * 1000),
        lastPaidAt: new Date(mn[6] * 1000),
        network: "ipv4", // getting network in legacy codebase is impossible, assume ipv4.
        rank: 0, // getting rank in legacy codebase is a very expensive call, skip it since it is not shown in frontend.
        status: mn[0],
        txHash: tx[0],
        txOutIdx: tx[1],
        ver: mn[1]
      });

      inserts.push(masternode);
    }
  }

  if (inserts.length) {
    await Masternode.insertMany(inserts);
  }
}

/**
 * Handle locking.
 */
async function update() {
  const type = 'masternode';
  let code = 0;

  try {
    locker.lock(type);
    await syncMasternode();
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
