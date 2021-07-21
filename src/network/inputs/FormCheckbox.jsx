/* Core React import section */
import React from "react";

/* Custom Components import section */

class DhcpCheckbox extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            checked: this.props.checked 
        };
    }

    render() {

        const inputId = this.props.name + "Checkbox";

        return (
            <div className = "inputContainer"> 
                <label 
                    className = "checkboxContainer" 
                    htmlFor = { inputId } 
                > 
                    <input 
                        id = { inputId } 
                        className = "preventSelection" 
                        name = { this.props.name } 
                        type = "checkbox" 
                        value = { this.props.name } 
                        disabled = { this.props.disabled } 
                        checked = { this.state.checked } 

                        onChange = { (event) => { 

                            this.setState({ 
                                checked: event.target.checked 
                            });

                            this.props.onChange(
                                event.target.checked 
                            );
                        } } 
                    /> 

                    <span 
                        id = { this.props.name + "Button" } 
                        className = "customCheckbox" 
                    /> 

                    { this.props.fieldTitle } 
                </label> 
            </div> 
        );
    }
}

export default DhcpCheckbox;