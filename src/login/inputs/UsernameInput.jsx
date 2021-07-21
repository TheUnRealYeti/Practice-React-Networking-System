import React          from "react";
import UsernameErrors from "../errors/UsernameErrors";

class InputField extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            hasError: false, 
            errorExit: false, 
            isEmpty: false, 
            tooShort: false, 
            tooLong: false, 
            needsLetter: false, 
            hasInvalidChar: false 
        };
    }

    checkUsernameValue(userVal) {

        const stateVal = {};

        /* Coerces different data type input values to a String. */
        userVal = userVal === undefined || userVal === null 
            ? "" : String(userVal).trim();

        /* The username input field is required. */
        if (userVal) {

            stateVal.isEmpty = false;
        }
        else {

            this.setState({
                hasError: true, 
                isEmpty: true, 
                tooShort: false, 
                tooLong: false, 
                needsLetter: false, 
                hasInvalidChar: false 
            });

            this.props.updateParentState(userVal, true);
            return;
        }
        
        /* Overly short usernames are not very unique. */
        stateVal.tooShort = userVal.length < this.props.minLength;

        /* Limits username length for screen printability and storage in 
         databases. */
        stateVal.tooLong = userVal.length > this.props.maxLength;
        
        /* Required for attempt to make more human-friendly usernames. */
        stateVal.needsLetter = !/[a-zA-Z]/.test(userVal);

        /* Potential character range purposefully limited to prevent SQL 
         injection or Cross-Site Scripting attacks via username characters. */
        stateVal.hasInvalidChar = /[^\w-]/.test(userVal);

        stateVal.hasError = stateVal.tooShort || stateVal.tooLong 
            || stateVal.needsLetter || stateVal.hasInvalidChar;

        stateVal.errorExit = this.state.hasError && !stateVal.hasError;

        /* Update the Component's state. */
        this.setState(stateVal);
        this.props.updateParentState(userVal, stateVal.hasError);
    }

    render() {

        const inputId = this.props.name + "Field";

        return (
            <div className = "inputContainer">

                <label 
                    className = "fieldLabel" 
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
                    type = "text" 
                    placeholder = { this.props.fieldTitle } 

                    onChange = { (event) => {
                        this.checkUsernameValue(event.target.value);
                    } } 

                    value = { this.props.value } 
                    minLength = { this.props.minLength } 
                    maxLength = { this.props.maxLength } 
                    disabled = { this.props.disabled } 
                    required = "" 
                />

                <UsernameErrors 
                    inputId = { inputId } 
                    inputName = { this.props.name } 
                    fieldTitle = { this.props.fieldTitle } 
                    minLength = { this.props.minLength } 
                    hasError = { this.state.hasError } 
                    errorExit = { this.state.errorExit } 
                    isEmpty = { this.state.isEmpty } 
                    tooShort = { this.state.tooShort } 
                    tooLong = { this.state.tooLong } 
                    needsLetter = { this.state.needsLetter } 
                    hasInvalidChar = { this.state.hasInvalidChar } 
                    errorRefresh = { this.props.errorRefresh } 
                />

                <hr className = "inputDivider" />

            </div>
        );
    }
}

export default InputField;