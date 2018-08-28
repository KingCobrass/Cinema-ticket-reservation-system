import React, { Component } from 'react';
import ChooseSeats from './ChooseSeats';
import ConfirmReservation from './ConfirmReservation';
import moment from 'moment';

export default class ReserveTicket extends Component{
    displayName = ReserveTicket.displayName;

    constructor(props){
        super(props);
        this.state={
            seatsChosen: false,
            seats: this.props.session.seats,
            chosenSeats: [],
            lastTimeUpdated: new Date()
        }
    }

    createOrder = () =>{
        fetch('api/orders/', {
            method: 'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            },
            body: JSON.stringify({
                userId: this.props.userId,
                sessionId: this.props.session.info.sessionId,
                sessionSeats: this.state.chosenSeats.map(el => el.sessionSeatId)
            })
        })
        .then(response => {
            if (response.ok){
                return response;
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
                return response.json().then((err) => {
                    throw new Error(`Not found. ${err.details}`);
                });
            }
        })
        .then(response => {
            this.props.callBackInformWithMessage('You have successfully booked seats.')
        })
        .catch(error => {
            this.props.callBackInformWithMessage(
            { 
                text: error.message,
                isError: true
            });
        });
    }

    getUpdates = () =>{
        fetch(`api/sessions/${this.props.session.info.sessionId}/seats`,{
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`,
                'If-Modified-Since': this.state.lastTimeUpdated.toUTCString()
            }
        })
        .then(response =>{
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
                return response.json().then((err) => {
                    throw new Error(`Not found. ${err.details}`);
                });
            }
        })
        .then(parsedJson =>{
            const updatesNotChosenHere = parsedJson.requestedData.filter(el =>{
                return !this.state.chosenSeats.find(ch => ch.sessionSeatId === el.sessionSeatId);
            })
            let tempSeats = this.state.seats;

            updatesNotChosenHere.forEach(el => {
                tempSeats[el.row][el.column].booked = el.booked;
            })
            
            const updatesChosenHere = parsedJson.requestedData.filter(el =>{
                return this.state.chosenSeats.find(ch => ch.sessionSeatId === el.sessionSeatId);
            })

            let tempChosenSeats = this.state.chosenSeats;

            updatesChosenHere.forEach(el =>{
                if (el.booked === false){
                    tempSeats[el.row][el.column].chosen = false;
                    tempChosenSeats.splice(tempChosenSeats.findIndex(ch => ch.sessionSeatId === el.sessionSeatId), 1);
                    this.setState({
                        chosenSeats: tempChosenSeats
                    });
                }
            })

            this.setState({
                seats: tempSeats,
                lastTimeUpdated: new Date()
            })
        })
        .catch(error => {
            this.setState({
                chosenOperation: ''
            });
            this.props.callBackInformWithMessage({ 
                text: error.message,
                isError: true
            });
        });
    }

    handleSeatClickFetch = (seatInfo) =>{
        return fetch(`api/sessions/${this.props.session.info.sessionId}/seats/${seatInfo.sessionSeatId}`,{
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `bearer ${this.props.token}`
            },
            body: JSON.stringify({
                booked: seatInfo.booked,
                lastTimeUpdated: moment().format()
            })
        })
        .then(response =>{
            if (response.ok){
                return response;
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
                return response.json().then((err) => {
                    throw new Error(`Not found. ${err.details}`);
                });
            }
        })
        .then(response =>{
            if(seatInfo.booked){
                this.LockSessionSeat(seatInfo);   
            }
            else{
                this.UnlockSessionSeat(seatInfo)
            }
            return;
        })
        .catch(error => {
            this.setState({
                chosenOperation: ''
            });
            this.props.callBackInformWithMessage({ 
                text: error.message,
                isError: true
            });
        })        
    }

    LockSessionSeat = (seatInfo) =>{
        let tempSeats = this.state.seats;
        tempSeats[seatInfo.row][seatInfo.column].chosen = true;
        this.setState({
            seats: tempSeats,
            chosenSeats: this.state.chosenSeats.concat(tempSeats[seatInfo.row][seatInfo.column])
        });
    }

    UnlockSessionSeat = (seatInfo) =>{
        let tempSeats = this.state.seats;
        tempSeats[seatInfo.row][seatInfo.column].chosen = false;
        let tempChosenSeats = this.state.chosenSeats;
        tempChosenSeats.splice(tempChosenSeats.findIndex( el => el.sessionSeatId === seatInfo.sessionSeatId), 1);
        this.setState({
            seats: tempSeats,
            chosenSeats: tempChosenSeats
        });
    }

    handleSeatClick = (seatInfo) =>{
        if(!this.state.seats[seatInfo.row][seatInfo.column].booked){
            if(!this.state.chosenSeats.find(el => el.sessionSeatId === seatInfo.sessionSeatId)){
                if(this.state.chosenSeats.length < 10){
                    let tempSeatInfo = Object.assign({}, seatInfo);
                    tempSeatInfo.booked = true;
                    this.handleSeatClickFetch(tempSeatInfo)        
                    .then(el =>{
                        this.getUpdates();
                    });
                }
            }
            else{
                let tempSeatInfo = Object.assign({}, seatInfo);
                tempSeatInfo.booked = false;
                this.handleSeatClickFetch(tempSeatInfo)
                .then(el =>{
                    this.getUpdates();
                });
            }
        }
    }

    handleSeatsChoice = () =>{
        this.setState({
            seatsChosen: true
        })
    }

    handleCancelConfirm = () =>{
        this.setState({
            seatsChosen: false
        })
    }

    handleConfirmReservation = () =>{
        this.createOrder();
        this.props.callBackCancelReservation();
    }

    renderChooseSeatsContent(){
        return(
            <ChooseSeats
                seats={this.state.seats}
                chosenSeats={this.state.chosenSeats}
                sessionSeatTypePrices={this.props.session.info.sessionSeatTypePrices}
                callBackHandleSeatClick={this.handleSeatClick}
                callBackHandleSeatsChoice={this.handleSeatsChoice}
                callBackCancelReservation={this.props.callBackCancelReservation}
            />
        );
    }

    renderConfirmContent(){
        return(
            <ConfirmReservation
                chosenSeats={this.state.chosenSeats}
                sessionSeatTypePrices={this.props.session.info.sessionSeatTypePrices}
                callBackCancelConfirm={this.handleCancelConfirm}
                callBackConfirmReservation={this.handleConfirmReservation}
            />
        );
    }
    
    renderContent = () =>{
        if (!this.state.seatsChosen){
            return this.renderChooseSeatsContent();
        }
        else{
            return this.renderConfirmContent();
        }
    }

    render(){
        const content = this.renderContent();
        return(
            <div>
                <div className="inline-information-block">
                    <div className="header-string-box">
                        {this.props.session.info.film.name}
                    </div>
                    <div className="information-block">
                        {this.props.session.info.cinema.city},{' '}
                        {this.props.session.info.cinema.name}
                    </div>
                    <div className="information-block">
                        {this.props.session.info.beginTime.toLocaleString()}
                    </div>
                </div>
                {content}
            </div>
        );
    }
}