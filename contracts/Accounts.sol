pragma solidity ^0.4.19;
pragma experimental ABIEncoderV2;


contract Accounts {
	uint numLenders = 0;
	uint numStudents = 0;
	mapping(address => mapping (address => uint)) public pledges;

	struct Student {
		string name;
		string university;
		string country;
		string photourl;
		address studentAccount;
		uint minimumToRaise;
		uint totalRaised;
		uint idx;
		uint numFunders;
		bool fundraising;
	}
	
	struct Lender {
		string name;
		address acc;
		uint totalDonated;
		uint balance;
		uint idx;
	}

	mapping (address => Student) public studentMap;
	Student[] public slist;
	
	mapping (address => Lender) public lenderMap;
	Lender[] public llist;

	function incrementStudent(string name) public returns(string) {
		numStudents = numStudents + 1;
		return name;
	}

	function addStudent(string sName, string uni, string country, string photo)
		public {
		var sNew = Student({
			name: sName,
			university: uni,
			studentAccount: msg.sender,
			photourl: photo,
			country: country,
			minimumToRaise: 0,
			totalRaised: 0,
			numFunders: 0,
			idx: numStudents,
			fundraising: false
		});

		studentMap[msg.sender] = sNew;
		slist.push(sNew);

		numStudents += 1;

	}

	function startFundraising(uint fundGoal) public{
		address curStudent = msg.sender;
		uint stIdx = studentMap[curStudent].idx;
		studentMap[curStudent].fundraising = true;
		studentMap[curStudent].minimumToRaise = fundGoal;
		slist[stIdx] = studentMap[curStudent];
	}
	
	function addLender(string lName)
		public returns (Lender){
		var lNew = Lender({
			name: lName,
			acc: msg.sender,
			balance: msg.sender.balance,
			totalDonated: 0,
			idx: numLenders
		});

		lenderMap[msg.sender] = lNew;
		llist.push(lNew);

		numLenders += 1;

		return lNew;

	}

	function fund(uint sIdx) public payable {
		address stdntAcct = slist[sIdx].studentAccount;
		uint amount = msg.value;
		require(lenderMap[msg.sender].balance >= amount);
		require(studentMap[stdntAcct].fundraising);
		uint lIdx = lenderMap[msg.sender].idx;
		pledges[msg.sender][stdntAcct] += amount;
		studentMap[stdntAcct].numFunders += 1;
		studentMap[stdntAcct].totalRaised += amount;
		lenderMap[msg.sender].balance -= amount;
		lenderMap[msg.sender].totalDonated += amount;

		llist[lIdx] = lenderMap[msg.sender];
		slist[sIdx] = studentMap[stdntAcct];

		checkGoalReached(stdntAcct);
	}
	
	function checkGoalReached(address stdntAcct) public {
		if(studentMap[stdntAcct].totalRaised >= studentMap[stdntAcct].minimumToRaise){
			studentMap[stdntAcct].fundraising = false;
			uint curIdx = studentMap[stdntAcct].idx;
			slist[curIdx] = studentMap[stdntAcct];
		}
	}

	//Method for students to make purchases using money in escrow.
	function withdraw(uint amtNeeded) public {
		address beneficiary = msg.sender;
		require(!studentMap[beneficiary].fundraising);
		require(studentMap[beneficiary].totalRaised >= amtNeeded);
		uint stIdx = studentMap[beneficiary].idx;
		studentMap[beneficiary].totalRaised -= amtNeeded;
		slist[stIdx] = studentMap[beneficiary];

		beneficiary.transfer(amtNeeded);
	}
	

	
	//function listStudents() public returns(Student[]) { return slist; }

	/* hideos but :) */

	function getStudentNameIdx(uint idx) public view returns(string) { return slist[idx].name; }
	function getStudentUniIdx(uint idx) public view returns(string) { return slist[idx].university; }
	function getStudentCountryIdx(uint idx) public view returns(string) { return slist[idx].country; }
	function getStudentPhotoURL(uint idx) public view returns(string) { return slist[idx].photourl; }
	function getStudentAccIdx(uint idx) public view returns(address) { return slist[idx].studentAccount; }
	function getStudentMinReqIdx(uint idx) public view returns(uint) { return slist[idx].minimumToRaise; }
	function getStudentRaisedIdx(uint idx) public view returns(uint) { return slist[idx].totalRaised; }
	function getStudentFundraisingIdx(uint idx) public view returns(bool) { return slist[idx].fundraising; }
	function getNumStudentFundersIdx(uint idx) public view returns(uint) { return slist[idx].numFunders; }
	//function listStudents() public returns(Student[]) { return slist; }

	function getStudentNameByAddress() public view returns(string) {return studentMap[msg.sender].name; }
	function getStudentIdxByAddress() public view returns(uint) {return studentMap[msg.sender].idx; }
	
	function getLenderNameByAddress() public view returns(string) { return lenderMap[msg.sender].name; }
	function getLenderIdxByAddress() public view returns(uint) { return lenderMap[msg.sender].idx; }

	function getStudentCount() public view returns(uint) { return numStudents; }
	function gitLenderCount() public view returns(uint) { return numLenders; }
	function getLenderBalanceIdx(uint lidx) public view returns(uint) {return llist[lidx].balance;}

	function getContractBalance() public view returns(uint) {return this.balance;}
	
}
