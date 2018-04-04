# StudentCoinHack
A student loan network on the ethereum blockchain

## Truffle

Update:

```npm uninstall -g truffle```

```npm install -g truffle```


## how to install

1. `git clone github.com/ericchenmelt/StudentCoinhack`

1. `cd StudentCoinhack`

1. `npm install -g truffle`

1. `npm install -g yarn`

1. `yarn install`

## how to build

3. Run the development console.
    ```javascript
    truffle develop
    ```

4. Compile and migrate the smart contracts. Note inside the development console we don't preface commands with `truffle`.
    ```javascript
    compile
    migrate
    deploy
    ```

## how to run 

1. `yarn start`

`go to localhost:3000`

## route ideas: 
```
/ => landing

/student/profile
/student/signup
/student/wallet
/student/myfunders
/student/transactions

/funder/signup
/funder/home
```

## how to not die:

```
truffle develop

> compile 
> migrate --reset 
> Accounts.deployed().then(function(instance){return instance.incrementStudent("hello world");}).then(console.log);
> Accounts.deployed().then(function(instance){return instance.getStudentCount();}).then(console.log);
```

## how to test deposit and withdrawal
Make sure account1 and account2 have sufficient funds in MetaMask. 

```
truffle compile

truffle migrate --reset

var accounts;

web3.eth.getAccounts(function(err,res) { accounts = res; });

var account1 = accounts[0]; // first account

var account2 = accounts[1]; // second account, if exists

var account3 = accounts[2];

console.log(account1);

Accounts.deployed().then(function(instance){return instance.addStudent("Martin Shrekli", "Columbia", "Phrma bro", "https://ei.marketwatch.com/Multimedia/2016/06/06/Photos/MG/MW-EO507_shkrel_20160606174055_MG.jpg?uuid=59565cec-2c2f-11e6-9347-0015c588dfa6", {from: account3});}).then(console.log);

Accounts.deployed().then(function(instance){return instance.addLender("Raphael", {from: account1});}).then(console.log);

Accounts.deployed().then(function(instance){return instance.addLender("Talal", {from: account2});}).then(console.log);

Accounts.deployed().then(function(instance){return instance.startFundraising(2000, {from: account3});}).then(console.log);

Accounts.deployed().then(function(instance){return instance.getLenderBalanceIdx(0, {from: account1});}).then(console.log);

Accounts.deployed().then(function(instance){return instance.getLenderBalanceIdx(1, {from: account2});}).then(console.log);

Accounts.deployed().then(function(instance){return instance.getStudentRaisedIdx(0, {from: account3});}).then(console.log);

Accounts.deployed().then(function(instance){return instance.fund(0, {from: account1, value: 1000, gas:900000});}).then(console.log);

Accounts.deployed().then(function(instance){return instance.fund(0, {from: account2, value: 1000, gas:900000});}).then(console.log);

Accounts.deployed().then(function(instance){return instance.getNumStudentFundersIdx(0);}).then(console.log);

Accounts.deployed().then(function(instance){return instance.getStudentRaisedIdx(0, {from: account2});}).then(console.log);

Accounts.deployed().then(function(instance){return instance.getContractBalance()}).then(console.log);

Accounts.deployed().then(function(instance){return instance.withdraw(250, {from: account3});}).then(console.log);

//Amount left in student's contract after withdrawl
Accounts.deployed().then(function(instance){return instance.getStudentRaisedIdx(0, {from: account2});}).then(console.log);

//Amount in student's bank account after withdrawl
web3.fromWei(web3.eth.getBalance(account3));

```


Accounts.deployed().then(function(instance){return instance.addStudent("Martin Shrekli", "Columbia", "Phrma bro", "https://ei.marketwatch.com/Multimedia/2016/06/06/Photos/MG/MW-EO507_shkrel_20160606174055_MG.jpg?uuid=59565cec-2c2f-11e6-9347-0015c588dfa6");}).then(console.log);

Accounts.deployed().then(function(instance){return instance.getStudentPhotoURL(0);}).then(console.log);


function getStudentPhotoURL(uint idx) public view returns(string) { return slist[idx].photourl; }


