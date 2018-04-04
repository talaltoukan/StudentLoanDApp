// @flow
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { connect } from 'react-redux';
import AccountsContract from '../build/contracts/Accounts.json'
import getWeb3 from './utils/getWeb3'
import promisify from "tiny-promisify"
import Dharma from "@dharmaprotocol/dharma.js";

import DebtKernel from '../build/contracts/DebtKernel.json'
import DebtRegistry from '../build/contracts/DebtRegistry.json'
import RepaymentRouter from '../build/contracts/RepaymentRouter.json'
import TokenTransferProxy from '../build/contracts/TokenTransferProxy.json'
import TokenRegistry from '../build/contracts/TokenRegistry.json'
import DebtToken from '../build/contracts/DebtToken.json'
import TermsContractRegistry from "../build/contracts/TermsContractRegistry.json"

import Landing from './Landing'
//import StudentLogin from './StudentLogin'
import StudentSignup from './StudentSignup'
import FunderSignup from './FunderSignup'
import SideBar from './SideBar'
import StudentWallet from './StudentWallet'
import StudentProfile from './StudentProfile'
import StudentTransactions from './StudentTransactions'
import FunderHome from './FunderHome'

class App extends Component {
  state = {
    web3: null,
    AccountsInstance: null,
    accounts: null
  }

  async componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateDharma()
    })
    .catch((e) => {
      console.log('Error instantiating Dharma contracts:' + e);
    })
  }

  /*
  async componentWillMount() {
    try {
      const results = await getWeb3;
      this.setState({ web3: results.web3 })

      // configure and include the smart contract
      const contract = require('truffle-contract')
      const Accounts = contract(AccountsContract)
      
      Accounts.setProvider(this.state.web3.currentProvider)
    
      // Get accounts.
      this.state.web3.eth.getAccounts(async (error, accounts) => {
        const instance = await Accounts.deployed();
        this.setState({ accounts: accounts, AccountsInstance: instance });
      })
    } catch (e) {
      console.log('Error finding web3.')
    }
  }
  */

  async instantiateDharma() {
    const networkId = await promisify(this.state.web3.version.getNetwork)();
    const accounts = await promisify(this.state.web3.eth.getAccounts)();

    if (!(networkId in DebtRegistry.networks &&
          networkId in DebtKernel.networks &&
          networkId in RepaymentRouter.networks &&
          networkId in TokenTransferProxy.networks &&
          networkId in TokenRegistry.networks &&
          networkId in DebtToken.networks &&
          networkId in TermsContractRegistry.networks)) {
        throw new Error("Cannot find Dharma smart contracts on current Ethereum network.");
    }

    const dharmaConfig = {
        debtRegistryAddress: DebtRegistry.networks[networkId].address,
        kernelAddress: DebtKernel.networks[networkId].address,
        repaymentRouterAddress: RepaymentRouter.networks[networkId].address,
        tokenTransferProxyAddress: TokenTransferProxy.networks[networkId].address,
        tokenRegistryAddress: TokenRegistry.networks[networkId].address,
        debtTokenAddress: DebtToken.networks[networkId].address,
        termsContractRegistry: TermsContractRegistry.networks[networkId].address
    }

    const dharma = new Dharma(this.state.web3.currentProvider, dharmaConfig);

    this.setState({ dharma, accounts });
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" render={(props) => ( <Landing {...props} {...this.state} /> )} />
          {/*<Route exact path="/student/login" render={(props) => ( <StudentLogin {...props} {...this.state} /> )} />*/}
          <Route exact path="/student/signup" render={(props) => ( <StudentSignup {...props} {...this.state} /> )} />
          <Route exact path="/student/wallet" render={(props) => ( <SideBar><StudentWallet {...props} {...this.state} /></SideBar> )} />
          <Route exact path="/student/profile" render={(props) => ( <SideBar><StudentProfile {...props} {...this.state} /></SideBar> )} />
          {/*<Route exact path="/student/myfunders" component={StudentMyFunders} />*/}
          <Route exact path="/student/transactions" render={(props) => ( <SideBar><StudentTransactions {...props} {...this.state} /></SideBar> )} />

          <Route exact path="/funder/signup" render={(props) => ( <FunderSignup {...props} {...this.state} /> )} />
          <Route exact path="/funder/home" render={(props) => ( <FunderHome {...props} {...this.state} /> )} />
          {/*<Route exact path="/test" component={Test} />*/}
        </div>
      </Router>
    )
  }
}

export default App;
