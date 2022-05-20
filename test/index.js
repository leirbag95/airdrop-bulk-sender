const { waffle } = require('hardhat');
const { airdropFixture } = require('./shared/fixtures');
const { airdropFactoryTest } = require('./unit/0_airdrop_factory.spec');
const { airdropHistoryTest } = require('./unit/1_airdrop_history.spec');

describe('Unit Tests', async function () {
  before(async function() {
    const wallets = waffle.provider.getWallets();

    this.signers = {};
    this.signers.deployer = wallets[0];

    this.loadFixture = waffle.createFixtureLoader(wallets);
  })

  describe('Airdrop Factory', async function() {
    beforeEach(async function () {
      const { airdropFactory, erc20, airdropHistory } = await this.loadFixture(airdropFixture);

      this.airdropFactory = airdropFactory;
      this.airdropHistory = airdropHistory;
      this.mockToken = erc20;
    });

    airdropFactoryTest();
    airdropHistoryTest();
  })
})