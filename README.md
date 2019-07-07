# Galilel Block Explorer

[![Build Status](https://travis-ci.com/Galilel-Project/galilel-explorer.svg?branch=master)](https://travis-ci.com/Galilel-Project/galilel-explorer)
[![GitHub version](https://badge.fury.io/gh/Galilel-Project%2Fgalilel-explorer.svg)](https://github.com/Galilel-Project/galilel-explorer/releases)
[![GitHub issues](https://img.shields.io/github/issues/Galilel-Project/galilel-explorer.svg)](https://github.com/Galilel-Project/galilel-explorer/issues)
[![GitHub forks](https://img.shields.io/github/forks/Galilel-Project/galilel-explorer.svg)](https://github.com/Galilel-Project/galilel-explorer/network/members)
[![GitHub stars](https://img.shields.io/github/stars/Galilel-Project/galilel-explorer.svg)](https://github.com/Galilel-Project/galilel-explorer/stargazers)
[![GitHub license](https://img.shields.io/github/license/Galilel-Project/galilel-explorer.svg)](https://github.com/Galilel-Project/galilel-explorer/blob/master/LICENSE)
[![GitHub downloads](https://img.shields.io/github/downloads/Galilel-Project/galilel-explorer/total.svg)](https://github.com/Galilel-Project/galilel-explorer/releases)

![](doc/img/explorer.jpg)

Simple and beautiful cryptocurrency block explorer system. It includes a
Proof-of-Stake calculator, masternode statistics and market statistics based
on CoinMarketCap (https://coinmarketcap.com/currencies/galilel/) data. Many
thanks for the original version to the Bulwark developers.

## Requirements

This repo assumes `git`, `mongodb`, `node` and `npm` are installed with
configuration done.  Please adjust commands to your local environment. The
following links will guide you through the installation.

Git: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

MongoDB: https://docs.mongodb.com/manual/administration/install-on-linux/

Node.js: https://nodejs.org/en/download/package-manager/

npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

It is also required to have the latest version of the Galilel
(https://github.com/Galilel-Project/galilel) desktop wallet daemon running in
the background. It is recommended to set this up before beginning to set up the
explorer so that it syncs by the time you need it.

## Install

Basic steps are to clone the repository into a local folder, switch into it and
install the packages used by the system.

```
git clone https://github.com/Galilel-Project/galilel-explorer.git
cd galilel-explorer
npm install
```

## Configuration

### API

Setup initial configuration using template. Edit the `config.js` and
`config_private.js` afterwards as needed.

```
cp config.template.js public/config.js
cp config_private.template.js config_private.js
```

### Database

You need to prepare MongoDB to store the blockchain data into it. Therefore a
database and a user with read and write permissions with the values stored in
the `config_private.js` must be created.

```
mongo
use galileldb
db.createUser( { user: "galileluser", pwd: "galilelpassword", roles: [ "readWrite" ] } )
exit
```

### Crontab

The following automated tasks are currently needed for Galilel Explorer to
update. First time you need to do initial sync of the blockchain via
`npm run cron:block`, takes a lot of time.

1. Fetch coin related information like price and supply from CoinMarketCap.

   `npm run cron:coin`

2. Update the masternodes list in the database with the most recent information
   clearing old information before.

   `npm run cron:masternode`

3. Gather the list of peers and fetch geographical IP information.

   `npm run cron:peer`

4. Sync blocks and transactions by storing them in the database.

   `npm run cron:block`

5. Generate the rich list.

   `npm run cron:rich`

It is recommended to run all the crons before editing the crontab to have the
information right away. Follow the order above, start with `cron:coin` and end
with `cron:rich`.

To setup the crontab please see run `crontab -e` to edit the crontab and paste
the following lines (edit with your local information):

```
*/1 * * * * cd /path/to/galilel-explorer && /path/to/node cron/block.js >> tmp/block.log 2>&1
*/1 * * * * cd /path/to/galilel-explorer && /path/to/node cron/masternode.js >> tmp/masternode.log 2>&1
*/1 * * * * cd /path/to/galilel-explorer && /path/to/node cron/peer.js >> tmp/peer.log 2>&1
*/1 * * * * cd /path/to/galilel-explorer && /path/to/node cron/rich.js >> tmp/rich.log 2>&1
*/5 * * * * cd /path/to/galilel-explorer && /path/to/node cron/coin.js >> tmp/coin.log 2>&1
```

## Build

At this time only the client web interface needs to be built using webpack and
this can be done by running `npm run build:web`. This will bundle the
application and put it in the `/public` folder for delivery.

## Run

1. Start the API.

   `npm run start:api`

2. Start the web, open browser [http://localhost:8081](http://localhost:8081).

   `npm run start:web`

## Test

1. Run the client side tests.

   `npm run test:client`

2. Test the rpc connection, database connection, and API endpoints.

   `npm run test:server`
