/* Core React import section */
import React from "react";

/* Custom Component import section */

class Ipv4CidrErrors extends React.Component {

    errorAppearance() {

        if ( this.props.errorExit ) {

            return "fieldErrorExit";
        }

        if ( this.props.cidrErrors.hasError ) {

            return "fieldErrorAppear";
        }
        
        return "hideInput";
    }

    render() {

        const ERROR_ITEM_CLASS = "fieldErrorItem";
        const DISPLAY_VALUE = "inline-block";

        return (
            <div  
                id = { this.props.inputName + "-ErrorContainer" } 
                className = { "fieldErrorContainer" + 
                    ( this.props.errorRefresh ? " fieldErrorRefresh" : "" ) 
                }
            >
                <label 
                    id = { this.props.inputName + "-ErrorMessage" } 

                    className = { 
                        "fieldErrorMessage " + this.errorAppearance() 
                    }

                    htmlFor = { this.props.inputId } 
                >
                    <strong 
                        id = { this.props.inputName + "-Required-Error" } 
                        className = { ERROR_ITEM_CLASS } 
                        style = { 
                            this.props.cidrErrors.isEmpty 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } is required.
                    </strong>

                    <strong 
                        id = { this.props.inputName + "-CharLength-Error" } 
                        className = { ERROR_ITEM_CLASS } 
                        style = { 
                            this.props.cidrErrors.tooManyChar 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } can be at 
                        most { this.props.maxLength } digits in length. 
                    </strong>

                    <strong 
                        id = { this.props.inputName + "-NonDigit-Error" } 
                        className = { ERROR_ITEM_CLASS } 
                        style = { 
                            this.props.cidrErrors.nonDigit  
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } can only contain digits 
                        (0-9). 
                    </strong> 

                    <strong 
                        id = { this.props.inputName + "-NumTooLarge-Error" } 
                        className = { ERROR_ITEM_CLASS } 
                        style = { 
                            this.props.cidrErrors.numTooLarge 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } cannot be larger 
                        than { this.props.maxNum }.
                    </strong> 

                    <strong 
                        id = { this.props.inputName + "-RangeTooLarge-Error" } 
                        className = { ERROR_ITEM_CLASS } 
                        style = { 
                            this.props.cidrErrors.rangeTooLarge 
                                ? { display: DISPLAY_VALUE } 
                                : { display: "none" } 
                        }
                    >
                        { this.props.fieldTitle } specifies too large an IP 
                        address range. 
                    </strong> 
                </label>
            </div>
        );
    }
}

export default Ipv4CidrErrors;