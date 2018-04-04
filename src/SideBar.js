// @flow
import React, { Component } from 'react'
import { Link, withRouter } from "react-router-dom";
import { Button, Sidebar, Menu, Icon, Segment, Header, Image } from 'semantic-ui-react'
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 100%;
  min-height: 100vh;
  width: 100%;  
  
`;

class SideBar extends Component {
  render() {
    const { pathname } = this.props.location;
    return (
      <div>
        <Sidebar.Pushable>
          <Sidebar as={Menu} animation='push' width='thin' visible icon='labeled' vertical inverted>
            <Menu.Item name='home' active={pathname == '/student/profile'} as={Link} to='/student/profile'>
              <Icon name='home' />
              Profile
            </Menu.Item>
            <Menu.Item name='home' active={pathname == '/student/wallet'} as={Link} to='/student/wallet'>
              <Icon name='credit card' />
              Wallet
            </Menu.Item>

            <Menu.Item name='exchange' active={pathname == '/student/transactions'} as={Link} to='/student/transactions'> 
              <Icon name='exchange'/>
              Transactions
            </Menu.Item>

             <Menu.Item name='help'>
              <Icon name='help' />
              Help
            </Menu.Item>

          </Sidebar>
          <Sidebar.Pusher>
            <Wrapper>
              {this.props.children}
            </Wrapper>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

export default withRouter(SideBar);