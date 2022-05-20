const { expect } = require("chai");
const { parseEther } = require("ethers/lib/utils");
const { ethers, waffle } = require("hardhat");

const airdropFactoryTest = () => {
    context("Airdrop Factory", async function() {
        describe('set airdrop history', async function () {
            it('should fail if not owner', async function() {
                const signer = waffle.provider.getWallets()[1];
                const wallet = await this.airdropFactory
                    .connect(signer);

                await expect(wallet.setAirdropHistory(this.airdropHistory.address))
                    .to.be.reverted;
            })

            it('should set contract airdrop history', async function() {
                const deployer = this.signers.deployer;
                await this.airdropFactory
                    .connect(deployer)
                    .setAirdropHistory(this.airdropHistory.address);
    
                expect(await this.airdropFactory.airdropHistory())
                    .to.equal(this.airdropHistory.address);
            })
        })

        // describe('should send tokens', async function() {
        //     const deployer = this.signers.deployer;
        //     const token = this.token;
        //     const gas = parseEther('1');

        //     await 
        // })
    })
}

module.exports = {
    airdropFactoryTest
}