# Stories NFT
A dapp that allows reader to buy stories in NFT

- Live Site - https://storiesnft.netlify.app/
- Demo - https://youtu.be/LNgazG0Npjc
- Won Second Place at Fleek's Gitcoin GR9 Hackathon
- Blog - https://blog.fleek.co/posts/gitcoin-gr9-hackathon-fleek-winners

## Features
- Writers can create their story
- Files are store on Fleek Storage
- User can buy the story and earn NFT which contains a link to the full content of the story

## Technologies
- Vue 2
- Vuex 3
- Bootstrap 4
- Solidity
- Openzeppelin/contracts ERC721.sol
- Fleek Storage
- Space SDK

## Project setup
```
npm install
```

### Create a file called 'config.js' on the src folder and add the following code
```
export const fleekAPIKey = "Create API key from Fleek";
export const fleekAPISecret = "Create API key from Fleek";
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
