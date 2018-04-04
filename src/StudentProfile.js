// @flow
import React, { Component } from 'react'
import { Header, Container, Button, Image, Checkbox, Form } from 'semantic-ui-react'
import styled from 'styled-components';

const StyledProfile = styled.div`
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
  }

`;

class StudentProfile extends Component {
  state = {
    name: null, 
    country: null, 
    uni: null,
    photourl: null
  }

  getName = async (idx) => this.props.AccountsInstance.getStudentNameIdx(idx)
  getUni = async (idx) => this.props.AccountsInstance.getStudentUniIdx(idx)
  getCountry = async (idx) => this.props.AccountsInstance.getStudentCountryIdx(idx)
  getAcc = async (idx) => this.props.AccountsInstance.getStudentAccIdx(idx)
  getPhotoURL = async (idx) => this.props.AccountsInstance.getStudentPhotoURL(idx)

  async componentWillReceiveProps(nextProps) {
    if (nextProps.AccountsInstance) {
      const idx = await nextProps.AccountsInstance.getStudentIdxByAddress();
      const [ name, uni, country, photourl, acc ] = await Promise.all([ this.getName(idx), this.getUni(idx), this.getCountry(idx), this.getPhotoURL(idx), this.getAcc(idx) ]);
      this.setState({ name, uni, country, photourl })
    }
  }

  async componentWillMount() {
    if(this.state.name === null) {
      this.componentWillReceiveProps(this.props)
    }
  }

  render() {
    const { name, uni, country, photourl } = this.state;
    return (
      <StyledProfile>
        <Container text>
          <Header as='h1'>Profile</Header>
          <Header as='h3'>Name: {name}</Header>
          <Image alt="Profile Pic" src={photourl} size='medium' />
          <p>University: {uni}</p>
          <p>Country: {country}</p>
        </Container>
      </StyledProfile>
    )
  }
}

export default StudentProfile;