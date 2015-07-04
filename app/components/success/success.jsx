var React = require("react");

module.exports = React.createClass({
    render: function() {
        return (
                <div id="success">
                    <h1>Success!</h1>
                    <p>Your request has been submitted successfully. It will now be reviewed by the development team for inclusion in a future software relase.</p>
                    <button onClick={this.props.onReturn}>Make another request</button>
                </div> 
               );
    }
});