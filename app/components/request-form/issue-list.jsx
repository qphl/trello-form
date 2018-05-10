const React = require("react");
const PropTypes = require("prop-types");

const issueList = ({ issues }) => {
  if (issues.length > 0) {
    return <ul id="validation-issues">{issues.map(i => <li>{i}</li>)}</ul>;
  }
  return 0;
};

issueList.propTypes = {
  issues: PropTypes.arrayOf(PropTypes.string).isRequired
};

module.exports = issueList;
