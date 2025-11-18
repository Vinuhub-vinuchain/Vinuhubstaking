import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Staking Contract', () => {
  it('allows staking minimum 10 VIN', async () => {
    const [owner, user] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("MockERC20");
    const token = await Token.deploy();
    const Staking = await ethers.getContractFactory("Staking");
    const staking = await Staking.deploy(token.address);

    await token.mint(user.address, ethers.parseUnits("100", 18));
    await token.connect(user).approve(staking.address, ethers.parseUnits("10", 18));
    await staking.connect(user).stake(ethers.parseUnits("10", 18));

    const info = await staking.getStakeInfo(user.address);
    expect(info.amount).to.equal(ethers.parseUnits("10", 18));
  });
});
