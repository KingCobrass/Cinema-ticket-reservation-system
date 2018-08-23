import React, { Component } from 'react';
import Authentication from './Authentication/Authentication';
import '../styles/Header.css'

export default class Header extends Component{
    displayName = Header.displayName;

    constructor(props){
        super(props);
        this.state={};
    }

    setUserInfo = (userInfo) =>{
        this.props.callBackSetUserInfo(userInfo);
    }

    render(){
        return(
            <div className="header">
                <Authentication
                    username={this.props.username}
                    role={this.props.role}
                    callBackSetUserInfo={this.setUserInfo}
                    callBackSetShownRole={this.props.callBackSetShownRole}
                />
            </div>
        )
    }
}