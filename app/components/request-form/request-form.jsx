var React = require("react/addons");
var IssueList = require("./issue-list.jsx");
var MarkdownTextArea = require('react-markdown-textarea');

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

                    <p>
                    If you do not have a <a href="https://trello.com">Trello</a> account,
                    you can use this form to submit a request relating to a {window.config.organisation} 
                    system for consideration by the development team.
                    </p>
                    <p>
                    If you already have a trello account, you should log in 
                    and submit your request directly into the relevant trello board</p>

                    <IssueList issues={this.state.issues} />

                    <fieldset id="userDetails">
                        <legend>Your details</legend>
                        <label htmlFor="firstName">First Name</label>
                        <input id="firstName" valueLink={this.linkState('firstName')} />
                        <label htmlFor="surname">Surname</label>
                        <input id="surname"  valueLink={this.linkState('surname')} />
                        <label htmlFor="email">Email Address</label>
                        <input id="email"  valueLink={this.linkState('email')} />
                    </fieldset>

                    <fieldset id="description">
                        <legend>Describe your feature</legend>
                        <label htmlFor="title">Title</label>
                        <input id="title" placeholder="A short description of the request" valueLink={this.linkState('title')}/>
                        <MarkdownTextArea rows={10} placeholder="A detailed description your request goes here" onChange={this.bodyChanged}/> 
                    </fieldset>

                    <button onClick={this.validate}>Submit your request</button>
                </form>
               );
    },
    bodyChanged: function(e) {
        this.setState({ body: event.target.value });
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
            this.props.onSubmit(this.state);

        return false;
    }
});

function isNullOrEmpty(string) {
    if(string === null || string === undefined) 
        return true;

    if(string.trim().length === 0)
        return true;

    return false;
}