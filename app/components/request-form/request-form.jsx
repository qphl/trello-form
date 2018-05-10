const React = require('react');
const PropTypes = require('prop-types');
const IssueList = require('./issue-list.jsx');

if (!window.config) {
  window.config = {
    organisation: 'Your Organisation Name',
    trelloAppKey: 'Set this using the console',
    trelloUserToken: 'Set this using the console',
    trelloListId: '5af2f76192bf9dbe0db26b61',
    content: {
      title: 'The page title',
      intro: 'Introductory text',
      requestDescription: 'Description above the request entry field',
      enableSuggestASolution: false,
    },
  };
}


class RequestForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      surname: '',
      email: '',
      title: '',
      body: '',
      showSolution: false,
      issues: [],
    };

    function fieldChange(name, event) {
      const stateChange = {};
      stateChange[name] = event.target.value;
      this.setState(stateChange);
    }

    this.firstNameChanged = fieldChange.bind(this, 'firstName');
    this.surnameChanged = fieldChange.bind(this, 'surname');
    this.emailChanged = fieldChange.bind(this, 'email');
    this.titleChanged = fieldChange.bind(this, 'title');
    this.bodyChanged = fieldChange.bind(this, 'body');
    this.solutionChanged = fieldChange.bind(this, 'solution');
    this.impactChanged = fieldChange.bind(this, 'impact');

    this.toggleSolution = this.toggleSolution.bind(this);
    this.validate = this.validate.bind(this);
  }


  toggleSolution() {
    this.setState({ showSolution: !this.state.showSolution });
  }


  validate() {
    function isNullOrWhitespace(string) {
      if (string === null || string === undefined) { return true; }
      if (string.trim().length === 0) { return true; }

      return false;
    }

    const newIssues = [];
    if (isNullOrWhitespace(this.state.firstName)) { newIssues.push('First name is required'); }
    if (isNullOrWhitespace(this.state.surname)) { newIssues.push('Surname is required'); }
    if (isNullOrWhitespace(this.state.email)) { newIssues.push('Email is required'); }
    if (isNullOrWhitespace(this.state.title)) { newIssues.push('Title is required'); }
    if (isNullOrWhitespace(this.state.body)) { newIssues.push('Problem description is required'); }
    if (isNullOrWhitespace(this.state.impact)) { newIssues.push('Business impact is required'); }
    this.setState({ issues: newIssues });

    if (newIssues.length === 0) { this.props.onSubmit(this.state); }

    return false;
  }


  render() {
    /* eslint-disable jsx-a11y/no-autofocus */
    // Dan says autofocus is OK in this instance so disabling the rule
    const titleClass = window.config.organisation.replace(' ', '').toLowerCase();
    return (
      <div className="container">
        <h1 id="page-title" className={titleClass}>{window.config.organisation}</h1>
        <h2>{window.config.content.title}</h2>
        <form>
          <p>{window.config.content.intro}</p>

          <IssueList issues={this.state.issues} />

          <h3>Your details</h3>
          <fieldset id="userDetails">
            <legend>Your details</legend>
            <label htmlFor="firstName">First Name
              <input
                type="text"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                id="firstName"
                value={this.state.firstName}
                onChange={this.firstNameChanged}
                autoFocus
              />
            </label>
            <label htmlFor="surname">Surname
              <input
                type="text"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                id="surname"
                value={this.state.surname}
                onChange={this.surnameChanged}
              />
            </label>
            <label htmlFor="email">Email Address
              <input
                type="email"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                id="email"
                onChange={this.emailChanged}
              />
            </label>
          </fieldset>

          <h3>Request Description</h3>
          <p>{window.config.content.requestDescription}</p>
          <fieldset id="description">
            <legend>Describe your change</legend>
            <label htmlFor="title">Title
              <input
                type="text"
                id="title"
                placeholder="A short summary of your request"
                onChange={this.titleChanged}
              />
            </label>
            <label htmlFor="problem">Problem
              <textarea
                id="problem"
                rows={3}
                placeholder="Describe your problem in full here"
                onChange={this.bodyChanged}
              />
            </label>
            <input
              type="checkbox"
              checked={this.state.showSolution}
              onChange={this.toggleSolution}
            />
            <span> I would also like to suggest a solution</span>
            {this.state.showSolution &&
            <label htmlFor="suggestSolution">Solution
              <textarea
                onChange={this.solutionChanged}
                id="solution"
                rows={3}
                placeholder="Describe your potential solution here"
              />
            </label>
            }
            <p>
               A description of the business impact will help us with prioritisation.
               This should be described in terms of productivity,
               cost, product quality or customer experience.
            </p>
            <label htmlFor="businessImpact">Business Impact
              <textarea
                onChange={this.impactChanged}
                id="businessImpact"
                placeholder="Describe the business impact of this problem here"
              />
            </label>
          </fieldset>

          <button onClick={this.validate}>Submit your request</button>
        </form>
      </div>
    /* eslint-enable no-autofocus */
    );
  }
}


RequestForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};


module.exports = RequestForm;
