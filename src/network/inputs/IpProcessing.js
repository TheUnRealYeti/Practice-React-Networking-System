
class IpInputProcessing {

    checkIpValue(newValue) {

        const stateVal = {};

        /* Coerces different data type input values to a String. */
        newValue = newValue === undefined || newValue === null 
            ? "" : String(newValue).trim();

        if (newValue) {

            stateVal.isEmpty = false;
        }
        else {

            const hasError = !!this.props.required;

            this.setState({ 
                hasError: hasError, 
                isEmpty: hasError 
            });

            this.props.updateParentState(newValue, hasError);
            return;
        }

        stateVal.ipv4Error = this.isIpv4Address(newValue, stateVal);

        if ( stateVal.ipv4Error ) {

            stateVal.hasError = stateVal.ipv4Error.hasError;
            stateVal.errorExit = this.state.hasError && !stateVal.hasError;
            this.setState(stateVal);
            this.props.updateParentState(newValue, stateVal.hasError);

            return;
        }

        newValue = newValue.toLowerCase();
        stateVal.ipv6Error = this.isIpv6Address(newValue, stateVal);

        if ( stateVal.ipv6Error ) {

            stateVal.hasError = stateVal.ipv6Error.hasError;
            stateVal.errorExit = this.state.hasError && !stateVal.hasError;
            this.setState(stateVal);
            this.props.updateParentState(newValue, stateVal.hasError);

            return;
        }
        
        stateVal.hasError = stateVal.neither = true;
        stateVal.errorExit = this.state.hasError && !stateVal.hasError;
        this.setState(stateVal);
        this.props.updateParentState(newValue, stateVal.hasError);
    }

    checkIpv4Address(newValue, stateVal) {

        /* A string contains a potential pattern for an IPv4 address if it has: 
           - Three sequences of one-to-three digits, each followed by a period 
             (.); 
           - One fourth, final sequence of one-to-three digits. 

           It can optionally contain: 
           - A left square bracket at the beginning ([); 
           - A CIDR range value, which is preceded by a forward slash (/) and 
             followed by a sequence of digits; 
           - A single port number or range between two port numbers, where the 
             port numbers are specified by digits. The first port number is 
             preceded by a right square bracket (]) and a colon (:), while 
             there is a hyphen (-) between the lower and upper port numbers. 
        */
        const generalRegex = new RegExp(
            "^\\[?" 
            + "(\\d{1,3}){3}\d{1,3}" 
            + "(\\/\\d+)?" 
            + "(\\]:\\d+(-\\d+)?)?$" 
        );

        if ( !generalRegex.test(newValue) ) {

            return false;
        }

        const stateVal = {}, octets = newValue.split(".");

        if ( this.props.onlyPrivate ) {

            stateVal.isPrivate = /^10./.test(newValue) 
                || /^172.1[6-9]./.test(newValue) 
                || /^172.2\d./.test(newValue) 
                || /^172.3[0-1]./.test(newValue) 
                || /^192.168./.test(newValue);
        }
        else {

            stateVal.isPrivate = true;
        }

        // Allow port and CIDRs checking for IPv4 addresses. 
        // https://www.ibm.com/docs/en/i/7.4?topic=concepts-ipv6-address-formats
        // https://en.wikipedia.org/wiki/Private_network
        // https://www.easycalculation.com/other/cidr-blocks-table.php
        // https://ip.sb/cidr/

        stateVal.octetTooBig = false;
        const octetRegex = /^(\d{1,2})$|^(1\d{2})$|^(2[1-4]\d)$|^(25[0-5])$/;
        let index = 0;

        while ( index < octets.length && !stateVal.octetTooBig ) {

            stateVal.octetTooBig = !octetRegex.test( octets[index] );
            index++;
        }

        stateVal.hasError = stateVal.onlyPrivate || stateVal.octetTooBig;
        return stateVal;
    }

    checkIpv6Address(newValue) {
        
        /* Optionally contains: 
           - Between one and seven leading 16-bit sections with a colon at the 
             end; 
           - double colons to indicate that any 16-bit sections contained 
             between are zeros;  
           - Between one and seven trailing 16-bit sections with a colon at the 
             end; 
           - One 16-bit trailing section with no following colon; or 
           - An IPv4 address; 
           - A CIDR digit value preceded by a forward slash (/); 
           - A port number, preceded by a left square bracket (]) and a 
             colon (:), at the end; or a port range, with the second value 
             preceded by a hyphen (-). 
           Further validation for IPv6 address formats are conducted after this 
           check.
        */
        const generalRegex = new RegExp( 
            "^\\[?([a-f\\d]{1,4}:){0,7}" 
            + "(::)?" 
            + "([a-f\\d]{1,4}:){0,7}" 
            + "([a-f\\d]{1,4}|" 
            + "((\\d{1,3}\.){3}\\d{1,3}))?" 
            + "(\\/[\\d]+)?" 
            + "(]:[\\d]+(-[\\d]+)?)?$" 
        );
        
        if ( !generalRegex.test(newValue) ) {

            return false;
        }

        const stateVal = {};
        let result = this.ipv6ConsecColons(stateVal, newValue);

        if (result) {

            return stateVal;
        }

        result = this.ipv6DoubleColons(stateVal, newValue);

        if (result) {

            return stateVal;
        }

        // Program private IPv6 address range check. 
        // https://en.wikipedia.org/wiki/Private_network
        const [ splitStr, hasBracket, bracketIndex, slashIndex ] = 
            this.getDelimInfo( newValue, stateVal );

        if ( !splitStr ) {

            return stateVal;
        }

        const sections = splitStr.split(":");
        stateVal.tooFew = sections.length < 7;
        stateVal.tooMany = sections.length > 8;

        if ( stateVal.tooFew || stateVal.tooMany ) {

            this.checkPortSection(newValue, hasBracket, bracketIndex, stateVal);
            return stateVal;
        }

        this.checkFullIpv6Cidr({
            newValue: newValue, 
            sections: sections, 
            bracketIndex: bracketIndex, 
            slashIndex: slashIndex 
        }, stateVal);

        this.checkPortSection(newValue, hasBracket, bracketIndex, stateVal);

        stateVal.hasError = stateVal.cidrNumberTooLarge 
            || stateVal.cidrIpTooLarge || stateVal.portTooLarge 
            || stateVal.portsEqual || stateVal.lowerLarger;

        return stateVal;
    }

    checkFullIpv6Cidr(paramObj, stateVal) {

        let slashIndex = newValue.indexOf("/");

        if ( slashIndex === -1 ) {

            return;
        }

        slashIndex++;
        const cidr = paramObj.bracketIndex > 1 
            ? newValue.substring( slashIndex, paramObj.bracketIndex ) 
            : newValue.substring( slashIndex );

        const cidrNumRegex = /^(\d{1,2})$|^(1[0-1]\d)$|^(12[0-8])$/;
        stateVal.cidrNumberTooLarge = cidrNumRegex.test(newValue);

        if ( stateVal.cidrNumberTooLarge ) {

            return;
        }

        const sections = paramObj.sections;
        const shorter = sections.length === 7, length = shorter ? 6 : 8;
        let stripped = this.stripIpv6FullHex(sections, length);

        if (shorter) {

            stripped += this.ipv4ToHex( sections[length] );
        }

        const keyIndex = this.getLastNonZero(stripped);
        const numZeros = stripped.length - keyIndex - 1;
        const numCidrHex = parseInt(cidr, 16) >> 4;

        stateVal.cidrIpTooLarge = numZeros === numCidrHex;
    }

    ipv6ConsecColons(stateVal, newValue) {
        
        stateVal.tooManyColons = /:{3,}/.test(newValue);

        if ( stateVal.tooManyColons ) {

            stateVal.hasError = true;
        }

        return stateVal.tooManyColons;
    }

    ipv6DoubleColons(stateVal, newValue) {

        const doubleColons = "::";
        const doubleIndex = newValue.indexOf(doubleColons);

        if ( doubleIndex === -1 ) {

            return false;
        }

        const lastDouble = newValue.lastIndexOf(doubleColons);
        stateVal.multiDouble = doubleIndex !== lastDouble;

        if ( stateVal.multiDouble ) {

            stateVal.hasError = true;
            return true;
        }

        const [ splitStr, hasBracket, bracketIndex, slashIndex ] = 
            this.getDelimInfo( newValue, stateVal );

        if ( !splitStr ) {

            return stateVal;
        }

        const lowerStr = splitStr.substring(0, doubleIndex);
        const lowerSections = lowerStr.split(":");
        const numLower = lowerSections.length > 1 
            ? lowerSections.length : 0;

        const higherStr = splitStr.substring( 
            doubleIndex + doubleColons.length 
        );
        
        const higherSections = higherStr.split(":");
        const numHigher = higherSections.length > 1 
            ? higherSections.length : 0;

        const totalSections = numLower + numHigher;
        stateVal.tooManySections = totalSections > 7;

        if ( stateVal.tooManySections ) {

            stateVal.hasError = true;
            return true;
        }

        if ( !totalSections ) {

            stateVal.hasError = false;
            return true;
        }

        const ivp6SectionRegex = /^([a-f\d]{1,4}:)*[a-f\d]{1,4}$/;
        const ipv4EndRegex = /^([a-f\d]{1,4}:)*(\d{1,3}\.){3}\d{1,3}/;
        
        if ( ipv4EndRegex.test(higherStr) ) {

            stateVal.sectionWrong = !ivp6SectionRegex.test(lowerStr);
        }
        else {

            stateVal.sectionWrong = !ivp6SectionRegex.test(lowerStr) 
                && !ivp6SectionRegex.test(higherStr);
        }

        this.checkShortIpv6Cidr({
            newValue: newValue, 
            lowerSections: lowerSections, 
            higherSections: higherSections, 
            totalSections: totalSections, 
            bracketIndex: bracketIndex, 
            slashIndex: slashIndex 
        }, stateVal);
        
        this.checkPortSection(newValue, hasBracket, bracketIndex, stateVal);

        stateVal.hasError = stateVal.sectionWrong 
            || stateVal.cidrNumberTooLarge || stateVal.cidrIpTooLarge 
            || stateVal.portTooLarge || stateVal.portsEqual 
            || stateVal.lowerLarger;
        
        return true;
    }

    checkShortIpv6Cidr(paramObj, stateVal) {

        let slashIndex = paramObj.slashIndex;

        if ( slashIndex === -1 ) {

            return;
        }

        slashIndex++;
        const cidr = paramObj.bracketIndex > 1 
            ? newValue.substring( slashIndex, paramObj.bracketIndex ) 
            : newValue.substring( slashIndex );

        const cidrNumRegex = /^(\d{1,2})$|^(1[0-1]\d)$|^(12[0-8])$/;
        stateVal.cidrNumberTooLarge = cidrNumRegex.test(newValue);

        if ( stateVal.cidrNumberTooLarge ) {

            return;
        }

        const numCidrHex = parseInt(cidr, 16) >> 4;
        const numOmitted = 32 - (paramObj.totalSections << 2);
        const lowerSections = paramObj.lowerSections;

        let stripped = this.stripIpv6FullHex(lowerSections, 
            lowerSections.length);

        stripped += "0".repeat(numOmitted);

        const higherSections = paramObj.higherSections;

        const hasIpv4 = higherSections.length 
            && higherSections[ higherSections.length - 1 ].indexOf(".") > 0;
        
        const highLen = hasIpv4 ? higherSections.length - 1 
            : higherSections.length;

        stripped += this.stripIpv6FullHex(higherSections, highLen);

        if (hasIpv4) {

            stripped += this.ipv4ToHex( sections[highLen] );
        }

        const keyIndex = this.getLastNonZero(stripped);
        const numZeros = stripped.length - keyIndex - 1
        stateVal.cidrIpTooLarge = numZeros === numCidrHex;
    }

    stripIpv6FullHex(sections, length) {

        let stripped = "";

        for ( let index = 0; index < length; index++ ) {

            const section = sections[index];
            stripped += "0".repeat(4 - section.length) + section;
        }

        return stripped;
    }

    ipv4ToHex(ipv4Str) {

        const octets = ipv4Str.split(".");
        let hexStr = "";

        for ( let index = 0; index < octets.length; index++ ) {

            const hexEntry = Number( octets[index] ).toString(16);
            hexStr += hexEntry.length === 2 ? hexEntry : "0" + hexEntry;
        }

        return hexStr;
    }

    getLastNonZero(stripped) {

        let keyIndex = stripped.length - 1;

        while ( keyIndex >= 0 ) {

            if ( stripped[keyIndex] !== "0" ) {

                break;
            }

            keyIndex--;
        }

        return keyIndex;
    }

    getDelimInfo(newValue, stateVal) {

        const hasBracket = newValue.charAt(0) === "[";
        const slashIndex = newValue.indexOf("/");
        const bracketIndex = newValue.indexOf("]");

        if ( hasBracket ) {

            stateVal.otherBracket = bracketIndex > 1;

            if ( stateVal.otherBracket ) {

                stateVal.hasError = true;
                splitStr = null;
            }
            else if ( slashIndex > 1 ) {

                splitStr = newValue.substring(1, slashIndex);
            }
            else {

                splitStr = newValue.substring(1, bracketIndex);
            }
        }
        else if ( bracketIndex >= 0 ) {

            stateVal.hasError = stateVal.otherBracket = true;
            splitStr = null;
        }
        else if ( slashIndex > 1 ) {

            splitStr = newValue.substring(1, slashIndex);
        }
        else {

            splitStr = newValue;
        }

        return [ splitStr, hasBracket, bracketIndex, slashIndex ];
    }

    checkPortSection(newValue, hasBracket, bracketIndex, stateVal) {

        if ( !hasBracket ) {

            return;
        }

        const portSection = newValue.substring(bracketIndex + 2);
        const dashIndex = portSection.indexOf("-");

        if (dashIndex >= 0) {

            const lowerPort = this.checkPortNumber( 
                portSection.substring(0, dashIndex), stateVal 
            );

            const higherPort = this.checkPortNumber( 
                portSection.substring(dashIndex + 1), stateVal 
            );

            if ( lowerPort !== -1 && higherPort !== -1 ) {

                stateVal.portsEqual = lowerPort === higherPort;
                stateVal.lowerLarger = lowerPort > higherPort;
            }
        }
        else {

            this.checkPortNumber( portSection, stateVal );
        }
    }

    checkPortNumber(portNumber, stateVal) {

        if ( portNumber.length > 5 ) {

            stateVal.portTooLarge = true;
            return -1;
        }

        portNumber = Number(portNumber);

        if ( isNaN(portNumber) || portNumber > 65535 ) {

            stateVal.portTooLarge = true;
            return -1;
        }

        return portNumber;
    }
}
