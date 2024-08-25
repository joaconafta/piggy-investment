# Piggy Investment

**Piggy Investment** is a decentralized application (dApp) designed to facilitate secure and automated cryptocurrency investments, specifically tailored for families, parents, and children. With a transparent and friendly interface, Piggy Investment allows users to easily manage their crypto investments through Dollar-Cost Averaging (DCA) strategies.

## Features

- **Login with Privy**: Securely log in using Privy and link your account with Safe to manage your assets.
- **Automatic DCA Strategies**: Automatically invest USDC into WBTC or WETH through DCA strategies.
- **Manage Positions**: Create, view, terminate, and withdraw your investment positions.
- **Integration with Balmy SDK**: DCA is implemented using the Balmy SDK to ensure secure and automated investing.

## How It Works

### Login and Smart Account Integration

Piggy Investment leverages Privy for secure user authentication and Safe for managing smart accounts. Upon logging in, users' accounts are linked to a Safe Smart Account, which serves as a secure and flexible way to manage their crypto assets. The smart account setup involves creating a wallet client that interacts with the Ethereum blockchain via Ethers.js, allowing for seamless integration with various DeFi protocols.

### Automated DCA Strategies

Piggy Investment automates the process of investing USDC into WBTC or WETH through a Dollar-Cost Averaging (DCA) strategy. This is achieved using the Balmy SDK, which provides the necessary tools to create, manage, and execute these DCA strategies. 

Users can initiate DCA transactions that periodically swap USDC for WBTC or WETH at predefined intervals. This strategy reduces the impact of market volatility by spreading out the purchase of assets over time. The smart contract interactions are handled securely through the Safe Smart Account, ensuring that users retain full control over their assets.

### Managing Investment Positions

Users can create new investment positions by defining the amount of USDC to invest, the target asset (WBTC or WETH), and the frequency of the swaps. Once a position is created, users can monitor their positions in real-time, view their current balances, and track the progress of their investments.

Piggy Investment also provides the functionality to terminate and withdraw positions. Terminating a position stops the DCA process, and users can choose to withdraw any remaining funds back to their Safe Smart Account. These actions are securely executed through the Balmy SDK, ensuring that all transactions are transparent and verifiable on the blockchain.

## Implementation Details

### Smart Account and Wallet Management

Piggy Investment uses the Safe SDK to manage user accounts. When a user logs in via Privy, a Safe Smart Account is created or accessed, enabling users to manage their assets securely. The Safe account setup includes integrating Pimlico’s Paymaster and Bundler services, which optimize the gas fee management and transaction bundling for efficient execution on the Ethereum network.

### DCA Execution with Balmy SDK

The DCA strategy is implemented using the Balmy SDK, which interfaces with smart contracts specifically designed to handle recurring swaps of USDC to WBTC or WETH. The Balmy SDK allows Piggy Investment to automate these transactions according to the user-defined schedule, ensuring consistent investment behavior even during market fluctuations.

The smart contract handling for the DCA strategies includes secure approval processes and interaction with ERC20 tokens. The approval of USDC tokens for swapping is executed via smart contracts, and the resulting assets (WBTC or WETH) are securely stored in the user's Safe Smart Account.

### Terminating and Withdrawing Positions

Terminating a DCA position involves invoking the appropriate smart contract functions via the Balmy SDK. Once a position is terminated, any remaining funds that were allocated for future swaps can be withdrawn by the user. The funds are transferred back to the Safe Smart Account, allowing users to maintain full control over their assets.

This feature is particularly useful for users who wish to stop their investment strategy due to market changes or personal preferences. The entire process is handled within the Piggy Investment interface, providing a seamless and user-friendly experience.


## Technologies Used

### UI

- **React.js**: Used to build a responsive and user-friendly interface.

### Blockchain Integration

- **Ethers.js**: A library for interacting with Ethereum smart contracts.
- **Safe SDK**: Utilized to manage secure smart accounts.
- **Privy SDK**: Implemented for secure user authentication and data management.
- **Balmy SDK**: Used to execute Dollar-Cost Averaging (DCA) strategies on the blockchain.

### Smart Contracts

- **Balmy Protocol Contracts**: Smart contracts used to execute DCA strategies from USDC to WBTC or WETH.
- **Safe Contracts**: Smart contracts used to manage and secure user assets.

## Why Piggy Investment?

**Piggy Investment** is designed to be the ideal solution for families looking to start investing in cryptocurrencies in a secure and automated way. With a focus on transparency and ease of use, it is the perfect tool for parents and children looking to grow their investment portfolio with confidence.

## Getting Started

### Prerequisites

- Node.js (>=20) and npm installed (or pnpm)
- Git

### Quickstart

To get started, follow the steps bellow:

1. Install the dependencies using `npm`:

```bash
npm install
```

2. Run the `npm run dev` command to start the development server:

```bash
npm run dev
```

3. Visit `http://localhost:3000` to view your app.
