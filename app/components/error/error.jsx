const React = require("react");
const PropTypes = require("prop-types");

const errorView = ({ text, onReturn }) => (
  <div className="container" id="error">
    <h1>An error occurred submitting your request</h1>
    <pre>{text}</pre>
    <button onClick={onReturn}>Go Back</button>
  </div>
);

errorView.propTypes = {
  text: PropTypes.string.isRequired,
  onReturn: PropTypes.func.isRequired
};

module.exports = errorView;
