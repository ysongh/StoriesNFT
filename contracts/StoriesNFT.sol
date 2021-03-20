pragma solidity ^0.6.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract StoriesNFT is ERC721 {
    uint public storiesCount = 0;
    mapping(uint => Story) public stories;

    struct Story {
        uint storyId;
        string title;
        string authorName;
        string preview;
        string description;
        uint price;
        uint date;
        address payable authorAddress;
    }

    event StoryCreated (
        uint storyId,
        string title,
        string authorName,
        string preview,
        string description,
        uint price,
        uint date,
        address payable authorAddress
    );

    constructor() ERC721("StoriesToken", "ST") public {}

    function createStory(string memory _title, string memory _authorName, string memory _preview, string memory _description, uint _price) public {
        storiesCount++;

        stories[storiesCount] = Story(storiesCount, _title, _authorName, _preview, _description, _price, now, msg.sender);
        emit StoryCreated(storiesCount, _title, _authorName, _preview, _description, _price, now, msg.sender);
    }
}