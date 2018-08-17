import React, { Component } from 'react';
import { Button } from 'react-bootstrap';

export default class FormCinemaRoomInfo extends Component{
    displayName = FormCinemaRoomInfo.displayName;

    constructor(props){
        super(props);
        this.state = {
            rows: this.props.cinemaRoomInfo ? this.props.cinemaRoomInfo.rows : '',
            columns: this.props.cinemaRoomInfo ? this.props.cinemaRoomInfo.columns : '',
            name: this.props.cinemaRoomInfo ? this.props.cinemaRoomInfo.name : '',
            showHint: this.props.needToShowHint ? this.props.needToShowHint: false,
            displayedComponents: this.props.displayedComponents ? 
            this.props.displayedComponents : 
            {
                name: true,
                rows: true, 
                columns: true,
                submit: true,
                cancel: true
            }
        }
        this.validateString = this.validateString.bind(this);
        this.validateInt = this.validateInt.bind(this);
        this.handleSubmitClick = this.handleSubmitClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
        this.handleRowsChange = this.handleRowsChange.bind(this);
        this.handleColumnsChange = this.handleColumnsChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.allowSubmitClick = this.allowSubmitClick.bind(this);
    }

    handleSubmitClick(){
        this.setState({
            showHint: true
        });
        if (this.allowSubmitClick(
            this.state.rows,
            this.state.columns,
            this.state.name
        )){
            this.props.callBackReceiveCinemaRoomInfo({
                rows : this.state.rows,
                columns: this.state.columns,
                name: this.state.name
            });
        }
    }

    handleCancelClick(){
        this.props.callBackCancel();
    }

    validateIntNumber(number){
        const result = /^\d+$/;
        return result.test(String(number));
    }

    validateString(str){
        return !this.state.showHint || str
        ?''
        :'Data not entered'
    }

    validateInt(num){
        if (this.state.showHint){
            return num
            ?(this.validateIntNumber(num)
                ? ''
                :'Data not valid'
            )
            :'Data not entered';
        }
        else{
            return '';
        }
    }

    handleRowsChange(event){
        this.setState({
            rows: event.target.value
        });
        if (this.props.callBackHandleChangeCinemaRoomInfo){
            this.props.callBackHandleChangeCinemaRoomInfo({
                info: 
                {
                    rows : event.target.value,
                    columns: this.state.columns,
                    name: this.state.name
                },
                allowSubmit: this.allowSubmitClick(
                    event.target.value,
                    this.state.columns,
                    this.state.name
                ) 
            });
        }
    }
    
    handleColumnsChange(event){
        this.setState({
            columns: event.target.value
        });
        if (this.props.callBackHandleChangeCinemaRoomInfo){
            this.props.callBackHandleChangeCinemaRoomInfo({
                info: 
                {
                    rows : this.state.rows,
                    columns: event.target.value,
                    name: this.state.name
                },
                allowSubmit: this.allowSubmitClick(
                    this.state.rows,
                    event.target.value,
                    this.state.name
                ) 
            });
        }
    }

    handleNameChange(event){
        this.setState({
            name: event.target.value
        });
        if (this.props.callBackHandleChangeCinemaRoomInfo){
            this.props.callBackHandleChangeCinemaRoomInfo({
                info: 
                {
                    rows : this.state.rows,
                    columns: this.state.columns,
                    name: event.target.value
                },
                allowSubmit: this.allowSubmitClick(
                    this.state.rows,
                    this.state.columns,
                    event.target.value
                )
            });
        }
    }

    allowSubmitClick(rows, columns, name){
        if (this.state.displayedComponents.rows && !this.validateIntNumber(rows)){
            return false;
        }
        if (this.state.displayedComponents.columns && !this.validateIntNumber(columns)){
            return false;
        }
        if (this.state.displayedComponents.name && !name){
            return false;
        }
        return true;
    }

    render(){
        return(
            <fieldset>
                <fieldset
                    className={this.state.displayedComponents.name ? '' : 'hidden'}
                >
                    <label htmlFor="nameInput" className="font-bold-large">
                        Cinema room name :
                    </label> 
                    <input
                        type="text" 
                        className="form-control form-control-sm"
                        id="nameInput"
                        value={this.state.name} 
                        onChange={this.handleNameChange}
                        placeholder="Name"
                    />
                    <p className="font-italic error-text">
                        {
                            this.validateString(this.state.name)
                        }
                    </p>
                </fieldset>
                <fieldset
                    className={this.state.displayedComponents.rows ? '' : 'hidden'}
                >
                    <label htmlFor="rowsInput" className="font-bold-large">
                        Number of rows : 
                    </label> 
                    <input 
                        type="text" 
                        className="form-control form-control-sm"
                        id="rowsInput"
                        value={this.state.rows} 
                        onChange={this.handleRowsChange}
                        placeholder="Rows"
                    />
                    <p className="font-italic error-text">
                    {
                        this.validateInt(this.state.rows)
                    }
                    </p>
                </fieldset>
                <fieldset
                    className={this.state.displayedComponents.columns ? '' : 'hidden'}
                >
                <label htmlFor="columnsInput" className="font-bold-large">
                    Number of places in row : 
                </label> 
                    <input
                        type="text" 
                        className="form-control form-control-sm"
                        id="columnsInput"
                        value={this.state.columns} 
                        onChange={this.handleColumnsChange}
                        placeholder="Columns"
                    />
                    <p className="font-italic error-text">
                    {
                        this.validateInt(this.state.columns)
                    }
                    </p>
                </fieldset>
                <Button 
                    className={this.state.displayedComponents.submit ? '' : 'hidden'}
                    onClick={this.handleSubmitClick}
                >
                    Create
                </Button>
                <Button 
                    className={this.state.displayedComponents.cancel ? '' : 'hidden'}
                    bsStyle="default"
                    onClick={this.handleCancelClick}
                >
                    Cancel
                </Button>
            </fieldset>
        );
    }
}