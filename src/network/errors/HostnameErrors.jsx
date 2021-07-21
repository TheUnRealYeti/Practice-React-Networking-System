import React from 'react';

class HostnameErrors extends React.Component {

    errorAppearance() {

        const ERROR_OBJ_KEY = "hostnameErrors";

        if ( this.props[ ERROR_OBJ_KEY ].errorExit ) {

            return "fieldErrorExit";
        }
        
        if ( this.props[ ERROR_OBJ_KEY ].hasError ) {

            return "fieldErrorAppear";
        }
        
        return "hideInput";
    }

    render() {

        const ITEM_CLASS = "fieldErrorItem", LIST_CLASS = "fieldErrorList";
        const DISPLAY_VALUE = "inline-block", ERROR_OBJ_KEY = "hostnameErrors";

        return (
            <div  
                id = { this.props.inputName + "ErrorContainer" } 

                className = { "fieldErrorContainer" + 
                    ( this.props.errorRefresh ? " fieldErrorRefresh" : "" ) 
                }
            >
                <label 
                    id = { this.props.inputName  + "ErrorMessage" } 

                    className = { 
                        "fieldErrorMessage " + this.errorAppearance() 
                    } 

                    htmlFor = { this.props.inputId } 
                >
                    <strong 
                        id = { this.props.inputName + "RequiredError" } 

                        className = { ITEM_CLASS } 

                        style = { 
                            this.props[ ERROR_OBJ_KEY ].isEmpty 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } is required.
                    </strong>

                    <strong 
                        id = { this.props.inputName + "TotalLengthError" } 

                        className = { ITEM_CLASS } 

                        style = { 
                            this.props[ ERROR_OBJ_KEY ].totalTooLong 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } can be at 
                        most { this.props.maxTotalLength } characters 
                        in length. 
                    </strong>

                    <strong 
                        id = { this.props.inputName + "LabelLengthError" } 

                        className = { ITEM_CLASS } 

                        style = { 
                            this.props[ ERROR_OBJ_KEY ].labelTooLong 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } labels* can be at 
                        most { this.props.maxLabelLength } characters in 
                        length. 
                    </strong> 

                    <ul 
                        id = { this.props.inputName + "CharTypeError" } 

                        className = { LIST_CLASS } 

                        style = { 
                            this.props[ ERROR_OBJ_KEY ].hasInvalidChar 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        Invalid character(s). { this.props.fieldTitle } can 
                        only include:  

                        <li>
                            letters (a-z or A-Z);
                        </li>

                        <li>
                            digits (0-9);
                        </li>

                        <li>
                            underscores (_);
                        </li>

                        <li>
                            hyphens (-);
                        </li>

                        <li>
                            non-consecutive periods (.).
                        </li>
                    </ul> 

                    <strong 
                        id = { 
                            this.props.inputName + "ConsecPeriodError" 
                        } 

                        className = { ITEM_CLASS } 

                        style = { 
                            this.props[ ERROR_OBJ_KEY ].consecPeriod 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } cannot contain consecutive 
                        sequences of periods (.). 
                    </strong> 

                    <ul 
                        id = { this.props.inputName + "StartError" } 

                        className = { LIST_CLASS } 

                        style = { 
                            this.props[ ERROR_OBJ_KEY ].invalidStart 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } cannot contain the following 
                        as a starting character: 

                        <li>hypens (-);</li>
                        <li>periods (.).</li>
                    </ul>

                    <ul 
                        id = { this.props.inputName + "EndError" } 

                        className = { LIST_CLASS } 

                        style = { 
                            this.props[ ERROR_OBJ_KEY ].invalidEnd  
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } cannot contain the following 
                        as an ending character: 

                        <li>hyphens (-);</li>
                        <li>periods (.).</li>
                    </ul>

                    <strong 
                        id = { 
                            this.props.inputName + "StartError" 
                        } 

                        className = { ITEM_CLASS } 

                        style = { 
                            this.props[ ERROR_OBJ_KEY ].invalidUnder 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        } 
                    >
                        { this.props.fieldTitle } labels* cannot contain 
                        underscores as both the starting and ending characters. 
                    </strong> 

                    <ul 
                        id = { this.props.inputName + "QualifiedError" } 

                        className = { LIST_CLASS } 

                        style = { 
                            this.props[ ERROR_OBJ_KEY ].invalidStart 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } must be a qualified domain 
                        name, meaning it must contain: 

                        <li>
                            at least one period (.);
                        </li>

                        <li>
                            characters before, between, and/or after any 
                            periods; 
                        </li>

                        <li>
                            a second-level domain name (ex. "example" in 
                            "example.com");
                        </li>

                        <li>
                            a top-level domain name (ex. "com" in example.com); 
                        </li>

                        <li>
                            optionally, any computer hostname (ex. "server1" 
                            in "server1.example.com"); or 
                        </li> 

                        <li>
                            optionally, any leaf domains (ex. "subdomain" in 
                            "subdomain.example.com"). 
                        </li>
                    </ul>

                    <p
                        id = {
                            this.props.inputName + "LabelDefinition"
                        } 

                        className = { ITEM_CLASS } 

                        style = { 
                            this.props[ ERROR_OBJ_KEY ].labelTooLong 
                            || this.props[ ERROR_OBJ_KEY ].invalidUnder 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        } 
                    >
                        *A hostname <dfn>label</dfn> is a sequence of 
                        non-period characters before, after, or between 
                        periods (.). 
                    </p>
                </label>
            </div>
        );
    }
}

export default HostnameErrors;