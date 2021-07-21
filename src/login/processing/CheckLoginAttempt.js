
class CheckLoginAttempt {

    /* - Test session verification functions. 
       - If session is already active, add code to extend the life of the 
         session, starting from the current time. 
    */
    constructor(username, password) {

        this.username = username;
        this.password = password.substring(0, 4096);
        this.numHashIter = 5000;
    }

    async checkAccount() {

        let result = this.checkLoginLocalStorage();

        if (result !== null) {

            return result;
        }

        result = this.checkLoginCookie();

        if (result !== null) {

            return result;
        }

        throw new ReferenceError("No JavaScript APIs found for storing login " 
            + "information.");
    }

    async checkLoginLocalStorage() {

        if ( !this.hasLocalStorage() ) {

            return null;
        }

        const recordName = "reactTest_" + this.username;
        let record = localStorage.getItem(recordName);
        
        if (record) {
            
            try {

                record = JSON.parse(record);
            }
            catch (error) {

                console.error(error);
                return this.createAccount();
            }

            if ( record.password && record.salt ) {

                const hashResult = await this.hashPassword(
                    this.password + record.salt, this.numHashIter 
                );
    
                return hashResult === record.password;
            }
        }

        return this.createAccount();
    }

    hasLocalStorage() {

        const TEST_KEY = "enabled";

        if (!localStorage) {

            localStorage = window.localStorage;
        }

        if ( !localStorage || !JSON || !JSON.stringify || !JSON.parse ) {

            return false;
        }

        try {

            localStorage.setItem(TEST_KEY, "true");
        }
        catch (error) {

            console.error(error);
            return false;
        }

        localStorage.removeItem(TEST_KEY);
        return true;
    }

    async checkLoginCookie() {

        const recordName = "reactTest_" + this.username;

        if ( !this.supportsCookies() ) {
            
            return null;
        }

        let contents = document.cookie;
        let cookieIndex = contents.indexOf(recordName + "=");

        if (cookieIndex === -1) {

            return this.createAccount();
        }

        cookieIndex += recordName.length + 1;
        let nextIndex = contents.indexOf(",", cookieIndex);

        if (nextIndex === -1) {

            return this.createAccount();
        }
        
        const cookiePassword = contents.substring(cookieIndex, nextIndex);
        cookieIndex = nextIndex + 1;
        nextIndex = contents.indexOf(";", cookieIndex);

        if (nextIndex === -1) {

            return this.createAccount();
        }

        const salt = contents.substring(cookieIndex, nextIndex);

        const hashResult = await this.hashPassword(
            this.password + salt, this.numHashIter
        );

        return hashResult === cookiePassword;
    }

    async createAccount() {

        const salt = this.generateHexString(256);

        const password = await this.hashPassword(
            this.password + salt, this.numHashIter
        );

        const recordName = "reactTest_" + this.username;

        if (localStorage) {

            try {

                localStorage.setItem(recordName, JSON.stringify({
                    username: this.username, 
                    password: password, 
                    salt: salt
                }));

                return true;
            }
            catch (error) {

                console.error(error);
            }
        }

        if ( this.supportsCookies() ) {

            const MAX_AGE = 86400; // 1 day in seconds 
            const contents = password + "," + salt;
            const date = new Date();
            date.setTime( date.getTime() + (MAX_AGE * 1000) );

            document.cookie = recordName + "=" + contents 
                + "; max-age=" + MAX_AGE + "; expires=" + date.toUTCString() 
                + "; SameSite=Strict; ";
            
            return document.cookie.indexOf(recordName + "=") >= 0;
        }

        return false;
    }

    /**
     * Hashes the password provided to the class the specified number of times 
     * using a client-side implementation of the SHA-512 hashing function. 
     */
    async hashPassword(password, iter) {

        return await crypto.subtle.digest(
            "SHA-512", new TextEncoder("utf-8").encode(password) 
        ).then(buf => {
            return Array.prototype.map.call(
                new Uint8Array(buf), 
                x => ( ( '00' + x.toString(16) ).slice(-2) ) 
            ).join('');
        }).then( (hashResult) => {
            return iter ? this.hashPassword(hashResult, iter - 1) 
                : hashResult;
        });
    }

    checkSession() {

        if ( this.checkSessionCookie() || this.checkSessionStorage() ) {

            return true;
        }

        throw new ReferenceError("No JavaScript APIs supported or enabled for " 
            + "storing session information.");
    }

    checkSessionCookie() {

        if ( !this.supportsCookies() ) {

            return false;
        }

        const SESSION_TITLE = "sessionId";
        const COOKIE_TITLE = SESSION_TITLE + "=";
        let contents = document.cookie;
        let cookieIndex = contents.indexOf(COOKIE_TITLE);

        if (cookieIndex === -1) {

            return this.createSessionCookie();
        }

        cookieIndex += COOKIE_TITLE.length;
        let nextIndex = contents.indexOf(";", cookieIndex);

        if (nextIndex === -1) {

            return this.createSessionCookie();
        }

        let sessionId = contents.substring(cookieIndex, nextIndex);

        if ( this.hasSessionStorage() 
             && sessionId !== sessionStorage.getItem(SESSION_TITLE) ) {

            return this.createSessionCookie(sessionId);
        }

        return this.extendSessionCookie();
    }

    createSessionCookie() {

        if ( !this.supportsCookies() ) {

            return false;
        }

        const SESSION_TITLE = "sessionId", MAX_AGE = 1800;
        const sessionId = this.generateSessionId();
        const cookieVal = SESSION_TITLE + "=" + sessionId;

        let date = new Date();
        date.setTime( date.getTime() + (MAX_AGE * 1000) );

        document.cookie = cookieVal + "; max-age=" + MAX_AGE 
            + "; expires=" + date.toUTCString() + "; SameSite=Strict; ";

        if ( this.hasSessionStorage() ) {

            try {

                sessionStorage.setItem(SESSION_TITLE, sessionId);
            }
            catch (error) {

                console.error(error);
            }
        }

        return document.cookie.indexOf(cookieVal) >= 0;
    }

    generateSessionId(oldId) {

        const NUM_BITS = 64;

        if (oldId) {
            
            let newId;

            do newId = this.generateHexString(NUM_BITS);
            while (oldId !== newId)

            return newId;
        }
        
        return this.generateHexString(NUM_BITS);
    }

    extendSessionCookie() {

        /* Check cannot be done if the browser does not support cookies or has 
         cookies disabled. */
        if ( !this.supportsCookies() ) {

            return null;
        }

        const contents = document.cookie.split(/;[\s]+/);
        const COOKIE_NAME = "sessionId=", MAX_AGE = 1800, date = new Date();
        date.setTime( date.getTime() + (MAX_AGE * 1000) );

        let index = 0;
        
        while ( index < contents.length 
            && contents[index].indexOf(COOKIE_NAME) !== 0 ) {

            index++;
        }

        if ( index === contents.length ) {

            return false;
        }

        index++;

        contents.splice( index, 0, "max-age=" + MAX_AGE );
        index++;

        contents.splice( index, 0, "expires=" + date.toUTCString() );
        index++;

        document.cookie = contents.join("; ");
        return true;
    }

    checkSessionStorage() {

        if ( !this.hasSessionStorage() ) {

            return false;
        }

        const RECORD_TITLE = "sessionExpires";
        const expireRecord = sessionStorage.getItem(RECORD_TITLE);

        if (expireRecord) {

            let expireNum = Number(expireRecord);

            if ( !isNaN(expireNum) 
                 && (new Date).getTime() < expireNum ) {
                
                return this.extendSessionStorage();
            }
        }

        return this.createInSessionStorage();
    }

    createInSessionStorage() {

        if ( !this.hasSessionStorage() ) {

            return false;
        }

        const RECORD_TITLE = "sessionExpires", MAX_AGE = 1800000;

        try {

            sessionStorage.setItem(
                RECORD_TITLE, 
                String( ( new Date() ).getTime() + MAX_AGE ) 
            );
        }
        catch (error) {

            console.error(error);
            return false;
        }

        return true;
    }

    extendSessionStorage() {

        if ( !this.hasSessionStorage() ) {

            return false;
        }

        const RECORD_TITLE = "sessionExpires", MAX_AGE = 1800000;

        try {

            sessionStorage.setItem(
                RECORD_TITLE, 
                String( ( new Date() ).getTime() + MAX_AGE ) 
            );
        }
        catch (error) {

            console.error(error);
            return false;
        }

        return true;
    }

    hasSessionStorage() {

        if (!sessionStorage) {

            sessionStorage = window.sessionStorage;
        }
        
        return !!sessionStorage;
    }

    supportsCookies() {

        return "cookie" in document && window.navigator.cookieEnabled;
    }

    generateHexString(numBits) {

        const crypto = window.crypto || window.msCrypto;
        
        /* Not guaranteed to run in a secure context (HTTPS), but does generate 
         cryptographically secure pseudo-random numbers. */
        if (crypto && crypto.getRandomValues) {
            
            /* Bitwise signed right shift by 3 spaces. Optimization equivalent 
             to division by 8. */
            let numbers = new Uint8Array(numBits >> 3), hex = "";
            numbers = crypto.getRandomValues(numbers);

            for (let index = 0; index < numbers.length; index++) {

                hex += numbers[index].toString(16);
            }

            return hex;
        }

        /* Backup approach. Not recommended since Math.random() does not 
         generate cryptographically secure pseudo-random numbers. */

        /* Bitwise signed right shift by 3 spaces. Optimization equivalent 
         to division by 4. */
        let numHex = numBits >> 2, hex = "";

        while (numHex) {

            hex += Math.floor(Math.random() * 16).toString(16);
            numHex--;
        }

        return hex;
    }
}

export default CheckLoginAttempt;