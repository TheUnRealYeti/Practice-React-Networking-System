
class CheckSession {

    /**
     * Tries to check whether a user has a valid session id and whether a 
     * session's expiration date has been reached. 
     * 
     * @throws - 
     * - A ReferenceError exception if no JavaScript APIs for storing session 
     *   information are supported by a user's Internet browser. 
     * 
     * @returns { boolean } - 
     * Boolean true or false 
     */
    checkSession() {

        /* Check for a session cookie. */
        let result = this.checkSessionCookie();

        if ( result !== null ) {
            
            return result;
        }
        
        /* Check for a session expiration date in SessionStorage. */
        result = this.checkSessionStorage();

        if ( result !== null ) {

            return result;
        }

        throw new ReferenceError("No JavaScript APIs supported or enabled for " 
            + "checking session information.");
    }

    /**
     * Checks if a session has ever been established by the login system for a 
     * user. If cookies are supported and enabled in the user's Internet 
     * browser, checks whether an unexpired session id is present in the 
     * current page's cookie contents. 
     * 
     * If one is, check to see whether the session id is the same as the user's 
     * official session id record in the JavaScript SessionStorage API, if it 
     * is supported and enabled. This process simulates prevention of session 
     * and account hijacking by another user. Otherwise, the code assumes the 
     * session id is valid since it has not expired yet. 
     * 
     * This code simulates the process of checking whether a user's login 
     * session is still valid in a database, except on the client side. 
     * 
     * @returns { boolean | null } - 
     * - Boolean true or false depending on whether an expiration date value 
     *   for a session is present in SessionStorage and has been surpassed yet. 
     * - null if the JavaScript SessionStorage API is unsupported or disabled. 
     */
    checkSessionCookie() {

        /* Check cannot be done if the browser does not support cookies or has 
         cookies disabled. */
        if ( !this.supportsCookies() ) {

            return null;
        }

        /* Constant declaration for session information cookie name and 
         SessionStorage key name. */
        const SESSION_TITLE = "sessionId";
        const COOKIE_TITLE = SESSION_TITLE + "=";

        /* Session cookie's contents will be located after its cookie entry 
         name and an equals sign (=) in the list of all of the cookies 
         accessible by the current domain. */
        let contents = document.cookie;
        let cookieIndex = contents.indexOf(COOKIE_TITLE);

        if ( cookieIndex === -1 ) {

            return false;
        }

        /* The cookie's contents will be followed by a semicolon delimeter 
         separating it from other cookie info fields. */
        cookieIndex += COOKIE_TITLE.length;
        let endIndex = contents.indexOf(";", cookieIndex);

        if ( endIndex === -1 ) {

            endIndex = contents.length;
        }

        /* Gets the cookie contents between the name and ending semicolon. */
        let sessionId = contents.substring(cookieIndex, endIndex);

        /* If the browser supports or has SessionStorage enabled, check if the 
         current session id matches the one in SessionStorage, simulating 
         session checking from a database. Also refreshes the length of the 
         session to start at the current time. */
        if ( this.hasSessionStorage() ) {

            return sessionId === sessionStorage.getItem(SESSION_TITLE) 
                && this.extendSessionCookie();
        }

        /* If SessionStorage is disabled and the cookie still has an unexpired 
         session id, let the user log into the system. Also refreshes the 
         length of the session to start at the current time. */
        return this.extendSessionCookie();
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

    supportsCookies() {

        return "cookie" in document && window.navigator.cookieEnabled;
    }

    /**
     * Checks if a session has ever been established by the login system for a 
     * user. Checks whether the session expiration date is stored in the 
     * JavaScript SessionStorage API, if it is supported and enabled in the 
     * user's Internet browser. If it is, checks to see whether the current 
     * session has expired yet. This code simulates the process of checking 
     * whether a user's login session is still valid in a database, except on 
     * the client side. 
     * 
     * @returns { boolean | null } - 
     * - Boolean true or false depending on whether an expiration date value 
     *   for a session is present in SessionStorage and has been surpassed yet. 
     * - null if the JavaScript SessionStorage API is unsupported or disabled. 
     */
    checkSessionStorage() {

        /* Cannot run if SessionStorage is unsupported or disabled in a user's 
         web browser. */
        if ( !this.hasSessionStorage() ) {

            return null;
        }

        /* Contains the key for the session expiration date value. */
        const RECORD_TITLE = "sessionExpires";

        /* Tries to get any record with the key name from SessionStorage, if it 
         exists. */
        const expireRecord = sessionStorage.getItem(RECORD_TITLE);

        /* If the entry exists, convert it to a Number, and check whether the 
         expiration date has been reached. If not, refresh the life of the 
         session, starting at the current time. */
        if (expireRecord) {

            let expireNum = Number(expireRecord);

            if ( !isNaN(expireNum) 
                 && ( new Date ).getTime() < expireNum ) {
                
                return this.extendSessionStorage();
            }
        }

        return false;
    }

    extendSessionStorage() {

        if ( !this.hasSessionStorage() ) {

            return null;
        }

        const EXPIRE_KEY = "sessionExpires", MAX_AGE = 1800000;

        try {

            sessionStorage.setItem(
                EXPIRE_KEY, 
                String( ( new Date() ).getTime() + MAX_AGE ) 
            );
        }
        catch (error) {

            console.error(error);
            return false;
        }

        return true;
    }

    /**
     * Tests whether or not the JavaScript SessionStorage API is supported and 
     * enabled in the user's Internet browser. 
     * 
     * @returns {boolean} - 
     * Boolean true or false
     */
    hasSessionStorage() {

        /* Try to define a global SessionStorage reference if one does not 
         exist. */
        if (!sessionStorage) {

            sessionStorage = window.sessionStorage;
        }
        
        /* 
           - If SessionStorage is supported, try storing a dummy test value in 
             it. 
           - If successful, SessionStorage is enabled and not full. 
           - If unsuccessful, setItem() will throw an exception since 
             SessionStorage is either disabled or full. 
        */
        if (sessionStorage) {

            const TEST_KEY = "enabled";

            try {

                sessionStorage.setItem(TEST_KEY, "true");
            }
            catch (error) {

                console.error(error);
                return false;
            }

            sessionStorage.removeItem(TEST_KEY);
            return true;
        }

        return false;
    }
}

export default new CheckSession();