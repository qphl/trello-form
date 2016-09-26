var React = require('react');
var RequestForm = require('./components/request-form/request-form.jsx');
var ErrorPage = require('./components/error/error.jsx');
var SuccessPage = require('./components/success/success.jsx');

var App = React.createClass({
    getInitialState: function() {
        return {
            view: "form"
        }
    },
    render: function () {
        var view = this.state.view;
        if(view === "form") {
            return <RequestForm onSubmit={this.submitCard} />;
        }
        if(view === "saving") {
            return <p id="loading">Saving...</p> 
        }
        if(view === "error") {
            return <ErrorPage text={this.state.errorText} onReturn={this.returnHome} />
        }
        if(view === "success") {
            return <SuccessPage onReturn={this.returnHome} cardUrl={this.state.cardUrl} />
        }
    },
    returnHome: function() {
        this.setState(this.getInitialState());
    },
    submitCard: function(data) {
        var quotedBits = `
**Title**

${data.title}

**Description**

${data.body}

**Solution**

${data.solution || 'No solution provided'}

**Business Impact**

${data.impact}
`.replace(/\n/g, '\n>');

var desc = 
`
# Original Description
Requested by ${data.firstName} ${data.surname} (${data.email})

${quotedBits}


---

# Problem Definition

---

# Potential Solutions

---

# Implementation Details`;



        var postData = {
            name: data.title,
            desc: desc, 
            idList: window.config.trelloListId,
        };

        var postDataString = "name=" + encodeURIComponent(postData.name) + 
                             "&desc=" + encodeURIComponent(postData.desc) +
                             "&idList=" + encodeURIComponent(postData.idList) +
                             "&urlSource=null&due=null"

        //postDataString = encodeURIComponent(postDataString);

        console.log(postDataString);
        
        var url = "https://api.trello.com/1/cards?key=" + window.config.trelloAppKey + "&token=" + window.config.trelloUserToken;
        var request = new XMLHttpRequest();
        
        this.setState({
            view: "saving"
        });

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            // Success!
            var data = JSON.parse(request.responseText);
            console.log("SUCCESS");
            console.log(data);
            this.setState({
                view: "success",
                cardUrl: data.shortUrl
            });
          } else {
            // We reached our target server, but it returned an error
            this.setState({
                view: "error",
                errorText: request.status + ": " + request.responseText
            });
          }
        }.bind(this);

        request.onerror = function() {
            this.setState({
                view: "error",
                errorText: ""
            });
        }.bind(this);
        
        request.open('POST', url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send(postDataString);
    }   
});

React.render(
  <App />,
  document.body
);
