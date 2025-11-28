// src/app/constants.ts
export const TOKEN_ADDRESS = "0x9Ab08019A0a63246181ac529295c333C8c66923c"; // ATT token (your token)
export const STAKING_ADDRESS = "0xREPLACE_WITH_YOUR_DEPLOYED_STAKING_ADDRESS";

export const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function balanceOf(address) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
];

export const STAKING_ABI = [
  "function stake(uint256 amount) external",
  "function claimReward() external",
  "function unstake(uint256 amount) external",
  "function earned(address user) view returns (uint256)",
  "function stakedBalance(address user) view returns (uint256)",
  "function contractTokenBalance() view returns (uint256)",
  "event Staked(address indexed user, uint256 amount)",
  "event Unstaked(address indexed user, uint256 amount, uint256 reward)",
  "event RewardClaimed(address indexed user, uint256 reward)",
];
