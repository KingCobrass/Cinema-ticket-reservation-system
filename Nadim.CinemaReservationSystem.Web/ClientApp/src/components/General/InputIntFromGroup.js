import React from 'react';
import { FormControl, ControlLabel, FormGroup, HelpBlock } from 'react-bootstrap';
import ValidationService from '../../Services/ValidationService';

const InputIntFormGroup = (props) =>{
    return(
        <FormGroup
            className={props.isShown ? '' : 'hidden'}
            controlId={`form${props.label}Text`}
            validationState={ValidationService.intValidationErrorMessage(props.showHint, props.value) === ''
                ? null 
                : 'error'}
        >
            <ControlLabel
                className="font-bold-large"
            >
                {`${props.label} :`}
            </ControlLabel>
            <FormControl
                type="text"
                value={props.value}
                placeholder={props.label}
                onChange={props.handleValueChange}
            />
            {
                
                <HelpBlock 
                    className="font-italic"
                >
                    {ValidationService.intValidationErrorMessage(props.showHint, props.value)}
                </HelpBlock> 
            }
        </FormGroup>    
    );
}

export default InputIntFormGroup;