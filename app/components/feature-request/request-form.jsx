var React = require("react");

module.exports = React.createClass({
    render: function() {
        return (
                <form>
                    <fieldset id="userDetails">
                        <legend>Your details</legend>
                        <label for="firstName">First Name</label>
                        <input id="firstName"></input>
                        <label for="surname">Surname</label>
                        <input id="surname"></input>
                        <label for="email">Email Address</label>
                        <input id="email"></input>
                    </fieldset>                    
                    <fieldset id="description">
                        <legend>Describe your feature</legend>
                        <label for="title">Title</label>
                        <input id="title" />
                        <label for="card-body">Full Description</label>
                        <textArea id="card-body"></textArea>
                        <aside>(<a href="http://daringfireball.net/projects/markdown/">Markdown</a> formatting is supported)</aside>
                    </fieldset>
                    <button type="submit">Submit your request</button>
                    <button>Clear</button>
                </form>
               );
    }
});