/**
 * Global private configuration object.
 */
const config-private = {
  db: {
    'host': 'localhost',
    'port': '27017',
    'name': 'galileldb',
    'user': 'galileluser',
    'pass': 'galilelpassword'
  },
  rpc: {
    'host': 'localhost',
    'port': '36002',
    'user': 'rpcuser',
    'pass': 'rpcpassword',

    /**
     * Timeout 8 seconds.
     */
    'timeout': 8000,
  }
};

module.exports = config-private;
