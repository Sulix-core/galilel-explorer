require('babel-polyfill');
require('../lib/cron');
const config = require('../public/config');
const { exit, rpc } = require('../lib/cron');
const fetch = require('../lib/fetch');
const { forEach } = require('p-iteration');
const locker = require('../lib/locker');
const moment = require('moment');
// Models.
const Proposal = require('../model/proposal');

async function syncProposal() {
    const inserts = [];

    /**
     * Get RPC-API model.
     */
    const rpcApi = `${ config.rpcApi }`;

    await Proposal.remove({});

    rpc.timeout(10000); // 10 secs

    if (rpcApi === "modern") {
        const pps = await rpc.call('getbudgetinfo');
        const mnc = await rpc.call('getmasternodecount');
        await forEach(pps, async(pp) => {
            const proposal = new Proposal({
                name: pp.Name,
                yeas: pp.Yeas,
                nays: pp.Nays,
                blockStart: pp.BlockStart,
                blockEnd: pp.BlockEnd,
                status: ((pp.Yeas - pp.Nays) * 10 > mnc.total),
                budgetTotal: pp.TotalPayment,
                budgetMonthly: pp.MonthlyPayment,
                budgetPeriod: pp.RemainingPaymentCount,
                hash: pp.Hash,
                feehash: pp.FeeHash,
                url: pp.URL,
            });

            inserts.push(proposal);
        });
    }

    if (rpcApi === "legacy") {
        const pps = await rpc.call('mnbudget', ['show']);
        const mnc = await rpc.call('masternode', ['count']);
        for (const prop in pps) {
            const proposal = new Proposal({
                name: pps[prop].Name,
                yeas: pps[prop].Yeas,
                nays: pps[prop].Nays,
                blockStart: pps[prop].BlockStart,
                blockEnd: pps[prop].BlockEnd,
                status: ((pps[prop].Yeas - pps[prop].Nays) * 10 > mnc),
                budgetTotal: pps[prop].TotalPayment,
                budgetMonthly: pps[prop].MonthlyPayment,
                budgetPeriod: pps[prop].RemainingPaymentCount,
                hash: pps[prop].Hash,
                feehash: pps[prop].FeeHash,
                url: pps[prop].URL,
            });

            inserts.push(proposal);
        }
    }

    if (inserts.length) {
        await Proposal.insertMany(inserts);
    }
}

/**
 * Handle locking.
 */
async function update() {
    const type = 'proposal';
    let code = 0;

    try {
        locker.lock(type);
        await syncProposal();
    } catch (err) {
        console.log(err);
        code = 1;
    } finally {
        try {
            locker.unlock(type);
        } catch (err) {
            console.log(err);
            code = 1;
        }
        exit(code);
    }
}

update();
