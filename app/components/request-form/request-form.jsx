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

        var titleClass = window.config.organisation.replace(" ","").toLowerCase();
        return (
                <div className="container">
                    <h1 id="page-title" className={titleClass}>{window.config.organisation}</h1>
                    <h2>Software Feature Request Form</h2>
                    <form>
                        <p>If you do not have a <a href="https://trello.com">Trello</a> account you can use this form to submit a request relating to a {window.config.organisation} system for consideration by the development team. If you already have a Trello account you should log in and submit your request directly into the relevant Trello board.</p>

                        <IssueList issues={this.state.issues} />

                        <fieldset id="userDetails">
                            <legend>Your details</legend>
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" valueLink={this.linkState('firstName')} autoFocus />
                            <label htmlFor="surname">Surname</label>
                            <input type="text" id="surname" valueLink={this.linkState('surname')} />
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" valueLink={this.linkState('email')} />
                        </fieldset>

                        <fieldset id="description">
                            <legend>Describe your feature</legend>
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" placeholder="A short summary of your request" valueLink={this.linkState('title')}/>
                            <MarkdownTextArea rows={3} placeholder="A detailed description your request" onChange={this.bodyChanged}/>
                        </fieldset>

                        <button onClick={this.validate}>Submit your change request</button>
                    </form>
                </div>
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