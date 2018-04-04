// @flow
import React, { Component } from 'react'
import { Link } from "react-router-dom";
import { Input, Button, Card, Image, Container, Header, Segment, Modal, Icon, Form, Checkbox } from 'semantic-ui-react'
import styled from 'styled-components';
import Grad from './images/grad.svg'

const StyledFunder = styled.div`
   background: rgb(237, 248, 252);
   background-size: cover;
   height: 100%;
   min-height: 100vh;
   width:100%;

   div.ui.container {
    padding-top: 2%;
   }

   @media only screen and (min-width: 768px) {
    h1.ui.header {
      font-size: 2rem;
      font-weight:400;
    }
  }

`;

const StyledCardGroup = styled(Card.Group)`
  & {
    margin-top:20px;
  }
`;

const promiseWhile = (data, condition, action) => {  
  var whilst = (data) => {
    return condition(data) ?
      action(data).then(whilst) :
      Promise.resolve(data);
  }
  return whilst(data);
};

class FunderHome extends Component {

  state = {
    name: null,
    students: [],
    uniFilter: null,
    modalOpen: false,
    selectedStudentIdx: null,
    amount: 0
  }

  getName = async (idx, params) => this.props.AccountsInstance.getLenderNameByAddress(idx, params)
  getStudentsCount = async () => this.props.AccountsInstance.getStudentCount()
  getStudentName = async (idx) => this.props.AccountsInstance.getStudentNameIdx(idx)
  getStudentUni = async (idx) => this.props.AccountsInstance.getStudentUniIdx(idx)
  getStudentCountry = async (idx) => this.props.AccountsInstance.getStudentCountryIdx(idx)
  getStudentAcc = async (idx) => this.props.AccountsInstance.getStudentAccIdx(idx)
  
  async componentWillReceiveProps(nextProps) {
    if (nextProps.AccountsInstance) {
      const result = await nextProps.AccountsInstance.getLenderIdxByAddress();
      const idx = result.c[0];
      const [ name ] = await Promise.all([ this.getName(idx, {from: nextProps.accounts[0] }) ]);
      const students = await this.getAllStudents(nextProps);
      this.setState({ name })
    }
  }

  async componentWillMount() {
    if(this.state.name === null) {
      this.componentWillReceiveProps(this.props)
    }
  }

  getAllStudents = async (nextProps) => {
    const result = await nextProps.AccountsInstance.getStudentCount();
    const count = result.c[0]
    const students = []

    const getStudent = async (idx) => {
      return new Promise(async (resolve, reject) => {
        const [ name, country, uni ] = await Promise.all([ 
          this.getStudentName(idx, {from: nextProps.accounts[0] }), 
          this.getStudentUni(idx, {from: nextProps.accounts[0] }), 
          this.getStudentCountry(idx, {from: nextProps.accounts[0] })
        ]);
        const newStudent = { name, country, uni, idx }
        students.push(newStudent) 
        resolve(idx + 1);
      });
    }
    await promiseWhile(0, i => i < count, getStudent);
    this.setState({ students })
  }

  handleSubmit = async () => {
    const { web3, AccountsInstance, accounts, history } = this.props;
  
    try {
      const amountWei = web3.toWei(this.state.amount, 'ether')
      const result = await AccountsInstance.fund(this.state.selectedStudentIdx, {from: accounts[0], value: amountWei, gas:900000 });  
      console.log(result)
      this.setState({modalOpen: false})
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    const filteredStudents = this.state.students
      .filter(student => !this.state.uniFilter || student.uni.indexOf(this.state.uniFilter) != -1)
      .filter(student => !this.state.countryFilter || student.country.indexOf(this.state.countryFilter) != -1)
    
    return (
      <StyledFunder>
        <Container>
          <Header as ='h1'>Find Students</Header>

           <Segment.Group horizontal>
            <Segment>
              <p>Filter by University</p>
              <Input icon='search' placeholder='Search...' onChange={(e) => this.setState({uniFilter: e.target.value}) }/>
            </Segment>
            <Segment>
              <p>Filter by Country</p>
              <Input icon='search' placeholder='Search...' onChange={(e) => this.setState({countryFilter: e.target.value}) }/>
            </Segment>
          </Segment.Group>
            <StyledCardGroup>
            { filteredStudents.map(student => 
               <Card key={student.idx}>
                
                    <Card.Content>
                      <Image floated='right' size='mini' src='#' />
                      <Card.Header>
                        {student.name}
                      </Card.Header>
                    
                      <Card.Description>

                        <p>Going to {student.uni}</p>
                        <p>From {student.country}</p>

                       </Card.Description>

                    </Card.Content>
                    <Card.Content extra>
                        <Button basic color='green' data-idx={student.idx} onClick={(e) => { this.setState({modalOpen: true, selectedStudentIdx: e.target.dataset.idx }) } }>Fund This Student</Button>
                    </Card.Content>
                </Card>
              
            )}
            </StyledCardGroup>        
          </Container>
        <Modal open={this.state.modalOpen} size='small'>
          <Header content='Fund Bob' />
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <label>amount (ETH)</label>
                <input placeholder='10' onChange={(e) => this.setState({amount: e.target.value})} />
              </Form.Field>
              <Form.Field>
                <Checkbox label='I agree to the Terms and Conditions' />
              </Form.Field>
              <Button color='green' size='huge' type='submit'>Fund</Button>
            </Form>
          </Modal.Content>
        </Modal>  
      </StyledFunder>

    )
  }
}

export default FunderHome;