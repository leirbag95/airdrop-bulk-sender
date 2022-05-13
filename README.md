
# Get started with Hardhat

## Try it now

A build of the dapp was deployed on ipfs and then pinned on aleph.im.

You can access the application now on <a href="https://ipfs.io/ipfs/QmcucpwWiurssnUf6K22g9eRmQJXQgefRtLeFWpqvu1ajn/#/" target="_blank">https://ipfs.io/ipfs/QmcucpwWiurssnUf6K22g9eRmQJXQgefRtLeFWpqvu1ajn/#/</a>

Attention please, only the `Avalanche Fuji Testnet` is available on this version

## Requirements

Start by <a href="https://hardhat.org/tutorial/setting-up-the-environment.html" target="__blank"> installing hardhat on your local.</a>
Hardhat is an Ethereum development environment. Compile your contracts and run them on a development network.

Then install <a href="https://vuetifyjs.com/en/getting-started/installation/" target="__blank">vue + vuetify</a>.

## Testing contract

```
npx hardhat test
```

## Deploy contract

```
npx hardhat run --network <YOUR_NETWORK> script/deploy.js
```

Here is the list of the compatible networks:
- Avalanche Fuji (TESTNET)
- Avalanche (MAINNET)
- Fantom Opera (MAINNET)
- Binance Smart Chain (MAINNET)

If you want to add a new network, open and edit `hardhat.config.js` and add it according to the following format:

```
networks: {
    <name of you network>: {
      url: "<rpc of your network>",
      accounts: ["<List of private key>"...]
    }
  }
```

## Running client

For running the front end on localhost:

```
cd client/
npm install
npm run serve
```

Then open (default) <a href="http://localhost:8080" target="__blank">http://localhost:8080</a>
