import React  from "react";
import Button from "./Button";

class LoginButtons extends React.Component {

    getSubmitTitle() {

        if ( this.props.inputEmpty ) {

            return "Fill out username and password to log in.";
        }
        
        if ( this.props.inputError ) {

            return "Correct errors before submitting.";
        }
        
        if ( this.props.processing ) {

            return "Processing...";
        }
        
        return "Click to submit form input.";
    }

    render() {

        return (
            <div className = "formButtonWrapper">
                <div className = "formButtonContainer">
                    <Button 
                        extraClass = { 
                            !this.props.inputError && ( this.props.inputEmpty 
                                || this.props.processing ) 
                                    ? " buttonDisabled" 
                                    : "" 
                        }

                        text = "Submit" 
                        type = "submit" 

                        disabled = { this.props.submitDisabled } 

                        onClick = { () => { 
                            return this.props.loginAttemptFn();
                        } } 

                        title = { this.getSubmitTitle() } 
                    />
                </div>
                
                <div className = "formButtonContainer">
                    <Button
                        extraClass = {
                            this.props.processing ? " buttonDisabled" : "" 
                        }

                        text = "Cancel" 
                        type = "button" 

                        disabled = { this.props.processing } 

                        onClick = { () => { 
                            this.props.resetFn(); 
                        } } 

                        title = { this.props.processing ? "Processing..." 
                            : "Click to clear login form." 
                        }
                    />
                </div>
            </div>
        );
    }
}

export default LoginButtons;