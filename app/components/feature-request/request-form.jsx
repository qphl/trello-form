var React = require("react/addons");

module.exports = React.createClass({
    mixins: [React.addons.LinkedStateMixin],
    getInitialState: function() {
        return {
            firstName: "",
            surname: "",
            email: "",
            title: "",
            body: "",
            issues: []
        }
    },
    render: function() {
        return (
                <form>
                    <IssueList issues={this.state.issues} />
                    <fieldset id="userDetails">
                        <legend>Your details</legend>
                        <label for="firstName">First Name</label>
                        <input id="firstName" valueLink={this.linkState('firstName')} />
                        <label for="surname">Surname</label>
                        <input id="surname"  valueLink={this.linkState('surname')} />
                        <label for="email">Email Address</label>
                        <input id="email"  valueLink={this.linkState('email')} />
                    </fieldset>                    
                    <fieldset id="description">
                        <legend>Describe your feature</legend>
                        <label for="title">Title</label>
                        <input id="title" placeholder="A short description of the change" valueLink={this.linkState('title')}/>
                        <label for="card-body">Full Description</label>
                        <textArea onChange={this.bodyChanged} id="card-body" value={this.state.body} placeholder="Provide as much detail as possible here"></textArea>
                        <aside>(<a href="http://daringfireball.net/projects/markdown/">Markdown</a> formatting is supported)</aside>
                    </fieldset>
                    <button onClick={this.validate}>Submit your request</button>
                    <button onClick={this.clear}>Clear</button>
                </form>
               );
    },
    bodyChanged: function(e) {
        this.setState({ body: event.target.value });
    },
    clear: function(e) {
        this.setState(this.getInitialState());
        e.preventDefault();
    },
    validate: function(e) {
        var newIssues = [];

        if (isNullOrEmpty(this.state.firstName))
            newIssues.push("First name is required");

        if (isNullOrEmpty(this.state.surname))
            newIssues.push("Surname is required");

        if (isNullOrEmpty(this.state.email))
            newIssues.push("Email is required");

        if (isNullOrEmpty(this.state.title))
            newIssues.push("Feature title is required");

        if (isNullOrEmpty(this.state.body))
            newIssues.push("Feature description is required");

        this.setState({ issues: newIssues });

        if(newIssues.length === 0)
            alert("submit to trello"); //callback to parent with valid data
            //submit

        e.preventDefault();

    }
});

var IssueList = React.createClass({
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

function isNullOrEmpty(string) {
    if(string === null || string === undefined) 
        return true;

    if(string.trim().length === 0)
        return true;

    return false;
}