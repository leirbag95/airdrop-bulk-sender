<template>
  <v-container>
    <v-stepper v-model="e6" vertical editable outlined>
      <v-stepper-step :complete="e6 > 1" step="1">
        Connect you wallet
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card elevation="0" color="transparent">
          <v-card-actions>
            <v-btn class="white--text" @click="connect()" elevation="0" large>
              <v-avatar left size="30">
                <v-img src="@/assets/metamask-fox.svg"></v-img>
              </v-avatar> Metamask
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2" editable>
        Complete airdrop settings
        <small class="mt-2" v-if="account">You are now connected with the following account:
          <strong>{{account}}</strong></small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-row class="my-2">
          <v-col cols="12" lg="4">
            <v-autocomplete v-model="airdrop.network" :items="networks" outlined label="Network" item-text="chainName"
              item-value="item" return-object @change="(event) => switchNetwork(event)">
              <template v-slot:selection="data">
                <v-chip v-bind="data.attrs" :input-value="data.selected" close @click="data.select">
                  <v-avatar left size="10">
                    <v-img :src="data.item.icon"></v-img>
                  </v-avatar>
                  {{ data.item.chainName }}
                </v-chip>
              </template>
              <template v-slot:item="data">
                <template v-if="typeof data.item !== 'object'">
                  <v-list-item-content v-text="data.item"></v-list-item-content>
                </template>
                <template v-else>
                  <v-list-item-avatar size="20">
                    <img :src="data.item.icon">
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.chainName"></v-list-item-title>
                    <v-list-item-subtitle v-html="data.item.group"></v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col cols="12" lg="8">
            <v-form ref="form" v-model="form.tokenAddr" lazy-validation>
              <v-text-field name="tokenAddr" v-model="airdrop.token.address" outlined label="Token Address"
                :rules=[rules.evmAddress]></v-text-field>
            </v-form>
          </v-col>
        </v-row>
        <v-alert v-show="alert.isError" dense outlined type="error">
          {{alert.message}}
        </v-alert>
        <v-card class="mx-2 mb-4" tile v-show="airdrop.token.name.length > 0">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title><strong>Name</strong> {{airdrop.token.name}}</v-list-item-title>
              <v-list-item-subtitle>Symbol: {{airdrop.token.symbol}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title><strong>Your balance</strong> {{airdrop.token.balance / 10**airdrop.token.decimals}}
              </v-list-item-title>
              <v-list-item-subtitle>Decimals: {{airdrop.token.decimals}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-btn color="primary" class="mr-2" :disabled="airdrop.token.address.length == 0 || !form.tokenAddr"
          @click="fetchTokenData(airdrop.token.address)" :loading="loading">
          Fetch data
        </v-btn>
        <v-btn color="primary" class="mr-2" @click="e6 = 3" :disabled="airdrop.token.name.length == 0">
          Continue
        </v-btn>
        <v-btn text @click="e6 = 1">
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-step editable :complete="e6 > 3" step="3">
        Fill addresses and amounts to airdrop
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-file-input v-model="airdrop.files" label="File input" class="my-2"
          accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          outlined dense>
        </v-file-input>
        <v-card class="my-2" v-show="addresses.length > 0">
          <v-card-title>
            <v-text-field v-model="search" append-icon="mdi-magnify" label="Search" single-line hide-details>
            </v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="addresses" :search="search"></v-data-table>
        </v-card>
        <v-btn color="primary" @click="readAndShowTable()">
          Import file
        </v-btn>
        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-step step="4">
        View setup instructions
      </v-stepper-step>
      <v-stepper-content step="4">
        <v-card color="grey lighten-1" class="mb-12" height="200px"></v-card>
        <v-btn color="primary" @click="e6 = 1">
          Continue
        </v-btn>
        <v-btn text>
          Cancel
        </v-btn>
      </v-stepper-content>
    </v-stepper>
  </v-container>
</template>

<script>
  import { ERC20 } from '@/services/contracts/ABIs/ERC20.json'
  import { csvToArray } from '@/services/utils.js'
  import { ethers } from "ethers";

  export default {
    data() {
      return {
        loading: false,
        search: '',
        headers: [
          { text: 'Addresses', align: 'start', filterable: true, value: 'addresses' },
          { text: 'Amounts', filterable: true, value: 'amounts' }
        ],
        addresses: [],
        e6: 1,
        account: null,
        form: {
          tokenAddr: false
        },
        alert: {
          isError: false,
          message: ''
        },
        airdrop: {
          token: {
            name: '',
            decimals: '',
            symbol: '',
            balance: '',
            address: ''
          },
          network: {},
          files: ''
        },
        rules: {
          evmAddress: (value) => {
            const pattern = /^0x[a-fA-F0-9]{40}$/;
            return pattern.test(value) && !!value || "Wrong address format.";
          }
        },
        networks: [
          { chainName: 'Avalanche', chainId: "0xA86A", decChainId: 43114, rpcUrls: 'https://api.avax.network/ext/bc/C/rpc', 'icon': require('@/assets/avalanche-avax-logo.svg'), currency: 'AVAX', decimals: 18 },
          { chainName: 'Binance Smart Chain', chainId: "0x38", decChainId: 56, rpcUrls: 'https://bsc-dataseed2.binance.org', 'icon': require('@/assets/bnb-bnb-logo.svg'), currency: 'BNB', decimals: 18 },
          { chainName: 'Ethereum', chainId: "0x1", decChainId: 1, rpcUrls: 'https://rpc.ankr.com/eth', 'icon': require('@/assets/ethereum-eth-logo.svg'), currency: 'ETH', decimals: 18 },
          { chainName: 'Fantom Opera', chainId: "0xFA", decChainId: 250, rpcUrls: 'https://rpc.fantom.network', 'icon': require('@/assets/fantom-ftm-logo.svg'), currency: 'FTM', decimals: 18 }
        ]
      }
    },
    computed: {
    },
    methods: {
      async connect() {
        if (typeof window.ethereum !== 'undefined') {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          this.account = accounts[0];
          this.e6 += 1
        }
      },

      async switchNetwork(network) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: network.chainId }]
          })
        } catch (err) {
          if (err.code == 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainName: network.chainName,
                  chainId: network.chainId,
                  rpcUrls: [network.rpcUrls],
                  nativeCurrency: {
                    symbol: network.currency,
                    decimals: network.decimals
                  }
                }]
              })
            } catch (err2) {
              console.error('error adding new network', network, err2)
            }
          }
        }
      },

      async getCurrentNetwork() {
        var BreakException = {};
        let currentNetwork = await window.ethereum.networkVersion

        this.networks.forEach(network => {
          if (network.decChainId == currentNetwork) {
            this.airdrop.network = network
            throw BreakException;
          }
        });
      },

      /**
       * fetch token information like name, symbol, balance of user or decimals.
       * @param tokenAddr is the token to supply
       */
      async fetchTokenData(tokenAddr) {
        this.loading = true
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const tokenContract = new ethers.Contract(tokenAddr, ERC20, provider);
        // hide alert message
        this.alert.isError = false
        this.alert.message = ''

        try {
          this.airdrop.token.name = await tokenContract.name()
          this.airdrop.token.symbol = await tokenContract.symbol()
          this.airdrop.token.decimals = await tokenContract.decimals()
          this.airdrop.token.balance = await tokenContract.balanceOf(this.account)
        } catch (err) {
          this.alert.isError = true
          this.alert.message = err
        }

        this.loading = false
      },

      readAndShowTable() {
        const reader = new FileReader();
        this.content = "check the console for file output";
        reader.onload = (res) => {
          this.addresses = csvToArray(res.target.result)
        };
        reader.onerror = (err) => console.log(err);
        reader.readAsText(this.airdrop.files);
      }
    },
    created() {
      this.getCurrentNetwork()
    }
  }
</script>