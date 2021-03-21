const { assert } = require('chai');

const StoriesNFT = artifacts.require("StoriesNFT");

contract('Stories NFT', ([deployer, account1, account2]) => {
    let storiesNFT;

    before(async() => {
        storiesNFT = await StoriesNFT.new();
    });

    describe('deployment', async() => {
        it('deploys successfully', async() => {
            const address = await storiesNFT.address;
            assert.notEqual(address, 0x0);
            assert.notEqual(address, '');
            assert.notEqual(address, null);
            assert.notEqual(address, undefined);
        });
    });

    describe('story', async() => {
        let result;
        let storiesCount;

        const storyTitle = "Story Test";
        const storyAuthorName = "Bob Doe";
        const storyPreview = "Testing the story";
        const storyDescription = "I am testing the story";
        const storyPrice = "10000000000000000000";

        before(async() => {
            result = await storiesNFT.createStory(storyTitle, storyAuthorName, storyPreview, storyDescription, storyPrice, { from: account1 });
            storiesCount = await storiesNFT.storiesCount();
        });

        it('create a story', async() => {
            const event = result.logs[0].args;
            assert.equal(event.storyId.toNumber(), storiesCount.toNumber(), 'Id is correct');
            assert.equal(event.title, storyTitle, 'Title is correct');
            assert.equal(event.authorName, storyAuthorName, 'Author name is correct');
            assert.equal(event.preview, storyPreview, 'Preview is correct');
            assert.equal(event.description, storyDescription, 'Description is correct');
            assert.equal(event.price, storyPrice, 'Price is correct');
            assert.notEqual(event.date, null, "Date is not empty");
            assert.equal(event.authorAddress, account1, 'Author address is correct');
        });

        it('has correct story count', async() => {
            assert.equal(storiesCount, 1);
        });

        it('has correct list of stories', async() => {
            const story = await storiesNFT.stories(storiesCount);
            assert.equal(story.storyId.toNumber(), storiesCount.toNumber(), 'Id is correct');
            assert.equal(story.title, storyTitle, 'Title is correct');
            assert.equal(story.authorName, storyAuthorName, 'Author name is correct');
            assert.equal(story.preview, storyPreview, 'Preview is correct');
            assert.equal(story.description, storyDescription, 'Description is correct');
            assert.equal(story.price, storyPrice, 'Price is correct');
            assert.notEqual(story.date, null, "Date is not empty");
            assert.equal(story.authorAddress, account1, 'Author address is correct');
        });
    });

    describe('buy story ', async() => {
        let result;
        let story;
        let storyId = 1;
        
        before(async() => {
            story = await storiesNFT.stories(storyId);
        });
        
        it('received correct amount', async() => {
            let oldAuthorBalanace = await web3.eth.getBalance(account1);
            oldAuthorBalanace = new web3.utils.BN(oldAuthorBalanace);

            result = await storiesNFT.buyStory(storyId, { from: account2, value: story.price });
            
            let newAuthorBalanace = await web3.eth.getBalance(account1);
            newAuthorBalanace = new web3.utils.BN(newAuthorBalanace);

            let amount = story.price;
            amount = new web3.utils.BN(amount);

            const expectedBalance = oldAuthorBalanace.add(amount);

            assert.equal(newAuthorBalanace.toString(), expectedBalance.toString());
            
            const event = result.logs[1].args;
            assert.equal(event.storyId, storyId, 'Story ID is correct');
            assert.equal(event.amount.toString(), story.price, 'Amount is correct');
            assert.notEqual(event.date, null, "Date is not null");
            assert.equal(event.from, account2, 'User address is correct');
            assert.equal(event.author, account1, 'Author address is correct');
        });

        it('mint NFT for the user', async () => {
            result = await storiesNFT.totalSupply();
            assert.equal(result.toString(), '1', 'Total supply is correct');

            result = await storiesNFT.balanceOf(account2);
            assert.equal(result.toString(), '1', 'User got NFT');

            result = await storiesNFT.ownerOf('1');
            assert.equal(result.toString(), account2.toString(), 'User get the token');
            result = await storiesNFT.tokenOfOwnerByIndex(account2, 0);
            
            let balanceOf = await storiesNFT.balanceOf(account2);
            let tokenIds = [];

            for(let i = 0; i < balanceOf; i++){
                let id = await storiesNFT.tokenOfOwnerByIndex(account2, i);
                tokenIds.push(id.toString());
            }
            
            let expected = ['1'];
            assert.equal(tokenIds.toString(), expected.toString(), 'Token ID is correct');

            let tokenURI = await storiesNFT.tokenURI('1');
            assert.equal(tokenURI, story.description, 'Token file ID is correct');
        })
    });
})