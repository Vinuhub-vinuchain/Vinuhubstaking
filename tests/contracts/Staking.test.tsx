import { ethers } from 'hardhat';
import { expect } from 'chai';

describe('Staking', () => {
  let staking: any, vinToken: any, owner: any, user: any;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const VinToken = await ethers.getContractFactory('MockERC20');
    vinToken = await VinToken.deploy();
    await vinToken.deployed();
    const Staking = await ethers.getContractFactory('Staking');
    staking = await Staking.deploy(vinToken.address);
    await staking.deployed();
    await vinToken.mint(user.address, ethers.utils.parseUnits('1000', 18));
  });

  it('allows staking', async () => {
    await vinToken.connect(user).approve(staking.address, ethers.utils.parseUnits('100', 18));
    await staking.connect(user).stake(ethers.utils.parseUnits('100', 18));
    const stakeInfo = await staking.getStakeInfo(user.address);
    expect(stakeInfo.amount).to.equal(ethers.utils.parseUnits('100', 18));
  });
});
