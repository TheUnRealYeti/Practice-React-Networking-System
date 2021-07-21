import React from 'react';

class UsernameErrors extends React.Component {

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

                    <strong 
                        id = { this.props.inputName + "LongError" } 
                        className = "fieldErrorItem" 
                        style = { this.props.tooLong 
                            ? { display: "inline-block" } 
                            : { display: "none" }
                        }
                    >
                        { this.props.fieldTitle } can be at 
                        most { this.props.maxLength } characters in length. 
                    </strong>

                    <strong 
                        id = { this.props.inputName + "LetterError" } 
                        className = "fieldErrorItem" 
                        style = { this.props.needsLetter 
                            ? { display: "inline-block" } 
                            : { display: "none" }
                        }
                    >
                        { this.props.fieldTitle } must contain at least one 
                        letter (A-Z or a-z). 
                    </strong> 

                    <ul 
                        id = { this.props.inputName + "CharTypeError" } 
                        className = "fieldErrorList" 
                        style = { this.props.hasInvalidChar 
                            ? { display: "inline-block" } 
                            : { display: "none" }
                        }
                    >
                        Invalid character(s). { this.props.fieldTitle } can 
                        only include:  

                        <li>letters (a-z or A-Z);</li>
                        <li>digits (0-9);</li>
                        <li>underscores (_);</li>
                        <li>dashes (-).</li>
                    </ul>
                </label>
            </div>
        );
    }
}

export default UsernameErrors;