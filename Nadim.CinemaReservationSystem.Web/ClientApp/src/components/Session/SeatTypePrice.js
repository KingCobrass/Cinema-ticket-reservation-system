import React from 'react';
import { ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';
import ValidationService from '../../Services/ValidationService';

const SeatTypePrice = (props) =>{

    const handlePriceChange = (event) =>{
        props.callBackChangePrice({
            seatTypeId: props.seatType.seatTypeId,
            price: event.target.value
        })
    }

    return(
        <div className="list-box-container">
            <FormGroup
                validationState={ValidationService.showIsDoubleNumberValid(props.showHint, props.seatType.price) ? null : 'error'}
            >
                <ControlLabel
                    className="font-large"
                >
                    {props.seatType.typeName} : 
                </ControlLabel>
                <FormControl
                    value={props.seatType.price}
                    onChange={handlePriceChange}
                />                    
                <HelpBlock 
                    className="font-italic"
                >
                    {ValidationService.doubleValidationErrorMessage(props.showHint, props.seatType.price)}
                </HelpBlock>
            </FormGroup>
        </div>
    );
}

export default SeatTypePrice;