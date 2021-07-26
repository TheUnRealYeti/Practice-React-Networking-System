/* Core React import section */
import React  from 'react';

/* Stylesheet import section */
import "../stylesheets/MainStyles.css";

/* Custom Component import section */
import Logout   from './Logout.jsx';
import NavBar   from '../nav/NavBar.jsx';
import Network  from '../network/Network.jsx';
import Password from './Password.jsx';
import Title    from './Title.jsx';

class SystemMain extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            pageTitle: "", 
            componentId: "" 
        }
    }

    getMainElement() {

        const DEFAULT_TITLE = "Title Not Set";

        if ( typeof document.body.style.backgroundSize === "string" ) {

            return (
                <main 
                    id = "mainContent" 
                    className = { "mainContent" + (
                        this.state.componentId ? "" : " mainBottomSpace" 
                    ) } 
                >
                    <h1 
                        id = "pageTitle" 
                        className = "pageTitle"
                    >
                        { 
                            this.state.pageTitle 
                                ? this.state.pageTitle 
                                : DEFAULT_TITLE 
                        } 
                    </h1>

                    { this.getComponent() } 
                </main>
            );
        }

        return (
            <div 
                id = "mainContent" 
                className = { "mainContent" + (
                    this.state.componentId ? "" : " mainBottomSpace" 
                ) } 
                role = "main" 
            >
                <h1 
                    id = "pageTitle" 
                    className = "pageTitle"
                >
                    { 
                        this.state.pageTitle 
                            ? this.state.pageTitle 
                            : DEFAULT_TITLE 
                    } 
                </h1>

                { this.getComponent() } 
            </div>
        );
    }

    setComponentId(event, newId) {

        event.preventDefault();
        event.stopPropagation();
        
        this.setState({ componentId: newId.toLowerCase() });
    }

    getComponent() {

        switch ( this.state.componentId.toLowerCase() ) {

            case "logout":
                return <Logout/>;
            
            case "network":
                return <Network/>;

            case "password":
                return <Password/>;

            case "title":
                return <Title/>
            
            default:
                return "";
        }
    }

    render() {

        return (
            <div className = "mainContainer">

                <NavBar 
                    setComponentId = { (event, newId) => {
                        this.setComponentId(event, newId);
                    } } 
                />

                { this.getMainElement() } 
            </div>
        );
    }
}

export default SystemMain;