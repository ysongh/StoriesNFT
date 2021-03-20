const StoriesNFT = artifacts.require("StoriesNFT");

module.exports = async function(deployer){
	deployer.deploy(StoriesNFT);
};