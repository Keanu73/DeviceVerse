For Remix environment:
1. start remixd environment: pnpm remixd
2. edit, deploying and pin smart contracts in Remix
3. export the contracts: pnpm contracts:export

For local environment:
1. edit and build smart contracts: pnpm contracts:build
2. deploy smart contracts to chain: pnpm contracts:deploy
3. export the contracts: pnpm contracts:export

Use the contract in the frontend app:
1. use exported smart contract address in frontend/src/App.tsx
2. start frontend app: pnpm frontend:dev
