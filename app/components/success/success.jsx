var React = require("react");

module.exports = React.createClass({
    render: function() {
        return (
                <div className="container" id="success">
                    <h1>Success!</h1>
                    <p>Your request has been submitted successfully.</p>
                    <p>We will review this request at our next planning meeting, and will be in touch in the future to begin the process of properly specifying a solution to this problem.</p>
                    <p>If you have access to <a href='https://trello.com'>Trello</a>, you can view the card that has been created using the following link: <a href={this.props.cardUrl}>{this.props.cardUrl}</a></p>
                    <p>Press the <em>Subscribe</em> button to be notified of new comments or changes to this card, allowing you to track its progress through to implementation.</p>
                    <p>Software Development Team</p>
                    <button onClick={this.props.onReturn}>Make another request</button>
                </div>
               );
    }
});
