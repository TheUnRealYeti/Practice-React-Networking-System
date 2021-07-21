/* Core React import section */
import React from "react";

/* Custom Component import section */
import Ipv4SingleOctetError from "./Ipv4SingleOctetError";

class Ipv4AllOctetErrors extends React.Component {
    
    errorAppearance() {

        if ( this.props.errorExit ) {

            return "fieldErrorExit";
        }
        
        if ( this.props.hasError ) {

            return "fieldErrorAppear";
        }
        
        return "hideInput";
    }

    octetErrorList() {

        const ipv4OctetErrors = new Array( this.props.numOctets );
        const dateStr = String( (new Date()).getTime() );

        for ( let index = 1; index <= this.props.numOctets; index++ ) {

            ipv4OctetErrors[ index - 1 ] = (
                <Ipv4SingleOctetError 
                    name = { 
                        this.props.inputName + "-Octet" + index + "-" 
                    } 
                    
                    label =      { "Octet " + index } 
                    maxLength =  { this.props.maxLength } 
                    maxNum =     { this.props.maxNum } 
                    octetError = { this.props[ "octet" + index + "Error" ] } 
                    key =        { dateStr + "OctetError" + index } 
                />
            );
        }

        return ipv4OctetErrors;
    }

    render() {

        return (
            <div  
                id = { this.props.inputName + "ErrorContainer" } 

                className = { "fieldErrorContainer" + ( 
                    this.props.errorRefresh ? " fieldErrorRefresh" : ""   
                ) }
            >
                <label 
                    id = { this.props.inputName + "OctetErrors" } 

                    className = { 
                        "fieldErrorMessage " + this.errorAppearance() 
                    } 

                    htmlFor = { this.props.inputId } 
                >
                    { this.octetErrorList() }
                </label>
            </div>
        );
    }
}

export default Ipv4AllOctetErrors;