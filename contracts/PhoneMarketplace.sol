// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract PhoneMarketplace is ReentrancyGuard {
    // Using native WND token on Westend
    uint256 public constant CHAIN_ID = 420420421;
    string public constant RPC_URL =
        "https://westend-asset-hub-eth-rpc.polkadot.io";
    string public constant EXPLORER_URL = "https://assethub-westend.subscan.io";
    string public constant SYMBOL = "WND";

    struct Phone {
        address seller;
        string manufacturer;
        string modelName;
        string modelCode;
        string imei;
        uint256 price;
        bool isSold;
        bool isVerified;
        bool isDispatched;
        bool isReceived;
        address buyer;
    }

    Phone[] public phones;
    mapping(address => uint256[]) public userPhones;

    event PhoneListed(
        uint256 indexed phoneId,
        address indexed seller,
        uint256 price
    );
    event PhoneSold(
        uint256 indexed phoneId,
        address indexed seller,
        address indexed buyer,
        uint256 price
    );
    event PhoneVerified(uint256 indexed phoneId, address indexed verifier);
    event PhoneDispatched(uint256 indexed phoneId, address indexed seller);
    event PhoneReceived(uint256 indexed phoneId, address indexed buyer);

    constructor() {
        require(
            block.chainid == CHAIN_ID,
            "PhoneMarketplace: unsupported chain"
        );
    }

    function listPhone(
        string memory manufacturer,
        string memory modelName,
        string memory modelCode,
        string memory imei,
        uint256 price
    ) external returns (uint256) {
        uint256 phoneId = phones.length;
        phones.push(
            Phone({
                seller: msg.sender,
                manufacturer: manufacturer,
                modelName: modelName,
                modelCode: modelCode,
                imei: imei,
                price: price,
                isSold: false,
                isVerified: false,
                isDispatched: false,
                isReceived: false,
                buyer: address(0)
            })
        );
        userPhones[msg.sender].push(phoneId);
        emit PhoneListed(phoneId, msg.sender, price);
        return phoneId;
    }

    function buyPhone(uint256 phoneId) external payable nonReentrant {
        require(phoneId < phones.length, "Phone does not exist");
        Phone storage phone = phones[phoneId];
        require(!phone.isSold, "Phone already sold");
        require(phone.seller != msg.sender, "Cannot buy your own phone");
        require(msg.value == phone.price, "Incorrect payment");

        phone.isSold = true;
        phone.buyer = msg.sender;
        // Add to buyer's phone list
        userPhones[msg.sender].push(phoneId);
        emit PhoneSold(phoneId, phone.seller, msg.sender, phone.price);
    }

    function dispatchPhone(uint256 phoneId) external {
        require(phoneId < phones.length, "Phone does not exist");
        Phone storage phone = phones[phoneId];
        require(phone.seller == msg.sender, "Only seller can dispatch");
        require(phone.isSold, "Phone not sold yet");
        require(!phone.isDispatched, "Phone already dispatched");

        phone.isDispatched = true;
        emit PhoneDispatched(phoneId, msg.sender);
    }

    function confirmReceived(uint256 phoneId) external {
        require(phoneId < phones.length, "Phone does not exist");
        Phone storage phone = phones[phoneId];
        require(phone.buyer == msg.sender, "Only buyer can confirm");
        require(phone.isSold, "Phone not sold yet");
        require(phone.isDispatched, "Phone not dispatched yet");
        require(!phone.isReceived, "Already confirmed");

        phone.isReceived = true;
        emit PhoneReceived(phoneId, msg.sender);

        // Transfer native WND from escrow to seller
        payable(phone.seller).transfer(phone.price);
    }

    function verifyPhone(
        uint256 phoneId,
        string memory imei
    ) external returns (bool) {
        require(phoneId < phones.length, "Phone does not exist");
        Phone storage phone = phones[phoneId];
        require(!phone.isVerified, "Phone already verified");
        require(
            keccak256(abi.encodePacked(phone.imei)) ==
                keccak256(abi.encodePacked(imei)),
            "IMEI mismatch"
        );

        phone.isVerified = true;
        emit PhoneVerified(phoneId, msg.sender);
        return true;
    }

    function getPhone(
        uint256 phoneId
    )
        external
        view
        returns (
            address seller,
            string memory manufacturer,
            string memory modelName,
            string memory modelCode,
            string memory imei,
            uint256 price,
            bool isSold,
            bool isVerified,
            bool isDispatched,
            bool isReceived,
            address buyer
        )
    {
        require(phoneId < phones.length, "Phone does not exist");
        Phone storage phone = phones[phoneId];
        return (
            phone.seller,
            phone.manufacturer,
            phone.modelName,
            phone.modelCode,
            phone.imei,
            phone.price,
            phone.isSold,
            phone.isVerified,
            phone.isDispatched,
            phone.isReceived,
            phone.buyer
        );
    }

    function getPhoneCount() external view returns (uint256) {
        return phones.length;
    }

    function getMyPhones() external view returns (uint256[] memory) {
        return userPhones[msg.sender];
    }
}
