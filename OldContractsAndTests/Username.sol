pragma solidity 0.4.24;

contract Username {
	struct User {
	    address userAddress;
	    string name;
	    uint index;
	}

mapping (address => User) public userInfo;
mapping (bytes32 => bool) public usernames;
uint numUsers = 0;

	function register(string _name) public {
		// Ensure users address is not already registered
		require(isAddressAvailable(msg.sender));
		//Ensure username us not already taken
		require(isNameAvailable(_name));
		userInfo[msg.sender] = User(msg.sender, _name, numUsers);
		bytes32 _bytes32Name = stringToBytes32(_name);
		usernames[_bytes32Name] = true;
		numUsers++;
	}

	function isAddressAvailable(address _usersEthAddress) public view returns(bool) {
		return  userInfo[_usersEthAddress].userAddress == address(0);
	}

	function isNameAvailable(string _name) public view returns(bool) {
		bytes32 _bytes32Name = stringToBytes32(_name);
		return  usernames[_bytes32Name] == false;
	}

	function getName(address _usersEthAddress) public view returns(string) {
		return userInfo[_usersEthAddress].name;
	}

	function numberOfUsers() public view returns(uint) {
		return numUsers;
	}


	// FUNCTIONS TO CONVERT BYTES32 TO STRING AND BACK AGAIN///////
	function stringToBytes32(string memory source) public returns (bytes32 result) {
	    bytes memory tempEmptyStringTest = bytes(source);
	    if (tempEmptyStringTest.length == 0) {
	        return 0x0;
	    }

	    assembly {
	        result := mload(add(source, 32))
	    }
	}
 
  // take bytes32 and return a string
	function bytes32ToString(bytes32 _data) pure public returns (string) {
	  // create new bytes with a length of 32
	  // needs to be bytes type rather than bytes32 in order to be writeable
	  bytes memory _bytesContainer = new bytes(32);
	  // uint to keep track of actual character length of string
	  // bytes32 is always 32 characters long the string may be shorter
	  uint256 _charCount = 0;
	  // loop through every element in bytes32
	  for (uint256 _bytesCounter = 0; _bytesCounter < 32; _bytesCounter++) {
	    
	    // TLDR: takes a single character from bytes based on counter
	    // convert bytes32 data to uint in order to increase the number enough to
	    // shift bytes further left while pushing out leftmost bytes
	    // then convert uint256 data back to bytes32
	    // then convert to bytes1 where everything but the leftmost hex value (byte)
	    // is cutoff leaving only the leftmost byte
	    
	    bytes1 _char = bytes1(bytes32(uint256(_data) * 2 ** (8 * _bytesCounter)));
	    // if the character is not empty
	    if (_char != 0) {
	      // add to bytes representing string
	      _bytesContainer[_charCount] = _char;
	      // increment count so we know length later
	      _charCount++;
	    }
	  }

	  // create dynamically sized bytes array to use for trimming
	  bytes memory _bytesContainerTrimmed = new bytes(_charCount);

	  // loop through for character length of string
	  for (uint256 _charCounter = 0; _charCounter < _charCount; _charCounter++) {
	    // add each character to trimmed bytes container, leaving out extra
	    _bytesContainerTrimmed[_charCounter] = _bytesContainer[_charCounter];
	  }

	  // return correct length string with no padding
	  return string(_bytesContainerTrimmed);
	}
}


