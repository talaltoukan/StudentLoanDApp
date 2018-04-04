
// @flow
import React, { Component } from 'react'
import { Header, Image, Modal, Container, Input, Select, Button, Checkbox, Statistic, Form, Progress, Segment } from 'semantic-ui-react'
import styled from 'styled-components';
import BigNumber from "bignumber.js";

const StyledWallet = styled.div`
  background: rgb(237, 248, 252);
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  width:calc(100% - 150px);;
  div.ui.text.container {
    padding-top: 2%;
  }
  @media only screen and (min-width: 768px) {
    h1.ui.header {
      font-size: 2rem;
      font-weight:400;
    }
    p.ui{
    	font-size:2rem;
    	font-weight:300;
    	color:green;
    }
  }
`;

const installmentTypes = [
  { text: 'Hourly', value: 'hours' },
  { text: 'Daily', value: 'days' },
  { text: 'Weekly', value: 'weekly'},
  { text: 'Monthly', value: 'monthly'},
  { text: 'Yearly', value: 'yearly'},
]

class StudentWallet extends Component {

  constructor(props){
    super(props)
    this.handlePrincipalAmountChange = this.handlePrincipalAmountChange.bind(this);
    this.handleInterestRateChange = this.handleInterestRateChange.bind(this);
    this.handleInstallmentsTypeChange = this.handleInstallmentsTypeChange.bind(this);
    this.handleTermLengthChange = this.handleTermLengthChange.bind(this);

    this.onGenerateDebtOrder = this.onGenerateDebtOrder.bind(this);
    /*this.onSignDebtOrder = this.onSignDebtOrder.bind(this);
    this.onFillDebtOrder = this.onFillDebtOrder.bind(this);*/

    this.state = {
      storageValue: 0,
      web3: null,
      dharma: null,
      debtOrder: null,
      debtOrderSigned: false,
      principalTokenSymbol: "REP",
      amortizationUnit: "hours",
      fundraisingStatus: null,
      modalOpen: false,
      status: 'newUser',
      withdrawAmount: 0
    }
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.AccountsInstance) {
      const result = await nextProps.AccountsInstance.getStudentIdxByAddress();
      const idx = result.c[0]
      console.log('idx', idx)
      const [ minReq, raised, numFunders, fundraisingStatus ] = await Promise.all([ this.getMinReq(idx), this.getRaised(idx), this.getNumFunders(idx), this.getFundraisingStatus(idx) ]);
      this.setState({ minReq: (minReq.c[0]/10000), raised: (raised.c[0] / 10000), numFunders: numFunders.c[0], fundraisingStatus })
      console.log({ minReq: (minReq.c[0]/10000), raised: (raised.c[0] / 10000), numFunders: numFunders.c[0], fundraisingStatus })

      let status;
      if(minReq == 0 && raised == 0 && fundraisingStatus == false) {
        status = "newUser"
      } else {
        if(raised >= minReq) {
          status = "complete"
          console.log("complere!!!!")
        } else {
          status = "inProgress"
        }  
      }
      console.log(status)
      this.setState({status})
    }
  }

  async componentWillMount() {
    if(this.state.fundraisingStatus === null) {
      this.componentWillReceiveProps(this.props)
    }
  }

  handlePrincipalAmountChange(e) {
      this.setState({
          principalAmount: e.target.value
      });
  }

  handleInterestRateChange(e) {
      this.setState({
          interestRate: e.target.value
      });
  }

  handleInstallmentsTypeChange(e) {
      this.setState({
          amortizationUnit: e.target.value
      });
  }

  handleTermLengthChange(e) {
      this.setState({
          termLength: e.target.value
      });
  }

  async onGenerateDebtOrder(e) {
    const { principalAmount, principalTokenSymbol, interestRate, amortizationUnit, termLength } = this.state;
    
    const dharma = this.state.dharma;
    
    const tokenRegistry = await dharma.contracts.loadTokenRegistry();
    const principalToken = await tokenRegistry.getTokenAddress.callAsync(principalTokenSymbol);
    
    const simpleInterestLoan = {
        principalToken,
        principalAmount: new BigNumber(principalAmount),
        interestRate: new BigNumber(interestRate),
        amortizationUnit,
        termLength: new BigNumber(termLength)
    };
    
    const debtOrder = await dharma.adapters.simpleInterestLoan.toDebtOrder(simpleInterestLoan);
    
    this.setState({ debtOrder: JSON.stringify(debtOrder) });
  }

  withdraw = async () => {
    const { AccountsInstance, accounts, history, web3 } = this.props;
    
    try {
      const amountWei = web3.toWei(this.state.withdrawAmount, 'ether')
      const result = await AccountsInstance.withdraw(amountWei, {from: accounts[0], gas: 6385876 });  
      console.log(result)
      // this.setState({modalOpen: false})
      this.componentWillReceiveProps(this.props)
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const percent = (this.state.raised + 0.000000001)/(this.state.minReq + 0.000000001)*100

    return (
    	<StyledWallet>
        <Container text>
          <Header as='h1'>Request a Loan</Header>
          <p>{this.state.status == "inProgress" ? "Funding is in progress" : ""}{this.state.status == "Funding is complete" ? "complete" : ""}
          {this.state.status == "newUser" ? "Welcome new user, click the button to start raising funds" : ""}</p>
          { this.state.status != "inProgress" ? <div>
            <Form>
              <Form.Field>
                <label>Principal Amount (USD)</label>
                <input type="number" placeholder="1000" 
                    onChange={this.handlePrincipalAmountChange} />
              </Form.Field>
              <Form.Field>
                <label>Interest Rate (%)</label>
                <input type="number" step="0.001" placeholder="8.12" 
                    onChange={this.handleInterestRateChange} />
              </Form.Field>
              <Form.Field control={Select} label="Installments Type" options={installmentTypes} placeholder='Hourly' onChange={this.handleInstallmentsTypeChange}/>
              <Form.Field>
                <label>Term Length</label>
                <input type="number" placeholder="3" 
                    onChange={this.handleTermLengthChange} />
              </Form.Field>
              <Button
                bsStyle="primary"
                onClick={this.onGenerateDebtOrder}
              >
                Generate Debt Order
              </Button>
            </Form>
            </div> : ""}

          { this.state.status == "complete" ? 
            <div style={{marginTop: 40}}>
              <Header as='h2'>Withdraw</Header>
              <Form onSubmit={this.withdraw}>
                 <Form.Field inline>
                   <label>Amount</label>
                   <Input placeholder='100' type='number' onChange={(e) => this.setState({withdrawAmount: e.target.value})} />
                 </Form.Field>
                 <Form.Field inline>
                   <label>What for?</label>
                   <Input placeholder='Food' />
                 </Form.Field>
                 <Button color='green'>Submit</Button>
               </Form>
              </div>
          : ""}
        </Container>
      </StyledWallet>
    )
  }
}

export default StudentWallet;