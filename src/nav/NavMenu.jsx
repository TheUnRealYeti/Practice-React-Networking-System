/* Core React import section */
import React from "react";

class NavMenu extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            setupMenuToggled: false 
        };
    }

    componentDidMount() {

        const currentItem = document.getElementById( 
            this.props.componentId + "NavItem" 
        );

        if (currentItem) {

            currentItem.id = "currentNavItem";
        }
    }

    render() {

        return (
            <ul 
                id = "navInnerList" 
                className = "navInnerList" 
            >
                <li 
                    id = "setupNavItem"
                    className = "navItem" 

                    onClick = { (event) => {

                        event.preventDefault();
                        event.stopPropagation();

                        this.setState({
                            setupMenuToggled: !this.state.setupMenuToggled 
                        });
                    } } 
                >
                    <span 
                        id = "setupSubMenuArrow" 
                        className = { "navSubMenuArrow " + (
                            this.state.setupMenuToggled 
                                ? "arrowDown" 
                                : "arrowRight" 
                        ) } 
                    />

                    <span 
                        id = "setupNavItemTitle" 
                        className="navItemTitle preventSelection" 
                    >
                        Setup
                    </span>

                    <ul 
                        id = "setupSubMenu" 
                        className = { "navSubMenu" + (
                            this.state.setupMenuToggled 
                                ? " expandNavSubMenu" : "" 
                        ) }
                    >
                        <li 
                            id = "networkNavItem" 
                            className = "navSubMenuItem" 

                            onClick = { (event) => {
                                this.props.setComponentId(event, "network");
                            } } 
                        >
                            <span 
                                id = "networkNavItemTitle" 
                                className="navSubItemTitle preventSelection" 
                            >
                                Network
                            </span>
                        </li>

                        <li 
                            id = "passwordNavItem" 
                            className = "navSubMenuItem" 

                            onClick = { (event) => {
                                this.props.setComponentId(event, "password");
                            } } 
                        >
                            <span 
                                id = "passwordNavItemTitle" 
                                className="navSubItemTitle preventSelection" 
                            >
                                Password
                            </span>
                        </li>

                        <li 
                            id = "titleNavItem" 
                            className = "navSubMenuItem" 

                            onClick = { (event) => {
                                this.props.setComponentId(event, "title");
                            } } 
                        >
                            <span 
                                id = "titleNavItemTitle" 
                                className="navSubItemTitle preventSelection" 
                            >
                                Title
                            </span>
                        </li>
                    </ul>
                </li>
                
                <li 
                    id = "logoutNavItem" 
                    className = "navItem" 

                    onClick = { (event) => {
                        this.props.setComponentId(event, "logout");
                    } } 
                >
                    <span 
                        id = "logoutNavItemTitle" 
                        className="navItemTitle preventSelection"
                    >
                        Logout
                    </span>
                </li>
            </ul>
        );
    }
}

export default NavMenu;