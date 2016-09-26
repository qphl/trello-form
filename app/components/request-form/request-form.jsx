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
            showSolution: false,
            issues: []
        }
    },
    toggleSolution: function() {
        this.setState({ showSolution: !this.state.showSolution });
    },
    render: function() {

        var titleClass = window.config.organisation.replace(" ","").toLowerCase();
        return (
                <div className="container">
                    <h1 id="page-title" className={titleClass}>{window.config.organisation}</h1>
                    <h2>Software Change Request Form</h2>
                    <form>
                        <p>You can use this form to submit a request relating to a {window.config.organisation} system for consideration by the development team.</p>

                        <IssueList issues={this.state.issues} />

                        <h3>Your details</h3>
                        <fieldset id="userDetails">
                            <legend>Your details</legend>
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" autocorrect="off" autocapitalize="off" spellcheck="false" id="firstName" valueLink={this.linkState('firstName')} autoFocus />
                            <label htmlFor="surname">Surname</label>
                            <input type="text" autocorrect="off" autocapitalize="off" spellcheck="false" id="surname" valueLink={this.linkState('surname')} />
                            <label htmlFor="email">Email Address</label>
                            <input type="email" autocorrect="off" autocapitalize="off" spellcheck="false" id="email" valueLink={this.linkState('email')} />
                        </fieldset>

                        <h3>Request Description</h3>
                        <p>Describing a change in terms of a problem helps us better understand the context behind your request. Something like <em>"It is hard for worksheet writers to read product descriptions"</em> is more useful for us than <em>"Please increase the font size on print-outs".</em></p>
                        <fieldset id="description">
                            <legend>Describe your change</legend>
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" placeholder="A short summary of your request" valueLink={this.linkState('title')}/>
                            <label htmlFor="problem">Problem</label>
                            <textarea id="problem" rows={3} placeholder="Describe your problem in full here" valueLink={this.linkState('body')}></textarea>
                            <input type="checkbox" checked={this.state.showSolution} onChange={this.toggleSolution}></input><span> I would also like to suggest a solution</span>
                            {this.state.showSolution && <label htmlFor="suggestSolution">Solution</label>}
                            {this.state.showSolution && <textarea valueLink={this.linkState('solution')} id="solution" rows={3} placeholder="Describe your potential solution here"></textarea>}
                            <p>A description of the business impact will help us with prioritisation. This should be described in terms of productivity, cost, product quality or customer experience.</p>
                            <label htmlFor="businessImpact">Business Impact</label>
                            <textarea valueLink={this.linkState('impact')} id="businessImpact" placeholder="Describe the business impact of this problem here"></textarea>
                        </fieldset>

                        <button onClick={this.validate}>Submit your change request</button>
                    </form>
                </div>
               );
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
            newIssues.push("Title is required");

        if (isNullOrEmpty(this.state.body))
            newIssues.push("Problem description is required");

        if (isNullOrEmpty(this.state.impact))
            newIssues.push("Business impact is required");

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
