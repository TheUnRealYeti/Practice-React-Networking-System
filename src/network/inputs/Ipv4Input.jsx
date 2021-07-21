/* Core React import section */
import React from "react";

/* Custom Components import section */
import Ipv4AllOctetErrors from "../errors/Ipv4AllOctetErrors";
import Ipv4CidrErrors     from "../errors/Ipv4CidrErrors";

class Ipv4Input extends React.Component {

    constructor(props) {

        super(props);
        const ERROR_ENDING = "Error", ERROR_EXIT_ENDING = "ErrorExit";
        const OCTET_NAME = "octet", CIDR_NAME = "cidr";
        this.state = {};

        for ( let index = 1; index <= this.props.numOctets; index++ ) {

            this.state[ OCTET_NAME + index ] = "";

            this.state[ OCTET_NAME + index + ERROR_ENDING ] = {
                hasError: false, 
                isEmpty: false, 
                tooLong: false, 
                nonDigit: false, 
                tooLarge: false, 
                notPrivate: false 
            };
        }

        this.state[ OCTET_NAME + ERROR_EXIT_ENDING ] = false;
        this.state[ CIDR_NAME ] = "";

        this.state[ CIDR_NAME + ERROR_ENDING ] = {
            hasError: false, 
            isEmpty: false, 
            tooManyChar: false, 
            nonDigit: false, 
            numTooLarge: false, 
            rangeTooLarge: false 
        };

        this.state[ CIDR_NAME + ERROR_EXIT_ENDING ] = false;
    }

    isPressedKeyDigit = (event) => {

        let key = event.key || event.which || event.charCode || event.keyCode;
        const isString = typeof key === "string";

        if (isString) {

            key = key.toLowerCase();
        }

        switch (key) {

            case 8:  // Backspace key 
            case 9:  // Tab key 
            case 35: // End key 
            case 36: // Home key 
            case 37: // Left arrow key 
            case 39: // Right arrow key 
            case 46: // Delete key 
            case "arrowleft":
            case "arrowright":
            case "backspace":
            case "del":
            case "delete":
            case "end":
            case "home":
            case "left":
            case "right":
            case "tab": 
                return true;

            default: 
                    
                if (isString) {

                    if ( /^\d$/.test(key) ) {

                        return true;
                    }

                    event.preventDefault();
                    return false;
                }
                
                if ( key >= 48 && key <= 57 ) {

                    return true;
                }

                event.preventDefault();
                return false;
        }
    }

    checkOctetValue( event, propName, octetIndex, returnErrorObj ) {

        const OCTET_MAX_LENGTH = 3, OCTET_MAX_NUM = 255, OCTET_MAX_STR = "255";
        const ERROR_ENDING = "Error";

        const errorObj = {
            isEmpty: !event || !event.target || !event.target.value, 
        };

        let strVal;

        if ( errorObj.isEmpty ) {

            errorObj.tooLong = errorObj.nonDigit = errorObj.tooLarge = false;
            strVal = "";
        }
        else {

            strVal = event.target.value;
            errorObj.tooLong = strVal.length > OCTET_MAX_LENGTH;

            if ( errorObj.tooLong ) {

                strVal = strVal.substring(0, OCTET_MAX_LENGTH);
            }

            errorObj.nonDigit = /[^\d]/.test(strVal);

            if ( errorObj.nonDigit ) {

                errorObj.tooLarge = false;
            }
            else {

                const numVal = Number( strVal );
                errorObj.tooLarge = numVal > OCTET_MAX_NUM;
                strVal = errorObj.tooLarge ? OCTET_MAX_STR : String( numVal );
            }
        }

        this.checkCidrOnOctetChange();

        if ( returnErrorObj ) {

            return [ strVal, errorObj ];
        }

        errorObj.notPrivate = false;

        errorObj.hasError = errorObj.isEmpty || errorObj.tooLong 
            || errorObj.nonDigit || errorObj.tooLarge;
        
        const exitVal = this.checkOctetErrorExit( 
            errorObj.hasError, octetIndex 
        );

        this.setState({
            [ propName ]: strVal, 
            [ propName + ERROR_ENDING ]: errorObj, 
            octetErrorExit: exitVal 
        });

        return [ null, null ];
    }

    checkCidrOnOctetChange() {

        const ERROR_ENDING = "Error", ERROR_EXIT_ENDING = "ErrorExit";
        const CIDR_NAME = "cidr", CIDR_ERROR = CIDR_NAME + ERROR_ENDING;
        const CIDR_ERROR_EXIT = CIDR_NAME + ERROR_EXIT_ENDING;
        const HAS_ERROR_PROP = "hasError";
        const cidrVal = this.state[ CIDR_NAME ];

        if ( !cidrVal ) {

            return;
        }

        const cidrErrorObj = this.state[ CIDR_ERROR ];
        cidrErrorObj.rangeTooLarge = this.checkCidrSum( cidrVal );
        const hadError = this.state[ HAS_ERROR_PROP ];
        let currentError = false;

        for ( let prop in cidrErrorObj ) {

            if ( prop !== HAS_ERROR_PROP ) {

                currentError = currentError || cidrErrorObj[prop];
            }
        }

        cidrErrorObj[ HAS_ERROR_PROP ] = currentError;
        const exitVal = hadError && !currentError;

        this.setState({
            [ CIDR_ERROR ]: cidrErrorObj, 
            [ CIDR_ERROR_EXIT ]: exitVal 
        });
    }

    checkOctet1Value( event, octet1Prop, octet2Prop ) {
        
        const [ strVal, errorObj ] = this.checkOctetValue( 
            event, octet1Prop, 1, this.props.onlyPrivate  
        );

        if ( this.props.onlyPrivate && typeof strVal === "string" ) {

            const octet2Val = this.state[ octet2Prop ];

            if ( octet2Val ) {

                const ipRegex = new RegExp( 
                    "^0[\\d]{1,3}$" 
                    + "|^10[\\d]{1,3}$" 
                    + "|^1006[4-9]$|^100[7-9]\\d$|^1001[0-1]\\d$|^10012[0-7]$" 
                    + "|^127[\\d]{1,3}$" 
                    + "|^169254$" 
                    + "|^1721[6-9]$|^1722\\d$|^1723[0-1]$" 
                    + "|^192168$" 
                    + "|^1981[8-9]$" 
                );

                errorObj.notPrivate = !ipRegex.test( strVal + octet2Val );
            }
            else {

                const ipRegex = new RegExp(
                    "^0$|^10$|^100$|^127$|^169$|^172$|^192$|^198$"
                );

                errorObj.notPrivate = !ipRegex.test(strVal);
            }
            
            errorObj.hasError = errorObj.isEmpty || errorObj.tooLong 
                || errorObj.nonDigit || errorObj.tooLarge 
                || errorObj.notPrivate;

            const exitVal = this.checkOctetErrorExit( errorObj.hasError, 1 );

            this.setState({
                [ octet1Prop ]: strVal, 
                [ octet1Prop + "Error" ]: errorObj, 
                octetErrorExit: exitVal 
            });
        }
    }

    checkOctet2Value( event, octet1Prop, octet2Prop ) {

        const [ strVal, errorObj ] = this.checkOctetValue( 
            event, octet2Prop, 2, this.props.onlyPrivate  
        );

        if ( this.props.onlyPrivate && typeof strVal === "string" ) { 
             
            if ( this.state[ octet1Prop ] && strVal ) {

                const ipRegex = new RegExp( 
                    "^0[\\d]{1,3}$" 
                    + "|^10[\\d]{1,3}$" 
                    + "|^1006[4-9]$|^100[7-9]\\d$|^1001[0-1]\\d$|^10012[0-7]$" 
                    + "|^127[\\d]{1,3}$" 
                    + "|^169254$" 
                    + "|^1721[6-9]$|^1722\\d$|^1723[0-1]$" 
                    + "|^192168$" 
                    + "|^1981[8-9]$" 
                );

                const ipStart = this.state[ octet1Prop ] + strVal;
                errorObj.notPrivate = !ipRegex.test( ipStart );

                errorObj.hasError = errorObj.isEmpty || errorObj.tooLong 
                    || errorObj.nonDigit || errorObj.tooLarge 
                    || errorObj.notPrivate;
            }
            else {

                errorObj.notPrivate = false;
                errorObj.hasError = errorObj.isEmpty || errorObj.tooLong 
                    || errorObj.nonDigit || errorObj.tooLarge;
            }

            const exitVal = this.checkOctetErrorExit( errorObj.hasError, 2 );

            this.setState({
                [ octet2Prop ]: strVal, 
                [ octet2Prop + "Error" ]: errorObj, 
                octetErrorExit: exitVal 
            });
        }
    }

    checkOctetErrorExit( octetHasError, octetIndex ) {

        const OCTET_NAME = "octet", ERROR_ENDING = "Error";
        const HAS_ERROR_PROP = "hasError";
        let prevError = false, currentError = false;

        for ( let index = 1; index <= this.props.numOctets; index++ ) {

            const errorProp = OCTET_NAME + index + ERROR_ENDING;
            const indexError = this.state[ errorProp ][ HAS_ERROR_PROP ];

            currentError = currentError || ( index === octetIndex 
                ? octetHasError : indexError );
            prevError = prevError || indexError;
        }

        return prevError && !currentError;
    }

    checkCidrValue(event) {

        const CIDR_MAX_LENGTH = 2, CIDR_MAX_NUM = 32, CIDR_MAX_STR = "32";
        const errorObj = {}, CIDR_PROP = "cidr";

        errorObj.isEmpty = this.props.cidrRequired  
            && ( !event || !event.target || !event.target.value );

        let strVal;

        if ( errorObj.isEmpty ) {

            errorObj.tooManyChar = errorObj.nonDigit = false;
            errorObj.numTooLarge = false;
            strVal = "";
        }
        else {

            strVal = event.target.value;
            errorObj.tooManyChar = strVal.length > CIDR_MAX_LENGTH;

            if ( errorObj.tooManyChar ) {

                strVal = strVal.substring( 0, CIDR_MAX_LENGTH );
            }

            errorObj.nonDigit = /[^\d]/.test(strVal);

            if ( errorObj.nonDigit || !strVal ) {

                errorObj.numTooLarge = false;
            }
            else {

                const numVal = Number( strVal );
                errorObj.numTooLarge = numVal > CIDR_MAX_NUM;
                strVal = errorObj.numTooLarge ? CIDR_MAX_STR 
                    : String( numVal );
            }
        }

        errorObj.rangeTooLarge = this.checkCidrSum( strVal );

        errorObj.hasError = errorObj.isEmpty || errorObj.tooManyChar 
            || errorObj.nonDigit || errorObj.numTooLarge 
            || errorObj.rangeTooLarge;
        
        const errorProp = CIDR_PROP + "Error";
        const errorExit = CIDR_PROP + "ErrorExit";
        const exitVal = this.state[ errorProp ].hasError && !errorObj.hasError;

        this.setState({
            [ CIDR_PROP ]: strVal, 
            [ errorProp ]: errorObj, 
            [ errorExit ]: exitVal 
        });
    }

    checkCidrSum( cidrStr ) {

        if ( !cidrStr ) {

            return false;
        }

        const cidrPower = Number(cidrStr);

        if ( isNaN(cidrPower) ) {

            return false;
        }

        const OCTET_MAX = 255, OCTET_NAME = "octet";
        const IPV4_MAX = 4294967296; // 255.255.255.255 as a Number 
        let hexStr = "0x", ipStr = "";

        for ( let index = 1; index <= this.props.numOctets; index++ ) {

            const octetProp = OCTET_NAME + index;
            const octetVal = this.state[ octetProp ];

            if ( octetVal && /^\d{1,3}$/.test( octetVal ) ) {

                const numEntry = Number( octetVal );

                if ( numEntry > OCTET_MAX ) {

                    return false;
                }

                const hexEntry = numEntry.toString(16);
                hexStr += hexEntry.length === 2 ? hexEntry : "0" + hexEntry;
                ipStr += octetVal;
                
                if ( index < this.props.numOctets ) {

                    ipStr += ".";
                }
            }
            else {

                return false;
            }
        }
        
        const ipNum = parseInt( hexStr, 16 );
        const cidrNum = Math.pow( 2, 32 - cidrPower );
        let ipMax = IPV4_MAX;

        if ( this.props.onlyPrivate ) {

            if ( /^0./.test(ipStr) ) {

                ipMax = 16777215; // 0.255.255.255 as a Number 
            }
            else if ( /^10./.test(ipStr) ) {

                ipMax = 184549375; // 10.255.255.255 as a Number 
            }
            else if ( /^100./.test(ipStr) ) {

                ipMax = 1686110207; // 100.127.255.255 as a Number 
            }
            else if ( /^127./.test(ipStr) ) {

                ipMax = 2147483647; // 127.255.255.255 as a Number 
            }
            else if ( /^169.254./ ) {

                ipMax = 2852061183; // 169.254.255.255 as a Number 
            }
            else if ( /^172.1[6-9]|^172.2\d.|^173.3[0-1]/.test(ipStr) ) {

                ipMax = 2887778303; // 172.31.255.255 as a Number 
            }
            else if ( /^192.168./.test(ipStr) ) {

                ipMax = 3232301055; // 192.168.255.255 as a Number 
            }
            else if ( /^198.1[8-9]./.test(ipStr) ) {

                ipNum = 3323199487; // 198.19.255.255 as a Number 
            }
        }

        return ipNum + cidrNum > ipMax;
    }

    render() {

        // Figure out why octet inputs only accept one digit key input before 
        // losing focus. 
        const OCTET_MAX_LENGTH = 3, OCTET_MAX_NUM = 255;
        const OCTET_LOWER = "octet", OCTET_UPPER = "Octet";
        const INPUT_ENDING = "InputField";
        const CIDR_MAX_LENGTH = 2, CIDR_MAX_NUM = 32; 

        const OCTET_1_PROP = OCTET_LOWER + "1";
        const OCTET_2_PROP = OCTET_LOWER + "2";
        const OCTET_3_PROP = OCTET_LOWER + "3";
        const OCTET_4_PROP = OCTET_LOWER + "4";

        const OCTET_1_NAME = this.props.name + OCTET_UPPER + "1";
        const OCTET_2_NAME = this.props.name + OCTET_UPPER + "2";
        const OCTET_3_NAME = this.props.name + OCTET_UPPER + "3";
        const OCTET_4_NAME = this.props.name + OCTET_UPPER + "4";

        const LABEL_CLASS_NAME = "fieldLabel";
        const PERIOD_CLASS_NAME = "labelBetweenText";
        const OCTET_CLASS_NAME = "octetInputField";
        const HALF_INPUT_CLASS = "halfInputField";
        const SMALL_COLOR_CLASS = "smallInputColors";
        const INVALID_CLASS_NAME = "invalidInput";
        const OCTET_INPUT_TYPE = "text";

        const CIDR_LOWER = "cidr", CIDR_UPPER = "Cidr";
        const CIDR_NAME = this.props.name + "CidrRange";
        const CIDR_ID = CIDR_NAME + INPUT_ENDING;

        const OCTET_1_PLACEHOLDER = OCTET_UPPER + " 1";
        const OCTET_2_PLACEHOLDER = OCTET_UPPER + " 2";
        const OCTET_3_PLACEHOLDER = OCTET_UPPER + " 3";
        const OCTET_4_PLACEHOLDER = OCTET_UPPER + " 4";
        const CIDR_PLACEHOLDER = "CIDR";

        const ERROR_ENDING = "Error", HAS_ERROR_PROP = "hasError";
        const ERROR_EXIT_ENDING = "ErrorExit";

        const OCTET_1_ERROR = OCTET_1_PROP + ERROR_ENDING;
        const OCTET_2_ERROR = OCTET_2_PROP + ERROR_ENDING;
        const OCTET_3_ERROR = OCTET_3_PROP + ERROR_ENDING;
        const OCTET_4_ERROR = OCTET_4_PROP + ERROR_ENDING;
        const OCTET_ERROR_EXIT = OCTET_LOWER + ERROR_EXIT_ENDING;

        const CIDR_ERROR = CIDR_LOWER + ERROR_ENDING;
        const CIDR_ERROR_EXIT = CIDR_LOWER + ERROR_EXIT_ENDING;
        
        const OCTET_WRAPPER_ID = this.props.name + "OctetWrapper";

        return (
            <div 
                id = { this.props.name + "InputContainer" } 
                className = { "toggleContainer subContainerSizing " + (
                    this.props.typeChecked ? "" : " toggleDisappearance" 
                ) }
            >
                <label 
                    id = { this.props.name + "FieldLabel" } 
                    className = { LABEL_CLASS_NAME } 
                    htmlFor = { this.props.name + "OctetWrapper" } 
                >
                    Enter each octet of { this.props.fieldTitle } here: 
                </label> 

                <div 
                    id = { OCTET_WRAPPER_ID } 
                    className = "octetInputWrapper" 
                >
                    <input 
                        id = { this.props.name + INPUT_ENDING } 

                        className = { OCTET_CLASS_NAME + " " + (
                            this.state[ OCTET_1_ERROR ][ HAS_ERROR_PROP ] 
                                ? INVALID_CLASS_NAME 
                                : SMALL_COLOR_CLASS 
                        ) } 

                        type =        { OCTET_INPUT_TYPE } 
                        name =        { OCTET_1_NAME } 
                        placeholder = { OCTET_1_PLACEHOLDER } 
                        maxLength =   { OCTET_MAX_LENGTH } 
                        pattern =     { "\\d{1," + OCTET_MAX_LENGTH + "}" } 
                        required =    { this.props.typeChecked } 
                        disabled =    { this.props.disabled } 
                        value =       { this.state[ OCTET_1_PROP ] } 
                        onKeyDown = { this.isPressedKeyDigit } 

                        onChange = { (event) => {
                            this.checkOctet1Value( 
                                event, OCTET_1_PROP, OCTET_2_PROP 
                            );
                        } } 
                    />

                    <span 
                        id = { OCTET_LOWER + "1Period" } 
                        className = { PERIOD_CLASS_NAME } 
                    >
                        .
                    </span>

                    <input 
                        id = { OCTET_2_NAME + INPUT_ENDING } 

                        className = { OCTET_CLASS_NAME + " " + (
                            this.state[ OCTET_2_ERROR ][ HAS_ERROR_PROP ] 
                                ? INVALID_CLASS_NAME 
                                : SMALL_COLOR_CLASS 
                        ) } 

                        type =        { OCTET_INPUT_TYPE } 
                        name =        { this.props.name } 
                        placeholder = { OCTET_2_PLACEHOLDER } 
                        maxLength =   { OCTET_MAX_LENGTH } 
                        pattern =     { "\\d{1," + OCTET_MAX_LENGTH + "}" } 
                        required =    { this.props.typeChecked } 
                        disabled =    { this.props.disabled } 
                        value =       { this.state[ OCTET_2_PROP ] } 
                        onKeyDown =   { this.isPressedKeyDigit } 

                        onChange = { (event) => {
                            this.checkOctet2Value( 
                                event, OCTET_1_PROP, OCTET_2_PROP 
                            );
                        } } 
                    /> 

                    <span 
                        id = { OCTET_LOWER + "2Period" } 
                        className = { PERIOD_CLASS_NAME } 
                    >
                        .
                    </span>

                    <input 
                        id = { OCTET_3_NAME + INPUT_ENDING } 

                        className = { OCTET_CLASS_NAME + " " + (
                            this.state[ OCTET_3_ERROR ][ HAS_ERROR_PROP ] 
                                ? INVALID_CLASS_NAME 
                                : SMALL_COLOR_CLASS 
                        ) } 

                        type =        { OCTET_INPUT_TYPE } 
                        name =        { OCTET_3_NAME } 
                        placeholder = { OCTET_3_PLACEHOLDER } 
                        maxLength =   { OCTET_MAX_LENGTH } 
                        pattern =     { "\\d{1," + OCTET_MAX_LENGTH + "}" } 
                        required =    { this.props.typeChecked } 
                        disabled =    { this.props.disabled } 
                        value =       { this.state[ OCTET_3_PROP ] } 
                        onKeyDown =   { this.isPressedKeyDigit } 

                        onChange = { (event) => {
                            this.checkOctetValue( event, OCTET_3_PROP, 3 );
                        } } 
                    /> 

                    <span 
                        id = { OCTET_LOWER + "3Period" } 
                        className = { PERIOD_CLASS_NAME } 
                    >
                        .
                    </span>

                    <input 
                        id = { OCTET_4_NAME + INPUT_ENDING } 

                        className = { OCTET_CLASS_NAME + " " + (
                            this.state[ OCTET_4_ERROR ][ HAS_ERROR_PROP ] 
                                ? INVALID_CLASS_NAME 
                                : SMALL_COLOR_CLASS 
                        ) } 

                        type =        { OCTET_INPUT_TYPE } 
                        name =        { OCTET_4_NAME } 
                        placeholder = { OCTET_4_PLACEHOLDER } 
                        maxLength =   { OCTET_MAX_LENGTH } 
                        pattern =     { "\\d{1," + OCTET_MAX_LENGTH + "}" } 
                        required =    { this.props.typeChecked } 
                        disabled =    { this.props.disabled } 
                        value =       { this.state[ OCTET_4_PROP ] } 
                        onKeyDown =   { this.isPressedKeyDigit } 

                        onChange = { (event) => {
                            this.checkOctetValue( event, OCTET_4_PROP, 4 );
                        } } 
                    /> 

                    <Ipv4AllOctetErrors 
                        inputName = { this.props.name } 
                        inputId =   { OCTET_WRAPPER_ID } 
                        numOctets = { this.props.numOctets } 
                        maxLength = { OCTET_MAX_LENGTH } 
                        maxNum =    { OCTET_MAX_NUM } 

                        hasError = { 
                            this.state[ OCTET_1_ERROR ][ HAS_ERROR_PROP ] 
                            || this.state[ OCTET_2_ERROR ][ HAS_ERROR_PROP ] 
                            || this.state[ OCTET_3_ERROR ][ HAS_ERROR_PROP ] 
                            || this.state[ OCTET_4_ERROR ][ HAS_ERROR_PROP ] 
                        } 

                        errorExit = { 
                            this.state[ OCTET_ERROR_EXIT ] 
                        } 

                        errorRefresh = { this.props.errorRefresh } 
                        octet1Error =  { this.state[ OCTET_1_ERROR ] } 
                        octet2Error =  { this.state[ OCTET_2_ERROR ] } 
                        octet3Error =  { this.state[ OCTET_3_ERROR ] } 
                        octet4Error =  { this.state[ OCTET_4_ERROR ] } 
                    />
                </div>
                
                <div 
                    id = { this.props.name + CIDR_UPPER + "Container" } 
                    className = "halfContainer" 
                >
                    <label 
                        id = { this.props.name + CIDR_UPPER + INPUT_ENDING } 
                        className = { LABEL_CLASS_NAME } 
                        htmlFor =   { CIDR_ID } 
                    >
                        CIDR Range ({ 
                            this.props.cidrRequired ? "Required" : "Optional" 
                        }):
                    </label>

                    <input 
                        id = { CIDR_ID } 

                        className = { HALF_INPUT_CLASS + " " + (
                            this.state[ CIDR_ERROR ][ HAS_ERROR_PROP ] 
                                ? INVALID_CLASS_NAME 
                                : SMALL_COLOR_CLASS 
                        ) } 

                        type =        "text" 
                        name =        { CIDR_NAME } 
                        placeholder = { CIDR_PLACEHOLDER } 
                        pattern =     { "\\d{1," + CIDR_MAX_LENGTH + "}" } 
                        maxLength =   { CIDR_MAX_LENGTH } 
                        value =       { this.state[ CIDR_LOWER ] } 
                        required =    { this.props.cidrRequired } 
                        onKeyDown =   { this.isPressedKeyDigit } 

                        onChange = { (event) => {
                            this.checkCidrValue(event); 
                        } } 
                    /> 

                    <Ipv4CidrErrors 
                        inputId =      { CIDR_ID } 
                        inputName =    { CIDR_NAME } 
                        fieldTitle =   { CIDR_PLACEHOLDER } 
                        maxLength =    { CIDR_MAX_LENGTH } 
                        maxNum =       { CIDR_MAX_NUM } 
                        cidrErrors =   { this.state[ CIDR_ERROR ] } 
                        errorExit =    { this.state[ CIDR_ERROR_EXIT ] } 
                        errorRefresh = { this.props.errorRefresh } 
                    />
                </div>
                
            </div>
        );
    }
}

export default Ipv4Input;