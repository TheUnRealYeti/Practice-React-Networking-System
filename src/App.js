/* Core React import section */
import React from 'react';

/* Stylesheet import section */
import "./stylesheets/Formatting.css";
import "./stylesheets/FormStyles.css";

/* Custom Component and functionality import section */
import LoginForm    from './login/LoginForm';
import SystemMain   from './system/SystemMain.jsx';
import SessionCheck from './login/processing/CheckSession.js';

class App extends React.Component {

    constructor(props) {

        super(props);

        this.state = {

            loading: false, 

            /* Indicates whether or not the user is currently logged in. Note 
             that in actual production code, a user's website login status 
             would be determined by the server, not by the client. */
            isLoggedIn: false
        };
    }

    async componentDidMount() {

        this.setState({
            isLoggedIn: SessionCheck.checkSession() 
        });
    }

    async doLogout() {

        
    }

    render() {

        if (this.state.loading) {

            return (
                <div className="container">
                    Loading; please wait...
                </div>
            );
        }

        if (this.state.isLoggedIn) {

            return (
                <div className = "contentWrapper">
                    <div className = "contentCentering">
                        <SystemMain />
                    </div>
                </div>
            );
        }

        return (
            <div className = "contentWrapper">
                <div className = "contentCentering">
                    <LoginForm 
                        updateLoginStatus = { (attemptResult) => {
                            this.setState({
                                isLoggedIn: attemptResult
                            });
                        } } 
                    />
                </div>
            </div>
        );
    }
}

export default App;
