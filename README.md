# Ethernaut

✅ My solutions to the [Ethernaut Challenge](https://ethernaut.openzeppelin.com/).

## Development

1. Install project dependencies

```
  yarn install
```

2. Setup environment variables:

- Create an .env file
- Populate values specified in the .env.example file.

## Running solutions

The solutions are implemented in this repo can be found in [`/scripts`](./scripts).

To run a solution script, you you'll need to:

- update the contract instance address in the script file
- run the following command:

```
npx hardhat run scripts/<script-name> --network rinkeby
```
