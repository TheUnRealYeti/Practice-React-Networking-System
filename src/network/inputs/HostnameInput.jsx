/* Core React import section */
import React from "react";

/* Custom Component import section */
import HostnameErrors from "../errors/HostnameErrors";

class HostnameInput extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            hostnameErrors: {
                hasError: false, 
                errorExit: false, 
                isEmpty: false, 
                totalTooLong: false, 
                labelTooLong: false, 
                hasInvalidChar: false, 
                consecPeriod: false, 
                invalidStart: false, 
                invalidEnd: false, 
                invalidUnder: false, 
                notQualified: false 
            }
        };
    }

    inputAppearance() {

        if ( this.props.inputRefresh ) {

            return "inputRefresh";
        }
        
        if ( this.props.errorRefresh 
             || !this.state.hostnameErrors.hasError ) {

            return "regularInput";
        }
        
        return "invalidInput";
    }

    checkHostname(newValue) {

        const ERROR_OBJ_KEY = "hostnameErrors", MAX_TOTAL_LENGTH = 253;
        const errorObj = {}

        /* Coerces different data type input values to a String. */
        newValue = newValue === undefined || newValue === null 
            ? "" : String(newValue).trim();

        /* Checks whether or not the hostname value is empty. */
        if (newValue) {

            errorObj.isEmpty = false;
        }
        else {

            this.setState({ 
                [ ERROR_OBJ_KEY ]: { 
                    hasError:       !!this.props.required, 
                    errorExit:      false, 
                    isEmpty:        !!this.props.required, 
                    totalTooLong:   false, 
                    labelTooLong:   false, 
                    hasInvalidChar: false, 
                    consecPeriod:   false, 
                    invalidStart:   false, 
                    invalidEnd:     false, 
                    invalidUnder:   false, 
                    notQualified:   false 
                } 
            });

            this.props.updateParentState(newValue, true);
            return;
        }

        /* Converts any ASCII uppercase letters to lowercase to make them 
         case-insensitive. */
        newValue = newValue.toLowerCase();

        /* Limits total hostname length to 253 characters. */
        errorObj.totalTooLong = newValue.length > MAX_TOTAL_LENGTH;

        if ( errorObj.totalTooLong ) {

            newValue = newValue.substring( 0, MAX_TOTAL_LENGTH );
        }

        /* Limits hostname label, domain, or subdomain length to 64 
         characters. */
        errorObj.labelTooLong = /(?:^|\.)[\w-]{64,}(?:\.|$)/.test(newValue);

        /* Only allows ASCII letters (a-z and A-Z), digits (0-9), hyphens (-), 
         and delimiting periods (.) for hostnames. */
        errorObj.hasInvalidChar = /[^\w-.]/.test(newValue);

        /* Does not allow consecutive delimiting periods (.) in a hostname, so 
         that there are characters between the dots of a hostname to label a 
         subdomain. */
        errorObj.consecPeriod = /[.]{2,}/.test(newValue);

        /* Does not permit a starting hyphen (-) or period (.). */
        errorObj.invalidStart = /^[-.]/.test(newValue);

        /* Does not permit an ending hyphen (-) or period (.). */
        errorObj.invalidEnd = /[-.]$/.test(newValue);

        /* Label, subdomain, or domain names cannot contain underscores at both 
           their start and end. Labels in the RegExp (regular expression) 
           objects can span: 
           - from the start to the end of the string, with no delimiting 
             periods in-between; 
           - from the start to the first period in the hostname; 
           - between two periods; or 
           - from the last period in the hostname to the end of the string. 
        */
        errorObj.invalidUnder = /^_[^\.]*_$/.test(newValue) 
            || /^_.*_\./.test(newValue) || /\._.*_\./.test(newValue) 
            || /\._.*_$/.test(newValue);

        /* If any of the above checks were true, the hostname input value has 
         errors, and the input styling should update to reflect this. */
        errorObj.hasError = errorObj.totalTooLong || errorObj.labelTooLong 
            || errorObj.hasInvalidChar || errorObj.consecPeriod 
            || errorObj.invalidStart || errorObj.invalidEnd 
            || errorObj.invalidUnder;

        /* If a hostname must be a fully-qualified domain name, it must contain 
         at least one period. In the hostname "example.com", the last period 
         must be preceded by a second-level domain (example) and followed by a 
         top-level domain (com). */
         if ( this.props.fullyQualified ) {

            errorObj.notQualified = !/\./.test(newValue);
            errorObj.hasError = errorObj.hasError || errorObj.notQualified;
        }

        /* Play an exiting animation for any error messages if a input with a 
         formerly invalid value now has a valid value. */
        errorObj.errorExit = this.state[ ERROR_OBJ_KEY ].hasError 
            && !errorObj.hasError;

        /* Update the Component's state. */
        this.setState({ 
            [ ERROR_OBJ_KEY ]: errorObj 
        });

        this.props.updateParentState( newValue, errorObj.hasError );
    }

    render() {

        const inputId = this.props.name + "InputField";
        const ERROR_OBJ_KEY = "hostnameErrors";

        /* Internet standard, not optional. */
        const MAX_TOTAL_LENGTH = 253, MAX_LABEL_LENGTH = 63;

        return (
            <div className = "inputContainer">

                <label 
                    className = "fieldLabel" 
                    htmlFor = { inputId } 
                >
                    { this.props.fieldTitle }
                </label>

                <input
                    id =          { inputId } 
                    className =   { "inputField " + this.inputAppearance() } 
                    name =        { this.props.name } 
                    type =        "text" 
                    placeholder = { this.props.fieldTitle } 
                    value =       { this.props.value } 
                    maxLength =   { MAX_TOTAL_LENGTH } 
                    disabled =    { this.props.disabled } 
                    required =    { this.props.required } 

                    onChange = { (event) => {
                        this.checkHostname(event.target.value);
                    } } 
                />

                <HostnameErrors 
                    inputId =        { inputId } 
                    inputName =      { this.props.name } 
                    fieldTitle =     { this.props.fieldTitle } 
                    maxTotalLength = { MAX_TOTAL_LENGTH } 
                    maxLabelLength = { MAX_LABEL_LENGTH } 
                    hostnameErrors = { this.state[ ERROR_OBJ_KEY ] } 
                    errorRefresh =   { this.props.errorRefresh } 
                />

            </div>
        );
    }
}

export default HostnameInput;