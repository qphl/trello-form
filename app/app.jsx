const React = require("react");
const Dom = require("react-dom");
const RequestForm = require("./components/request-form/request-form.jsx");
const ErrorPage = require("./components/error/error.jsx");
const SuccessPage = require("./components/success/success.jsx");

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      view: "form"
    };

    this.submitCard = this.submitCard.bind(this);
    this.returnHome = this.returnHome.bind(this);
  }

  returnHome() {
    this.setState({ view: "form" });
  }

  submitCard(data) {
    const quotedBits = `
**Title**

${data.title}

**Description**

${data.body}

**Solution**

${data.solution || "No solution provided"}

**Business Impact**

${data.impact}
`.replace(/\n/g, "\n>");

    const desc = `
# Story

# Acceptance Criteria

# Original Description
Requested by ${data.firstName} ${data.surname} (${data.email})

${quotedBits}`;

    const postData = {
      name: data.title,
      desc,
      idList: window.config.trelloListId
    };

    const postDataString = `name=${encodeURIComponent(
      postData.name
    )}&desc=${encodeURIComponent(postData.desc)}&idList=${encodeURIComponent(
      postData.idList
    )}&urlSource=null&due=null`;

    const url = `https://api.trello.com/1/cards?key=${
      window.config.trelloAppKey
    }&token=${window.config.trelloUserToken}`;
    const request = new XMLHttpRequest();

    this.setState({
      view: "saving"
    });

    request.onload = function onLoad() {
      if (request.status >= 200 && request.status < 400) {
        // Success!
        const responseData = JSON.parse(request.responseText);
        this.setState({
          view: "success",
          cardUrl: responseData.shortUrl
        });
      } else {
        // We reached our target server, but it returned an error
        this.setState({
          view: "error",
          errorText: `${request.status}: ${request.responseText}`
        });
      }
    }.bind(this);

    request.onerror = function onError() {
      this.setState({
        view: "error",
        errorText: ""
      });
    }.bind(this);

    request.open("POST", url, true);
    request.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    request.send(postDataString);
  }

  render() {
    const { view } = this.state;
    switch (view) {
      case "form":
        return <RequestForm onSubmit={this.submitCard} />;
      case "saving":
        return <p id="loading">Saving... </p>;
      case "error":
        return (
          <ErrorPage text={this.state.errorText} onReturn={this.returnHome} />
        );
      case "success":
        return (
          <SuccessPage
            onReturn={this.returnHome}
            cardUrl={this.state.cardUrl}
          />
        );
      default:
        return <p>Invalid View</p>;
    }
  }
}

const target = document.getElementById("AppContainer");
Dom.render(<App />, target);
