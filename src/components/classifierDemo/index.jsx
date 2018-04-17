import React from 'react';
import PropTypes from 'prop-types';
import { ZOODATA_INITIAL_STATE } from '../../ducks/zooniverse-data';

class ClassifierDemo extends React.Component {
  componentDidMount(){
    // TODO: fetch the Project data
  }

  render() {
    return (
      <div className="classifier-demo">
        <h1>Classifier Demo</h1>
        <div className="dashboard">
          <div className="subject-display-area">
            <div className="subject">Subject</div>
            <button>New Subject</button>
            <button>Submit Classification</button>
          </div>
          <div className="resource-status">Status of Project Resources</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {


  };
};

ClassifierDemo.defaultProps = {
  user: {},
  initialised: false,
  ...ZOODATA_INITIAL_STATE
};

ClassifierDemo.propTypes = {
  user: PropTypes.object,
  initialised: PropTypes.bool,
  dispatch: PropTypes.func,
  projectStatus: PropTypes.string
};



export default ClassifierDemo;
