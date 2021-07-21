import React   from "react";

class NavHamburger extends React.Component {

    render() {

        return (
            <div 
                id = "navHamburgerIcon" 
                className = "navHamburgerContainer preventSelection" 

                onClick = { (event) => {
                    this.props.onClick(event);
                } } 

                title = {
                    this.props.navToggled 
                        ? "Press to close navigation menu." 
                        : "Press to open navigation menu." 
                }
            >
                <span
                    id = "navHamburgerTopLine" 
                    className = "navHamburgerLine" 
                />

                <span
                    id = "navHamburgerMiddleLine" 
                    className = "navHamburgerLine" 
                />

                <span
                    id = "navHamburgerBottomLine" 
                    className = "navHamburgerLine" 
                />
            </div>
        );
    }
}

export default NavHamburger;