pragma solidity 0.4.24;

import "./EtherpostInterface.sol";
import "./Etherpost.sol";
import "./Username.sol";

contract Etherpost {	

	bytes32[] ipfsHashes;

	event LogUpload(address uploader, bytes32 ipfsHash);
	// address public owner;

	// modifier onlyOwner() {
	// 	require(msg.sender == owner);
	// 	_;
	// }

	// constructor() public {
	// 	owner = msg.sender;
	// }

	mapping(address => bytes32[]) uploads;

	function upload(bytes32 ipfsHash) public {
		uploads[msg.sender].push(ipfsHash);
		emit LogUpload(msg.sender, ipfsHash);
	}

	function getUploads(address uploader) public view returns(bytes32[]) {
		return uploads[uploader];
	}
}
