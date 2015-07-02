var React = require('react');
//var RequestForm = require('./components/feature-request/request-form.jsx');
//var ErrorPage = require('./components/error/error.jsx');

var App = React.createClass({
    render: function () {
        return (
            <div id="app">
                <h1>Hello World</h1>
            </div>
        )
    }
});

React.render(
  <App />,
  document.body
);