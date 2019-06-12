# Galilel Block Explorer

![](doc/img/explorer.jpg)

Simple and beautiful cryptocurrency block explorer system. It includes a
Proof-of-Stake calculator, masternode statistics and market statistics based
on CoinMarketCap (https://coinmarketcap.com/currencies/galilel/) data. Many
thanks for the original version to the Bulwark developers.

## Requirements

This repo assumes `git`, `mongodb`, `node` and `yarn` are installed with
configuration done.  Please adjust commands to your local environment. The
following links will guide you through the installation.

Git: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git

MongoDB: https://docs.mongodb.com/manual/administration/install-on-linux/

Node.js: https://nodejs.org/en/download/package-manager/

Yarn: https://yarnpkg.com/lang/en/docs/install/

It is also required to have the latest version of the Galilel
(https://github.com/Galilel-Project/galilel) desktop wallet daemon running in
the background. It is recommended to set this up before beginning to set up the
explorer so that it syncs by the time you need it.

## Install

`git clone https://github.com/Galilel-Project/galilel-explorer.git` - copy repo to local folder.

`cd galilel-explorer` - change into project directory.

`yarn install` - install packages used by the system.

## Configuration

### API

`cp config.template.js config.js` - setup configuration using template.

### Database

`mongo` - connect using mongo client.

`use galileldb` - switch to database.

`db.createUser( { user: "galileluser", pwd: "galilelpassword", roles: [ "readWrite" ] } )` - create a user with the values stored in the `config.js` file from above, meaning they should match.

`exit` - exit the mongo client.

You should not build the frontend using the same `config.js` file as created
above or you *will leak* sensitive database information.

### Crontab

The following automated tasks are currently needed for Galilel Explorer to
update. First time you need to do initial sync of the blockchain via
`node cron/block.js`, takes a lot of time.

`yarn run cron:coin` - will fetch coin related information like price and
supply from CoinMarketCap

`yarn run cron:masternode` - updates the masternodes list in the database with
the most recent information clearing old information before.

`yarn run cron:peer` - gather the list of peers and fetch geographical IP
information.

`yarn run cron:block` - will sync blocks and transactions by storing them in
the database.

`yarn run cron:rich` - generate the rich list.

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
this can be done by running `yarn run build:web`. This will bundle the
application and put it in the `/public` folder for delivery.

## Run

`yarn run start:api` - will start the api.

`yarn run start:web` - will start the web, open browser [http://localhost:8081](http://localhost:8081).

## Test

`yarn run test:client` - will run the client side tests.

`yarn run test:server` - will test the rpc connection, database connection, and
api endpoints.
