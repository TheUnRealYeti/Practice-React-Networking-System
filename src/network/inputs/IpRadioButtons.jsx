/* Core React import section */
import React from 'react';

/* Custom Component import section */


class IpRadioButtons extends React.Component {

    constructor(props) {

        const IPV4_VALUE = "ipv4", IPV6_VALUE = "ipv6";
        const IPV4_MAPPED_VALUE = "ipv4MappedIpv6";
        const CHECKED_ENDING = "Checked";

        super(props);

        this.state = { 
            [ IPV4_VALUE + CHECKED_ENDING ]: true, 
            [ IPV6_VALUE + CHECKED_ENDING ]: false, 
            [ IPV4_MAPPED_VALUE + CHECKED_ENDING ]: false, 
            hasError: false, 
            errorExit: false, 
            isEmpty: false, 
            tooShort: false, 
            tooLong: false, 
        };
    }

    render() {

        const BUTTON_CONT_ENDING = "RadioContainer";
        const RADIO_BUTTON_ENDING = "RadioButton";
        const CUSTOM_RADIO_ENDING = "CustomRadio";
        const CHECKED_ENDING = "Checked";
        const IP_RADIO_NAME = "ipType";

        const IPV4_RADIO_VALUE = "ipv4";
        const IPV4_CHECKED = IPV4_RADIO_VALUE + CHECKED_ENDING;

        const IPV6_RADIO_VALUE = "ipv6";
        const IPV6_CHECKED = IPV6_RADIO_VALUE + CHECKED_ENDING;
        
        const IPV4_MAPPED_RADIO_VALUE = "ipv4MappedIpv6";
        const IPV4_MAPPED_CHECKED = IPV4_MAPPED_RADIO_VALUE + CHECKED_ENDING;

        return (
            <div 
                id = { IP_RADIO_NAME + "RadioContainer" } 
                className = "radioButtonsContainer" 
            >
                <label 
                    id = { IP_RADIO_NAME + "FieldLabel" } 
                    className = "fieldLabel" 
                    htmlFor = { IP_RADIO_NAME + "Wrapper" } 
                >
                    Select IP address type: 
                </label>

                <div 
                    id = { IP_RADIO_NAME + "Wrapper" } 
                    className = "radioOptionsWrapper" 
                >
                    <label 
                        id = { IPV4_RADIO_VALUE + BUTTON_CONT_ENDING } 
                        className = "radioOptionContainer preventSelection" 
                        htmlFor = { IPV4_RADIO_VALUE + RADIO_BUTTON_ENDING } 
                    >
                        <input 
                            id = { IPV4_RADIO_VALUE + RADIO_BUTTON_ENDING } 
                            type = "radio" 
                            name = { IP_RADIO_NAME } 
                            value = { IPV4_RADIO_VALUE } 
                            disabled = { this.props.disabled } 
                            defaultChecked = { 
                                this.state[ IPV4_CHECKED ] 
                            } 

                            onChange = { (event) => { 
                                this.setState({ 
                                    [ IPV4_CHECKED ]: event.target.checked 
                                });

                                this.props.onChange( 
                                    IPV4_CHECKED, event.target.checked 
                                );
                            } } 
                        />

                        <span 
                            id = { IPV4_RADIO_VALUE + CUSTOM_RADIO_ENDING } 
                            className = "customRadioBubble" 
                        />

                        IPv4
                    </label>

                    <label 
                        id = { IPV6_RADIO_VALUE + BUTTON_CONT_ENDING } 
                        className = "radioOptionContainer preventSelection" 
                        htmlFor = { IPV6_RADIO_VALUE + RADIO_BUTTON_ENDING }
                    >
                        <input 
                            id = { IPV6_RADIO_VALUE + RADIO_BUTTON_ENDING } 
                            type = "radio" 
                            name = { IP_RADIO_NAME } 
                            value = { IPV6_RADIO_VALUE } 
                            disabled = { this.props.disabled } 
                            defaultChecked = { 
                                this.state[ IPV6_CHECKED ] 
                            } 

                            onChange = { (event) => { 
                                this.setState({ 
                                    [ IPV6_CHECKED ]: event.target.checked 
                                });

                                this.props.onChange( 
                                    IPV6_CHECKED, event.target.checked 
                                );
                            } } 
                        />

                        <span 
                            id = { IPV6_RADIO_VALUE + CUSTOM_RADIO_ENDING } 
                            className = "customRadioBubble" 
                        />

                        IPv6
                    </label>
                    
                    <label 
                        id = { IPV4_MAPPED_RADIO_VALUE + BUTTON_CONT_ENDING } 
                        className = "radioOptionContainer preventSelection" 
                        htmlFor = { 
                            IPV4_MAPPED_RADIO_VALUE + RADIO_BUTTON_ENDING 
                        } 
                    >
                        <input 
                            id = { 
                                IPV4_MAPPED_RADIO_VALUE + RADIO_BUTTON_ENDING 
                            } 
                            type = "radio" 
                            name = { IP_RADIO_NAME } 
                            value = { IPV4_MAPPED_RADIO_VALUE } 
                            disabled = { this.props.disabled } 
                            defaultChecked = { 
                                this.state[ IPV4_MAPPED_CHECKED ] 
                            } 

                            onChange = { (event) => { 
                                this.setState({ 
                                    [ IPV4_MAPPED_CHECKED ]: 
                                        event.target.checked 
                                });

                                this.props.onChange( 
                                    IPV4_MAPPED_CHECKED, event.target.checked 
                                );
                            } } 
                        />

                        <span 
                            id = { 
                                IPV4_MAPPED_RADIO_VALUE + CUSTOM_RADIO_ENDING 
                            } 
                            className = "customRadioBubble" 
                        />

                        IPv4-Mapped IPv6
                    </label>
                </div>
                
            </div>
        )
    }
}

export default IpRadioButtons;