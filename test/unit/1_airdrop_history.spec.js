const { expect } = require("chai");

const airdropHistoryTest = () => {
    context("Airdrop History", async function() {
        it('should initialise contract', async function() {
            const airdropFactory = await this.airdropHistory.airdropFactory();
            expect(airdropFactory).to.equal(this.airdropFactory.address);
        })
    })
}

module.exports = {
    airdropHistoryTest
}