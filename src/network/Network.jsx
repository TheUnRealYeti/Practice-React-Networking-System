/* Core React import section */
import React from "react";

/* Stylesheet import section */

/* Custom Component import section */
import HostnameInput  from "./inputs/HostnameInput";
import FormCheckbox   from "./inputs/FormCheckbox";
import IpRadioButtons from "./inputs/IpRadioButtons";
import Ipv4Input      from "./inputs/Ipv4Input";

class Network extends React.Component {

    constructor(props) {
        
        /* Passes the "props" object to the Component class constructor. */
        super(props);

        const HOSTNAME_NAME = "hostname", DHCP_NAME = "dchp";

        const IP_CHECKBOX_NAME = "privateIp";
        const IPV4_NAME = "ipv4";
        const IPV6_NAME = "ipv6";
        const IPV4_MAPPED_IPV6 = "ipv4MappedIpv6";

        const CHECKED_ENDING = "Checked";
        const IPV4_CHECKED = IPV4_NAME + CHECKED_ENDING;
        const IPV6_CHECKED = IPV6_NAME + CHECKED_ENDING;
        const IPV4_MAPPED_CHECKED = IPV4_MAPPED_IPV6 + CHECKED_ENDING;

        const IP_NAME = "ip", NETMASK_NAME = "netmask";
        const GATEWAY_NAME = "gateway";
        const DNS1_NAME = "dns1", DNS2_NAME = "dns2";
        const ERROR_ENDING = "HasError", REFRESH_ENDING = "Refresh";


        this.state = {

            /* Section declaring the state properties for storing the "value" 
             JavaScript property and HTML attribute of input elements of the 
             matching "name" attributes */
            [ HOSTNAME_NAME ]: "", 
            [ DHCP_NAME ]:     false, 
            [ IP_NAME ]:       "", 
            [ NETMASK_NAME ]:  "", 
            [ GATEWAY_NAME ]:  "", 
            [ DNS1_NAME ]:     "", 
            [ DNS2_NAME ]:     "", 

            [ IPV4_CHECKED ]:        true, 
            [ IPV6_CHECKED ]:        false, 
            [ IPV4_MAPPED_CHECKED ]: false, 
            [ IP_CHECKBOX_NAME ]:    false, 

            /* Section declaring the state properties for storing whether or 
             not an input field the associated "name" attribute has an invalid 
             "value" JavaScript property. */
            [ HOSTNAME_NAME + ERROR_ENDING ]: false, 
            [ IP_NAME + ERROR_ENDING ]:       false, 
            [ NETMASK_NAME + ERROR_ENDING ]:  false, 
            [ GATEWAY_NAME + ERROR_ENDING ]:  false, 
            [ DNS1_NAME + ERROR_ENDING ]:     false, 
            [ DNS2_NAME + ERROR_ENDING ]:     false, 

            [ HOSTNAME_NAME + REFRESH_ENDING ]: false, 
            [ IP_NAME + REFRESH_ENDING ]:       false, 
            [ NETMASK_NAME + REFRESH_ENDING ]:  false, 
            [ GATEWAY_NAME + REFRESH_ENDING ]:  false, 
            [ DNS1_NAME + REFRESH_ENDING ]:     false, 
            [ DNS2_NAME + REFRESH_ENDING ]:     false, 

            processing: false, 
            inputRefresh: false, 
            loginDisappear: false
        }
    }

    render() {

        const ERROR_ENDING = "HasError", REFRESH_ENDING = "Refresh";

        const HOSTNAME_NAME = "hostname", HOSTNAME_TITLE = "Hostname";
        const HOSTNAME_ERROR = HOSTNAME_NAME + ERROR_ENDING;
        const HOSTNAME_REFRESH = HOSTNAME_NAME + REFRESH_ENDING;
        const HOSTNAME_REQUIRED = true;

        /* Specifies whether or not hostnames should be required to be 
         fully-qualified domain names. */
        const FULLY_QUALIFIED = false;

        const DHCP_NAME = "dhcp", DHCP_TITLE = "DHCP", DHCP_CHECKED = false;

        const IP_CHECKBOX_NAME = "privateIp";
        const IP_CHECKBOX_TITLE = "Private IP Address?";

        const IPV4_NAME = "ipv4", NUM_IPV4_OCTETS = 4;
        const IPV4_CIDR_REQUIRED = false;

        const IPV6_NAME = "ipv6";
        const IPV4_MAPPED_IPV6 = "ipv4MappedIpv6";

        const CHECKED_ENDING = "Checked";
        const IPV4_CHECKED = IPV4_NAME + CHECKED_ENDING;
        const IPV6_CHECKED = IPV6_NAME + CHECKED_ENDING;
        const IPV4_MAPPED_CHECKED = IPV4_MAPPED_IPV6 + CHECKED_ENDING;
        
        const NETMASK_NAME = "netmask";
        const GATEWAY_NAME = "gateway";
        const DNS1_NAME = "dns1", DNS2_NAME = "dns2";

        return (
            <form id = "networkForm">
                <HostnameInput 
                    name = { HOSTNAME_NAME } 
                    fieldTitle = { HOSTNAME_TITLE } 

                    value = {
                        this.state[ HOSTNAME_NAME ] 
                            ? this.state[ HOSTNAME_NAME ] 
                            : "" 
                    } 

                    updateParentState = { (newValue, hasError) => {
                        this.setState({
                            [ HOSTNAME_NAME ]: newValue, 
                            [ HOSTNAME_ERROR ]: hasError, 
                            [ HOSTNAME_REFRESH ]: false 
                        });
                    } }

                    required = { HOSTNAME_REQUIRED } 
                    fullyQualified = { FULLY_QUALIFIED }
                    disabled = { this.state.processing } 
                    inputRefresh = { this.state.inputRefresh } 
                    errorRefresh = { this.state[ HOSTNAME_REFRESH ] } 
                /> 

                <FormCheckbox 
                    name = { DHCP_NAME } 
                    fieldTitle = { DHCP_TITLE } 
                    checked = { DHCP_CHECKED } 
                    disabled = { this.state.processing } 

                    onChange = { (checked) => {
                        this.setState({ 
                            [ DHCP_NAME ]: checked 
                        });
                    } } 
                />

                <div 
                    id = { DHCP_NAME + "SettingsContainer" } 
                    className = { "toggleContainer multiContainerSizing " + ( 
                        this.state[ DHCP_NAME ] ? " toggleDisappearance" : ""  
                    ) } 
                >
                    <IpRadioButtons 
                        disabled = { this.state.processing } 
                        onChange = { (checkedName, newValue) => {
                            this.setState({
                                [ checkedName ]: newValue 
                            });
                        } } 
                    />

                    <FormCheckbox 
                        name =       { IP_CHECKBOX_NAME } 
                        fieldTitle = { IP_CHECKBOX_TITLE } 
                        checked =    { this.state[ IP_CHECKBOX_NAME ] } 
                        disabled =   { this.state.processing } 

                        onChange = { (checked) => {
                            this.setState({ 
                                [ IP_CHECKBOX_NAME ]: checked 
                            });
                        } } 
                    />

                    <Ipv4Input 
                        name =         { IPV4_NAME } 
                        fieldTitle =   { "IPv4 address" } 
                        typeChecked =  { this.state[ IPV4_CHECKED ] } 
                        numOctets =    { NUM_IPV4_OCTETS } 
                        onlyPrivate =  { this.state[ IP_CHECKBOX_NAME ] } 
                        cidrRequired = { IPV4_CIDR_REQUIRED } 
                        disabled =     { this.state.processing } 
                    /> 

                </div>
            </form>
        );
    }
}

export default Network;