var React = require("react");

module.exports = React.createClass({
    render: function() {
        return (
                <div id="error">
                    <h1>An error occurred submitting your request</h1>
                    <pre>{this.props.text}</pre> 
                    <button onClick={this.props.onReturn}>Go Back</button>
                </div>
               );
    }
});