import React from 'react';

class PasswordErrors extends React.Component {

    render() {

        return (
            <div  
                id = { this.props.inputName + "ErrorContainer" } 
                className = { "fieldErrorContainer" + 
                    ( this.props.errorRefresh ? " fieldErrorRefresh" : "" ) 
                }
            >
                <label 
                    id = { this.props.inputName  + "ErrorMessage" } 

                    className = { "fieldErrorMessage " + (
                            this.props.errorExit 
                                ? "fieldErrorExit" 
                                : this.props.hasError 
                                    ? "fieldErrorAppear" 
                                    : "hideInput" 
                        ) 
                    }

                    htmlFor = { this.props.inputId } 
                >
                    <strong 
                        id = { this.props.inputName + "MismatchError" } 
                        className = "fieldErrorItem" 
                        style = { this.props.passwordMismatch 
                            ? { display: "inline-block" } 
                            : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } is incorrect. 
                    </strong>

                    <strong 
                        id = { this.props.inputName + "RequiredError" } 
                        className = "fieldErrorItem" 
                        style = { this.props.isEmpty 
                            ? { display: "inline-block" } 
                            : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } is required.
                    </strong>

                    <strong 
                        id = { this.props.inputName + "ShortError" } 
                        className = "fieldErrorItem" 
                        style = { this.props.tooShort 
                            ? { display: "inline-block" } 
                            : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } must be at 
                        least { this.props.minLength } characters in length. 
                    </strong>

                    <ul 
                        id = { this.props.inputName + "CharTypeError" } 
                        className = "fieldErrorList" 
                        
                        style = { this.props.missingChar 
                            ? { display: "inline-block" } 
                            : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } must include at least one:

                        <li 
                            style = { this.props.needsLowerCase 
                                ? { display: "list-item" } 
                                : { display: "none" } 
                            }
                        >
                            lowercase letter (a-z)
                        </li>

                        <li 
                            style = { this.props.needsUpperCase 
                                ? { display: "list-item" } 
                                : { display: "none" } 
                            }
                        >
                            uppercase letter (A-Z)
                        </li>

                        <li 
                            style = { this.props.needsDigit 
                                ? { display: "list-item" } 
                                : { display: "none" } 
                            }
                        >
                            digit (0-9)
                        </li>

                        <li 
                            style = { this.props.needsSpecial 
                                ? { display: "list-item" } 
                                : { display: "none" }
                            }
                        >
                            special character
                        </li>
                    </ul>
                </label>
            </div>
        );
    }
}

export default PasswordErrors;