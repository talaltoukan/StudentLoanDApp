import React, { Component } from 'react'
import { Header,Container,Table } from 'semantic-ui-react'
import styled from 'styled-components';

const StyledTransactions = styled.div`
  background: rgb(237, 248, 252);
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  width:calc(100% - 150px);

  div.ui.text.container {
    padding-top: 2%;
  }

  @media only screen and (min-width: 768px) {
    h1.ui.header {
      font-size: 2rem;
      font-weight:400;
      margin-top:0;
    }
  }
`;

class StudentTransactions extends Component {
  state = {
    txs: null
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.web3) {
      const eth = nextProps.web3.eth;
      var n = eth.blocknumber;

      var txs = [];
      for(var i = 0; i < n; i++) {
          var block = eth.getBlock(i, true);
          for(var j = 0; j < block.transactions; j++) {
              if( block.transactions[j].to == "0x7A33615d12A12f58b25c653dc5E44188D44f6898" || block.transactions[j].from == "0x7A33615d12A12f58b25c653dc5E44188D44f6898" )
                  txs.push(block.transactions[j]);
          }
      }
      console.log(txs)
    }
  }

  async componentWillMount() {
    if(this.state.txs === null) {
      this.componentWillReceiveProps(this.props)
    }
  }
  render() {
    return(
    <StyledTransactions>
      <Container text>
        <Header as='h1'>Transaction History</Header>

        <Table celled>
	        <Table.Header>
		        <Table.Row>
		        <Table.HeaderCell color='green'>Time</Table.HeaderCell>
		        <Table.HeaderCell >From</Table.HeaderCell>
		        <Table.HeaderCell>To</Table.HeaderCell>
		        <Table.HeaderCell>Amount</Table.HeaderCell>
		      </Table.Row>
            </Table.Header>

            <Table.Body>
 			    <Table.Row>
		        <Table.HeaderCell textAlign='center'>03/11/2018</Table.HeaderCell>
		        <Table.HeaderCell textAlign='center'>Japan</Table.HeaderCell>
		        <Table.HeaderCell textAlign='center'>Canada</Table.HeaderCell>
		        <Table.HeaderCell textAlign='center'>300</Table.HeaderCell>
		        </Table.Row>
            </Table.Body>
        </Table>
      </Container>
    </StyledTransactions>
    )
  }
}

export default StudentTransactions