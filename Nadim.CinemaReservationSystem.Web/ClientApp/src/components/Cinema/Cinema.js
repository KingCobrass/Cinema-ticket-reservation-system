import React, {Component} from 'react';
import { Button, DropdownButton, MenuItem } from 'react-bootstrap';
import '../../styles/EditCinemaInfo.css';
import '../../styles/Cinema.css';
import FormCinema from './FormCinema';

export default class Cinema extends Component{
    displayName = Cinema.displayName;

    constructor(props){
        super(props);
        this.state={
            show: false,
            infoMessage:'',
            chosenOperation: '',
            cinemaList: [],
            chosenCinema: undefined,
            chosenCinemaInfo: undefined
        };
        this.informWithMessage = this.informWithMessage.bind(this);
        this.createCinema = this.createCinema.bind(this);
        this.cancelFormCinema = this.cancelFormCinema.bind(this);
        this.editCinemaInfo = this.editCinemaInfo.bind(this);
        this.renderContent = this.renderContent.bind(this);
        this.handleChooseCreateCinemaAction = this.handleChooseCreateCinemaAction.bind(this);
        this.handleChooseEditCinemaAction = this.handleChooseEditCinemaAction.bind(this);
        this.renderActionsContent = this.renderActionsContent.bind(this);
        this.renderChooseCinemaContent = this.renderChooseCinemaContent.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

        this.getCinemaList();
    }

    cancelFormCinema(){
        this.setState({
            chosenOperation: ''
        });
    }
    
    informWithMessage(message){
        this.setState({
            show: true,
            infoMessage: message,
        });
        const self = this;
        setTimeout(() => 
            self.setState({
                show: false,
                infoMessage:''
            }),5000);
    }

    getCinemaList(){
        fetch('api/cinemas', {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }).then(response => {
            if (response.ok){
                return response.json();
            }
            if (response.status === 400){
                return response.json().then((err) => {
                    throw new Error(`Bad request. ${err.details}`);
                });
            }
            if (response.status === 401){
                throw new Error('You need to authorize to do that action.');
            }
            if (response.status === 404){
                    throw new Error('Cant find resourse.');
            }
        }).then(parsedJson => {
                this.setState({
                    cinemaList: parsedJson.cinemaList,
                });
            })
            .catch(error => this.informWithMessage(error.message));
    }

    getCinema(id){
        fetch(`api/cinemas/${id}`, {
            method: 'GET',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            }
        }).then(response => {
            if (response.ok){
                return response.json();
            }
            if (response.status === 400){
                return response.json().then((err) => {
                    throw new Error(`Bad request. ${err.details}`);
                });
            }
            if (response.status === 401){
                throw new Error('You need to authorize to do that action.');
            }
            if (response.status === 404){
                    throw new Error('Cant find resourse.');
            }
        }).then(parsedJson => {
                let tempParsedJson = parsedJson.cinema;
                tempParsedJson.info.cinemaId = id;
                this.setState({
                    chosenCinemaInfo: tempParsedJson,
                    chosenOperation: 'editCinema'
                })
            })
            .catch(error => {
                this.setState({
                    chosenOperation:''
                })
                this.informWithMessage(error.message);
            });
    }

    createCinema(receivedCinemaInfo){
        this.setState({
            chosenOperation: 'editCinemaLoading'
        });
        fetch('api/cinemas', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            },
            body: JSON.stringify(receivedCinemaInfo)
        }).then(response => {
                if (response.ok){
                    return response;
                }
                if (response.status === 400){
                    return response.json().then((err) => {
                        throw new Error(`Bad request. ${err.details}`);
                    });
                }
                if (response.status === 401){
                    throw new Error('You need to authorize to do that action. ');
                }
                if (response.status === 404){
                        throw new Error('Cant find resourse. ');
                }
            }).then(response => {
                    let tempCinemaInfo = {};
                    tempCinemaInfo.info = receivedCinemaInfo;
                    tempCinemaInfo.info.cinemaId = response.headers.get('location').substring(response.headers.get('location').lastIndexOf('/') + 1, response.headers.get('location').length);
                    this.setState({
                        chosenCinemaInfo: tempCinemaInfo,
                        chosenOperation: 'editCinema'
                    })
                })
                .catch(error => this.informWithMessage(error.message));
    }

    editCinemaInfo(receivedCinemaInfo){
        fetch(`api/cinemas/${receivedCinemaInfo.cinemaId}`, {
            method: 'PUT',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            },
            body: JSON.stringify(receivedCinemaInfo.cinemaInfoToSend)
        }).then(response => {
                if (response.ok){
                    return response.json();
                }
                if (response.status === 400){
                    return response.json().then((err) => {
                        throw new Error(`Bad request. ${err.details}`);
                    });
                }
                if (response.status === 401){
                    throw new Error('You need to authorize to do that action.');
                }
                if (response.status === 404){
                        throw new Error('Cant find resourse. ');
                }
            }).then(parsedJson => {
                this.informWithMessage('Cinema information edited.');
            })
            .catch(error => this.informWithMessage(error.message));
            this.setState({
                chosenOperation: ''
            });
    }

    handleChooseCreateCinemaAction(){
        this.setState({
            chosenOperation: 'createCinema',
            chosenCinema: undefined,
            chosenCinemaInfo: undefined,
        });
    }

    handleChooseEditCinemaAction(){
        this.setState({
            chosenOperation: 'editCinemaLoading'
        });
        this.getCinema(this.state.chosenCinema.cinemaId);
    }

    handleSelect(eventKey){
        this.setState({
            chosenCinema: this.state.cinemaList[eventKey]
        });
    }
    
    renderChooseCinemaContent(){
        return(
            <fieldset>
                <legend>
                    Choose cinema
                </legend>
                <div className="font-large">
                {
                    this.state.chosenCinema ? 
                        `Chosen cinema : ${this.state.chosenCinema.name}, ${this.state.chosenCinema.city}` :
                        ''
                }
                </div>
                <DropdownButton
                    bsStyle="default"
                    title="Choose cinema"
                    id="choose-cinema-to-edit"
                >
                {
                    
                    this.state.cinemaList.map((el, i)=>
                        <MenuItem 
                            eventKey={i}
                            onSelect={this.handleSelect}
                            key={i}
                        >
                            {el.name}, {el.city}
                        </MenuItem>
                    )
                }
                </DropdownButton>
            </fieldset>
        );
    }

    renderActionsContent(){
        return(
            <fieldset>
                <fieldset>
                    <Button
                        bsStyle="primary"
                        onClick={this.handleChooseCreateCinemaAction}
                    >
                        Create cinema
                    </Button>
                </fieldset>
                {this.renderChooseCinemaContent()}
                <Button
                    bsStyle="primary"
                    onClick={this.handleChooseEditCinemaAction}
                    disabled={!this.state.chosenCinema}
                >
                    Edit cinema info
                </Button>
            </fieldset>
        );
    }

    renderContent(){
        switch(this.state.chosenOperation){
            case 'createCinema':
                return (         
                    <FormCinema
                        token={this.props.token}
                        cinema={this.state.chosenCinemaInfo}
                        callBackReceiveCinemaInfo={this.createCinema}
                        callBackCancel={this.cancelFormCinema}
                        callBackInformWithMessage={this.informWithMessage}
                    />
                );
            case 'editCinemaLoading':
                return (
                    <div className="font-x-large font-italic">
                        Loading...
                    </div>
                );
            case 'editCinema':
                if (this.state.chosenCinemaInfo){
                    return(         
                        <FormCinema
                            token={this.props.token}
                            cinema={this.state.chosenCinemaInfo}
                            callBackEditCinemaInfo={this.editCinemaInfo}
                            callBackCancel={this.cancelFormCinema}
                            callBackInformWithMessage={this.informWithMessage}
                        />
                    )
                }
                this.setState({chosenOperation: ''});
                break;
            default: 
                return this.renderActionsContent();
        }
    }

    render(){
        const content = this.renderContent();
        return(
            <div className="add-cinema-container">
                <div className="font-x-large">
                    {this.state.show ? 
                        this.state.infoMessage :
                        ''
                    }
                </div>
                <div className="well">
                    {content}
                </div>
            </div>
        );
    }
}
