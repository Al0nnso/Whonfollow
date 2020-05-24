import React, {Component} from 'react';


import SideNav, { Toggle, Nav, NavItem, NavIcon, NavText } from '@trendmicro/react-sidenav';
//import './styles.css'
import '@trendmicro/react-sidenav/dist/react-sidenav.css';

export default class Home extends Component {

    render(){
        return(
            <SideNav
                onSelect={(selected) => {
                    // Add your code here
                }}
            >
                <SideNav.Toggle />
                <SideNav.Nav defaultSelected="home">
                    <NavItem eventKey="home">
                        <NavIcon>
                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Home
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="Hashtags">
                        <NavIcon>
                            <i className="fa fa-fw fa-home" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Hashtags
                        </NavText>
                    </NavItem>
                    <NavItem eventKey="config">
                        <NavIcon>
                            <i className="fa fa-fw fa-line-chart" style={{ fontSize: '1.75em' }} />
                        </NavIcon>
                        <NavText>
                            Configurações
                        </NavText>
                        <NavItem eventKey="config/profile">
                            <NavText>
                                Perfil
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="config/edit">
                            <NavText>
                                Editar
                            </NavText>
                        </NavItem>
                        <NavItem eventKey="config/about">
                            <NavText>
                                Sobre
                            </NavText>
                        </NavItem>
                    </NavItem>
                </SideNav.Nav>
            </SideNav>
        )
    }
}

