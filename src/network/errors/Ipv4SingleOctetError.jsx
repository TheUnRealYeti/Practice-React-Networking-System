/* Core React import section */
import React from "react";

class Ipv4SingleOctetError extends React.Component {

    render() {

        const DISPLAY_VALUE = "list-item";

        return (
            <ul 
                id = { this.props.name + "ErrorList" } 
                className = "fieldErrorList" 
                
                style = { 
                    this.props.octetError.hasError 
                        ? { display: "inline-block" } 
                        : { display: "none" } 
                }
            >
                { this.props.label }:

                <li 
                    id = { this.props.name + "RequiredError" } 
                    style = { 
                        this.props.octetError.isEmpty  
                            ? { display: DISPLAY_VALUE } 
                            : { display: "none" } 
                    }
                >
                    is required. 
                </li>

                <li 
                    id = { this.props.name + "TooLongError" } 
                    style = { 
                        this.props.octetError.tooLong 
                            ? { display: DISPLAY_VALUE } 
                            : { display: "none" } 
                    }
                >
                    can be at most { this.props.maxLength } characters in 
                    length. 
                </li> 

                <li 
                    id = { this.props.name + "OnlyDigitsError" } 
                    style = { 
                        this.props.octetError.nonDigit  
                            ? { display: DISPLAY_VALUE } 
                            : { display: "none" } 
                    }
                >
                    can only contain digits (0-9). 
                </li> 

                <li 
                    id = { this.props.name + "TooLargeError" } 
                    style = { 
                        this.props.octetError.tooLarge 
                            ? { display: DISPLAY_VALUE } 
                            : { display: "none" } 
                    }
                >
                    cannot be larger than { this.props.maxNum }. 
                </li> 

                <li 
                    id = { this.props.name + "PrivateRangeError" } 
                    style = { 
                        this.props.octetError.notPrivate 
                            ? { display: DISPLAY_VALUE } 
                            : { display: "none" } 
                    }
                >
                    must belong to a private IP address range. 
                </li>
            </ul>
        );
    }
}

export default Ipv4SingleOctetError;
