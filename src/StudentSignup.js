// @flow
import React, { Component } from 'react'
import { Button, Checkbox, Header,Container, Form } from 'semantic-ui-react'
import styled from 'styled-components'

const StyledStudentForm = styled.div`
  background: rgb(237, 248, 252);
  background-size: cover;
  height: 100%;
  min-height: 100vh;
  width: 100%;

  div.ui.text.container {
    padding-top: 10%;
  }

  @media only screen and (min-width: 768px) {
    h1.ui.header {
      font-size: 4rem;
      font-weight:400;
    }
  }
`;

class StudentForm extends Component {
  state = {
    name: null,
    country: null,
    uni: null,
    photourl: null
  }

  handleSubmit = async () => {
    const { accounts, history } = this.props;
  
    try {  
      history.push('/student/wallet')
    } catch (e) {
      console.log(e)
    }
  }

  render() {
    return (
    <StyledStudentForm>
      <Container text>
        <Header as='h1'>Create a Student Account</Header>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Full Name</label>
            <input placeholder='First Name' onChange={(e) => this.setState({name: e.target.value})} />
          </Form.Field>

          <Form.Field>
            <label>Country</label>
            <input placeholder='Country' onChange={(e) => this.setState({country: e.target.value})}/>
          </Form.Field>

          <Form.Field>
            <label>University</label>
            <input placeholder='University' onChange={(e) => this.setState({uni: e.target.value})}/>
          </Form.Field>

          <Form.Field>
            <label>Profile Photo URL</label>
            <input placeholder='Profile Photo URL' onChange={(e) => this.setState({photourl: e.target.value})}/>
          </Form.Field>

          <Form.Field>
            <Checkbox label='I agree to the Terms and Conditions' />
          </Form.Field>
          <Button color='green' size='huge' type='submit'>Sign Up</Button>
        </Form>
      </Container>

    </StyledStudentForm>

    )
  }
}

export default StudentForm