
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
| Network Name | Chain ID | RPC |
| :---: | :---: | :---: |
| Avalanche | 0xA86A | https://api.avax.network/ext/bc/C/rpc |
| Avalanche Fuji Testnet | 0xA869 | https://api.avax-test.network/ext/bc/C/rpc |
| Binance Smart Chain | 0x38 | https://bsc-dataseed2.binance.org |
| Ethereum | 0x1 | https://rpc.ankr.com/eth |
| Fantom Opera | 0xFA | https://rpc.fantom.network |
| Fantom Tesnet | 0xFA2 | https://rpc.testnet.fantom.network |


If you want to add and deploy protocol on a new network:

1. open and edit `hardhat.config.js` and add it according to the following format:

```
networks: {
    <name of you network>: {
      url: "<rpc of your network>",
      accounts: ["<List of private key>"...]
    }
  }
```

2. edit `/services/networks.json` and add data (I fetched network data from <a href="chainlist.org" target="_blank">chainlist.org</a>)
3. edit `/services/contracts/addresses.json` and add your deployed contract like the following format:

```
{
    "AirdropFactoryContractAddress": {
        "0x000": "0x000...00",
        ...
        "<YOUR CHAIN ID IN HEX>": "<CONTRACT ADDRESS>",
        ...
        "0x001": "0x000...01",
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
