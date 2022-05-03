<template>
  <v-container>
    <v-stepper v-model="e6" vertical editable outlined>
      <v-stepper-step :complete="e6 > 1" step="1">
        Connect you wallet
      </v-stepper-step>

      <v-stepper-content step="1">
        <v-card elevation="0" class="mb-12">
          <v-card-actions>
            <v-btn color="orange" class="white--text" @click="connect()" elevation="0">Metamask</v-btn>
          </v-card-actions>
        </v-card>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 2" step="2" editable>
        Complete airdrop settings
        <small class="mt-2" v-if="account">You are now connected with the following account:
          <strong>{{account}}</strong></small>
      </v-stepper-step>

      <v-stepper-content step="2">
        <v-row>
          <v-col cols="12" md="4">
            <v-autocomplete v-model="airdrop.network" :items="networks" dense outlined label="Network"
              item-text="chainName" item-value="item" return-object @change="(event) => switchNetwork(event)">
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
          <v-col cols="12" md="8">
            <v-form ref="form" v-model="form.tokenAddr" lazy-validation>
              <v-text-field name="tokenAddr" v-model="airdrop.token.address" outlined dense label="Token Address"
                :rules=[rules.evmAddress]></v-text-field>
            </v-form>
          </v-col>
        </v-row>

        <v-card class="mx-2 mb-4" tile v-show="airdrop.token.name.length > 0">
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title><strong>Name</strong> {{airdrop.token.name}}</v-list-item-title>
              <v-list-item-subtitle>Symbol: {{airdrop.token.symbol}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title><strong>Your balance</strong> {{airdrop.token.balance / 10**airdrop.token.decimals}}</v-list-item-title>
              <v-list-item-subtitle>Decimals: {{airdrop.token.decimals}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card>
        <v-btn color="primary" class="mx-2" :disabled="airdrop.token.address.length == 0 || !form.tokenAddr"
          @click="fetchTokenData(airdrop.token.address)" :loading="loading">
          Fetch data
        </v-btn>
        <v-btn color="primary" @click="e6 = 3" :disabled="airdrop.token.name.length == 0">
          Continue
        </v-btn>
        <v-btn text @click="e6 = 1">
          Cancel
        </v-btn>
      </v-stepper-content>

      <v-stepper-step :complete="e6 > 3" step="3">
        Fill addresses and amounts to airdrop
      </v-stepper-step>

      <v-stepper-content step="3">
        <v-card class="mb-12" elevation="0">
          <v-textarea name="input-7-1" label="Your addresses" value="addresses,amounts" outlined></v-textarea>

        </v-card>
        <v-btn color="primary" @click="e6 = 4">
          Continue
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
  import { ethers } from "ethers";

  export default {
    data() {
      return {
        loading: false,
        e6: 1,
        account: null,
        form: {
          tokenAddr: false
        },
        airdrop: {
          token: {
            name: '',
            decimals: '',
            symbol: '',
            balance: '',
            address: ''
          },
          network: {}
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

      async getCurrentNetwork () {
        var BreakException = {};
        let currentNetwork = await window.ethereum.networkVersion
        console.log(currentNetwork)
        this.networks.forEach(network => {
          if (network.decChainId == currentNetwork) {
            this.airdrop.network = network
            throw BreakException;
          }
        });
      },

      async fetchTokenData(tokenAddr) {
        this.loading = true
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const tokenContract = new ethers.Contract(tokenAddr, ERC20, provider);

        try {
          this.airdrop.token.name = await tokenContract.name()
          this.airdrop.token.symbol = await tokenContract.symbol()
          this.airdrop.token.decimals = await tokenContract.decimals()
          this.airdrop.token.balance = await tokenContract.balanceOf(this.account)
        } catch (err) {
          console.error(err)
        }
        this.loading = false
      }
    },

    created () {
        this.getCurrentNetwork()
    }
  }
</script>