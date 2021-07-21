import React          from 'react';
import PasswordErrors from "../errors/PasswordErrors";

class PasswordInput extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            hasError: false, 
            errorExit: false, 
            isEmpty: false, 
            tooShort: false, 
            missingChar: false, 
            needsLowerCase: false, 
            needsUpperCase: false, 
            needsDigit: false, 
            needsSpecial: false 
        };
    }

    checkPasswordValue(passVal) {

        let stateVal = {};

        /* Coerces different data type values to a String. */
        passVal = passVal === undefined || passVal === null 
            ? "" : String(passVal).trim();

        /* Empty password input is not allowed since the password field is 
         required. */
        if (passVal) {

            stateVal.isEmpty = false;
        }
        else {

            this.setState({
                hasError: true, 
                isEmpty: true, 
                tooShort: false, 
                missingChar: false, 
                needsLowerCase: false, 
                needsUpperCase: false, 
                needsDigit: false, 
                needsSpecial: false 
            });

            this.props.updateParentState(passVal, true);
            return;
        }

        /* Higher minimum password length required for stronger passwords. */
        stateVal.tooShort = passVal.length < this.props.minLength;

        /* An uppercase letter, lowercase letter, digit, and special character 
         are required for increased password strength. */

        /* Lowercase letter range regular expression check */
        stateVal.needsLowerCase = !/[a-z]/.test(passVal);

        /* Uppercase letter range regular expression check */
        stateVal.needsUpperCase = !/[A-Z]/.test(passVal);

        /* Digit range regular expression check */
        stateVal.needsDigit = !/[\d]/.test(passVal);

        /* Special character regular expression check: not a letter, digit, or 
         spacing character. */
        stateVal.needsSpecial = !/[^A-Za-z\d\s]/.test(passVal);

        stateVal.missingChar = 
            stateVal.needsLowerCase || stateVal.needsUpperCase 
            || stateVal.needsDigit || stateVal.needsSpecial;
        
        stateVal.hasError = stateVal.tooShort || stateVal.missingChar;
        stateVal.errorExit = this.state.hasError && !stateVal.hasError;

        /* Updates the form control state. */
        this.setState(stateVal);
        this.props.updateParentState(passVal, stateVal.hasError);
    }

    render() {

        const inputId = this.props.name + "Field";

        return (
            <div className="inputContainer">

                <label 
                    className="fieldLabel" 
                    htmlFor = { inputId } 
                >
                    { this.props.fieldTitle }
                </label>

                <input
                    id = { inputId } 

                    className = { "inputField " + (
                        this.props.inputRefresh 
                            ? "inputRefresh" 
                            : this.props.errorRefresh || !this.state.hasError 
                                ? "regularInput" 
                                : "invalidInput" 
                        )
                    } 
                    
                    name = { this.props.name } 
                    type = "password" 
                    placeholder = { this.props.fieldTitle } 

                    onChange = { (event) => {
                        this.checkPasswordValue(event.target.value);
                    } } 

                    value = { this.props.value } 
                    minLength = { this.props.minLength } 
                    disabled = { this.props.disabled } 
                    required = "" 
                />

                <PasswordErrors 
                    inputId = { inputId } 
                    inputName = { this.props.name } 
                    fieldTitle = { this.props.fieldTitle } 
                    minLength = { this.props.minLength } 
                    hasError = { 
                        this.state.hasError || this.props.passwordMismatch 
                    } 
                    errorExit = { this.state.errorExit } 
                    isEmpty = { this.state.isEmpty } 
                    tooShort = { this.state.tooShort } 
                    missingChar = { this.state.missingChar } 
                    needsLowerCase = { this.state.needsLowerCase } 
                    needsUpperCase = { this.state.needsUpperCase } 
                    needsDigit = { this.state.needsDigit } 
                    needsSpecial = { this.state.needsSpecial } 
                    passwordMismatch = { this.props.passwordMismatch } 
                    errorRefresh = { this.props.errorRefresh } 
                />

                <hr className="inputDivider" />

            </div>
        );
    }
}

export default PasswordInput;