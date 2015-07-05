var React = require("react/addons");

module.exports = React.createClass({
    render: function() {
        if(this.props.issues.length > 0) {
            var issueNodes = this.props.issues.map(issue => (<li>{issue}</li>)); 
            return (
                <ul id="validation-issues">
                    {issueNodes}
                </ul>
            );
        } else {
            return null;
        }
    }
});