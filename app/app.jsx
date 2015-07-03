var React = require('react');
var RequestForm = require('./components/feature-request/request-form.jsx');
//var ErrorPage = require('./components/error/error.jsx');

var App = React.createClass({
    render: function () {
        return (
            <div id="app">
                <RequestForm />
            </div>
        )
    }
});

React.render(
  <App />,
  document.body
);