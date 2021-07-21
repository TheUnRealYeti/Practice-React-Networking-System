/* Core React imports */
import React from "react";

/* Custom component and functionality class imports */
import UsernameInput from "./inputs/UsernameInput";
import PasswordInput from "./inputs/PasswordInput";
import LoginButtons  from "./buttons/LoginButtons";
import LoginAttempt  from "./processing/CheckLoginAttempt";

class LoginForm extends React.Component {

    constructor(props) {
        
        /* Passes the "props" object to the Component class constructor. */
        super(props);

        const USERNAME_NAME = "username", PASSWORD_NAME = "password";
        const ERROR_ENDING = "HasError", REFRESH_ENDING = "Refresh";

        this.state = {

            /* Username value from the username form control */
            [USERNAME_NAME]: "", 

            /* Indicates whether or not there is an error with the user input 
             in the username form control. */
            [USERNAME_NAME + ERROR_ENDING]: false, 

            /* Password value from the password form control */
            [PASSWORD_NAME]: "", 

            /* Indicates whether or not the input in the password field does 
             not match the password for an existing account with a taken 
             username. */
            [PASSWORD_NAME + "Mismatch"]: false, 

            /* Indicates whether or not there is an error with the user input 
             for the password form control. */
            [PASSWORD_NAME + ERROR_ENDING]: false, 

            /* Used when a user clicks "Submit" and when the API is checking 
             whether the user login data is valid. Any form input controls or 
             buttons will be disabled during this time. Prevents the API from 
             being flooded with duplicate requests. */
            processing: false, 

            /* Indicates whether to toggle a form input field refresh animation 
             after the "Cancel" button is pressed on the login form. */
            inputRefresh: false, 

            /* Indicates whether to hide existing error messages for the 
             "Username" input field when the "Cancel" button is pressed on the 
             login form. */
            [USERNAME_NAME + REFRESH_ENDING]: false, 

            /* Indicates whether to hide existing error messages for the 
             "Username" input field after the "Cancel" button is pressed on the 
             login form. */
            [PASSWORD_NAME + REFRESH_ENDING]: false, 

            /* Indicates whether the login form should play an exiting 
             animation after a user has successfully logged in. If false, an 
             entry animation is played on Component load. */
            loginDisappear: false
        }
    }

    /** 
     * Imitates the process of creating an account with a unique username that 
     * is normally done using a server-side programming language, except using 
     * client-side JavaScript. The password is hashed with a salt and inserted 
     * into the JavaScript LocalStorage API to emulate storage into a database. 
     * 
     * *** Note that using client-side password hashing and storage for account 
     * details is very insecure, and this function is NOT intended for use in 
     * commercial, production code. The main purpose of this application is to 
     * demonstrate front-end React code and not necessarily to implement any 
     * server-side functionality. bcrypt, scrypt, or Argon2 should also be used 
     * over SHA-512-based approaches. ***
     * 
     * Potential Update: Implement server-side hashing and database storage 
     * using the Node.js Express.js package and MongoDB. 
     */
    async loginAttempt() {

        /* 
            - Disable form inputs from changing while login information is 
              being checked. 
            - If login page or any other page is visited, write logic that 
              checks whether or not a session currently exists. 
            - If so, automatically redirect and mount the Main Page Component. 
            - If not, let the user know that their session has expired, and 
              they need to log in again. 
        */

        this.setState({ 
            processing: true, 
            passwordMismatch: false, 
            passwordHasError: false 
        });

        const loginChecker = new LoginAttempt(
            this.state.username, this.state.password 
        );
        
        let loginSuccess = await loginChecker.checkAccount();

        this.setState({ 
            passwordMismatch: !loginSuccess, 
            passwordHasError: !loginSuccess 
        });

        if (!loginSuccess) {

            this.setState({ processing: false });
            return false;
        }

        loginSuccess = loginSuccess && loginChecker.checkSession();
        this.setState({ loginDisappear: true });
        
        setTimeout( () => {

            if (loginSuccess) {

                this.props.updateLoginStatus(loginSuccess);
            }

        }, 700);
        
        return loginSuccess;
    }

    resetForm() {

        /* Reset the form input field values and appearances by resetting the 
         state properties to their default values. */
        this.setState({
            username: "", 
            usernameHasError: false, 
            password: "", 
            passwordMismatch: false, 
            passwordHasError: false, 
            processing: false, 
            inputRefresh: true, 
            usernameRefresh: true, 
            passwordRefresh: true 
        });

        setTimeout( () => {
            this.setState({ inputRefresh: false });
        }, 150);
    }

    render() {

        const USERNAME_NAME = "username", PASSWORD_NAME = "password";
        const ERROR_ENDING = "HasError", REFRESH_ENDING = "Refresh";

        const USERNAME_ERROR = USERNAME_NAME + ERROR_ENDING;
        const USERNAME_REFRESH = USERNAME_NAME + REFRESH_ENDING;
        const PASSWORD_ERROR = PASSWORD_NAME + ERROR_ENDING;
        const PASSWORD_REFRESH = PASSWORD_NAME + REFRESH_ENDING;
        const PASSWORD_WRONG = PASSWORD_NAME + "Mismatch";

        const MIN_USERNAME_LENGTH = 5, MAX_USERNAME_LENGTH = 20;
        const MIN_PASSWORD_LENGTH = 8;

        let inputEmpty = !this.state[USERNAME_NAME] 
            || !this.state[PASSWORD_NAME];
        
        let inputError = this.state[USERNAME_ERROR] 
            || ( this.state[PASSWORD_ERROR] 
                && !this.state[PASSWORD_WRONG] );

        return (
            <div 
                className = { "formContainer " + (
                    this.state.loginDisappear 
                        ? "formContainerDisappear" 
                        : "formContainerLoaded" 
                ) } 
            >
                <h1 className = "formTitle">
                    Login
                </h1>

                <form id = "loginForm">

                    <UsernameInput 
                        name = { USERNAME_NAME } 
                        fieldTitle = "Username" 

                        value = { 
                            this.state[ USERNAME_NAME ] 
                                ? this.state[ USERNAME_NAME ] 
                                : "" 
                        } 

                        updateParentState = { (userVal, hasError) => {
                            this.setState({
                                [ USERNAME_NAME ]:    userVal, 
                                [ USERNAME_ERROR ]:   hasError, 
                                [ USERNAME_REFRESH ]: false 
                            });
                        } }

                        minLength = { MIN_USERNAME_LENGTH } 
                        maxLength = { MAX_USERNAME_LENGTH } 
                        disabled = { this.state.processing } 
                        inputRefresh = { this.state.inputRefresh } 
                        errorRefresh = { this.state[ USERNAME_REFRESH ] } 
                    />

                    <PasswordInput 
                        name = { PASSWORD_NAME } 
                        fieldTitle = "Password" 

                        value = { this.state[PASSWORD_NAME] 
                            ? this.state[PASSWORD_NAME]  
                            : "" 
                        } 

                        updateParentState = { (userVal, hasError) => {
                            this.setState({
                                [ PASSWORD_NAME ]:    userVal, 
                                [ PASSWORD_ERROR ]:   hasError, 
                                [ PASSWORD_REFRESH ]: false 
                            });
                        } }

                        minLength = { MIN_PASSWORD_LENGTH } 
                        disabled = { this.state.processing } 
                        passwordMismatch = { this.state[PASSWORD_WRONG] }
                        inputRefresh = { this.state.inputRefresh } 
                        errorRefresh = { this.state[PASSWORD_REFRESH] } 
                    />

                    <LoginButtons 
                        submitDisabled = { 
                            this.state.processing || inputEmpty || inputError 
                        } 

                        inputEmpty = { inputEmpty } 
                        inputError = { inputError } 
                        processing = { this.state.processing } 

                        loginAttemptFn = { () => {
                            return this.loginAttempt() 
                        } } 

                        resetFn = { () => {
                            this.resetForm();
                        } } 
                    />
                </form>
            </div>
        );
    }
}

export default LoginForm;