# Getting Started

- clone the repo
- run `yarn` to install all the dependencies
> if you don't have yarn but do have npm, run `npx yarn`
- if you want to meddle with deployment stuff, [install pulumi](https://www.pulumi.com/docs/get-started/install/)

## Starting all the things
- run `yarn start` from the root

## Testing all the things
- run `yarn ci`

## Stuff

- The project uses [yarn workspaces](https://yarnpkg.com/lang/en/docs/workspaces/)
- All relevant things are within the `packages` folder
- Check the main `package.json` for overall commands
- You can set up AWS Amplify, the supplied config should suffice

# DISCLAIMER
The deployment things are only set up for the UI.
The api is TBD
