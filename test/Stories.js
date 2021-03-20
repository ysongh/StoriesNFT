const { assert } = require('chai');

const StoriesNFT = artifacts.require("StoriesNFT");

contract('Stories NFT', ([deployer, account1]) => {
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
})