import React from 'react';

class Button extends React.Component {

    render() {
        return (
            <button
                className = { "button" + this.props.extraClass } 
                type = { this.props.type }
                disabled = { this.props.disabled }

                onClick = { (event) => {
                    event.preventDefault();
                    this.props.onClick();
                } }

                title = { this.props.title } 
            >
                { this.props.text }
            </button>
        );
    }
}

export default Button;