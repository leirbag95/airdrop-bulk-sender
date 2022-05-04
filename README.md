
# Get started with Hardhat

## Requirements

Start by <a href="https://hardhat.org/tutorial/setting-up-the-environment.html" target="__blank"> installing hardhat on your local.</a>
Hardhat is an Ethereum development environment. Compile your contracts and run them on a development network.

Then install <a href="https://vuetifyjs.com/en/getting-started/installation/" target="__blank">vue + vuetify</a>.

## Testing contract

```
npx hardhat test
```

## Deploy contract

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