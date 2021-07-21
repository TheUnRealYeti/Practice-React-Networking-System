/* Core React file import section */
import React   from "react";

/* Stylsheet import section */
import "../stylesheets/NavStyles.css";

/* Custom Component import section */
import NavHamburger from "./NavHamburger";
import NavMenu      from "./NavMenu";

class NavBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            navToggled: false
        };
    }

    toggleNavMenu(event) {

        event.preventDefault();
        event.stopPropagation();
        
        this.setState({ 
            navToggled: !this.state.navToggled 
        });
    }

    render() {

        /* Checks if the user's Internet browser supports the "background-size" 
         CSS3 property, which had support added in most Internet browsers 
         around the same time that further semantic HTML5 elements, such as 
         "header" and "nav", were added. */
        if ( typeof document.body.style.backgroundSize === "string" ) {

            return (
                <header 
                    id = "systemHeader" 
                    className = "systemHeader"
                >
                    <NavHamburger 
                        onClick = { (event) => {
                            this.toggleNavMenu(event);
                        } } 

                        navToggled = { this.state.navToggled } 
                    />

                    <nav 
                        id = "systemNavBar" 

                        className = { "systemNavBar" + (
                            this.state.navToggled ? " expandNavBar" : "" 
                        ) } 
                    > 
                        <NavMenu 
                            setComponentId = { this.props.setComponentId } 
                        />
                    </nav>
                </header>
            );
        }

        /* If the user's Internet browser does not support CSS3 properties or 
         HTML5 semantic elements, use div elements in place of the semantic 
         HTML5 elements with a "role" attribute value added to specify a  
         semantic purpose. */
        return (
            <div  
                id = "systemHeader" 
                className = "systemHeader" 
                role = "header" 
            >
                <NavHamburger 
                    onClick = { (event) => {
                        this.toggleNavMenu(event);
                    } } 
                />

                <div  
                    id = "systemNavBar" 

                    className = { "systemNavBar" + (
                        this.state.navToggled ? " expandNavBar" : "" 
                    ) } 

                    role = "navigation" 
                > 
                    <NavMenu 
                        setComponentId = { this.props.setComponentId } 
                    />
                </div>
            </div>
        );
    }
}

export default NavBar;