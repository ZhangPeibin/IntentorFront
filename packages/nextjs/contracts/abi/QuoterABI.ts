export const QUOTER_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "admin",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "EmptyFactory",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyQuoter",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyToken0",
    type: "error",
  },
  {
    inputs: [],
    name: "EmptyToken1",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    inputs: [],
    name: "PoolNotFound",
    type: "error",
  },
  {
    inputs: [],
    name: "UnSupportedDex",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "quoter",
        type: "address",
      },
      {
        indexed: true,
        internalType: "enum Enum.DEX",
        name: "dex",
        type: "uint8",
      },
    ],
    name: "QuoterUpdated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "enum Enum.DEX",
        name: "",
        type: "uint8",
      },
    ],
    name: "dexInfos",
    outputs: [
      {
        internalType: "address",
        name: "quoter",
        type: "address",
      },
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
      {
        internalType: "address",
        name: "token0",
        type: "address",
      },
      {
        internalType: "address",
        name: "token1",
        type: "address",
      },
    ],
    name: "poolFee",
    outputs: [
      {
        internalType: "uint24",
        name: "",
        type: "uint24",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenOut",
            type: "address",
          },
          {
            internalType: "enum Enum.DEX",
            name: "dex",
            type: "uint8",
          },
        ],
        internalType: "struct IQuoter.QuoterParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "quoteExactInput",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
      {
        internalType: "uint24",
        name: "poolFee",
        type: "uint24",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "tokenIn",
            type: "address",
          },
          {
            internalType: "address",
            name: "tokenOut",
            type: "address",
          },
          {
            internalType: "enum Enum.DEX",
            name: "dex",
            type: "uint8",
          },
        ],
        internalType: "struct IQuoter.QuoterParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "quoteExactOutput",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
      {
        internalType: "uint24",
        name: "poolFee",
        type: "uint24",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "enum Enum.DEX",
        name: "dex",
        type: "uint8",
      },
      {
        internalType: "address",
        name: "quoter",
        type: "address",
      },
      {
        internalType: "address",
        name: "factory",
        type: "address",
      },
    ],
    name: "setDexInfo",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];
