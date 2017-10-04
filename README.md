# Holo Git [![Build Status](https://travis-ci.com/maneesht/HoloGit.svg?token=HusTaf8T8UP2cptpeArK&branch=master)](https://travis-ci.com/maneesht/HoloGit) 

## Setup
### Server
The server-side uses [yarn](https://yarnpkg.com/en/)

Yarn utilizes `npm`. Yarn is the new standard; it caches and generally installs dependencies faster than plain `npm`.

To Install:
1. Install Nodejs
2. `git clone https://github.com/ABostock/HoloGit`
3. `cd server`
4. `npm install -g yarn # if already installed, skip this step`
5. `yarn install`
6. `yarn start`

#### Adding a node dependency
`yarn add <package-name>`

#### Removing dependency
`yarn remove <package-name>`

### Running tests
`yarn test`
