import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ZooData, getZooDataStateValues,
  ZOODATA_INITIAL_STATE, ZOODATA_PROPTYPES, ZOODATA_STATUS,
} from '../../ducks/zooniverse-data';

class ClassifierDemo extends React.Component {
  componentDidMount(){
    // TODO: fetch the Project data
    if (this.props.zooProjectStatus === ZOODATA_STATUS.IDLE) {
      this.props.dispatch(ZooData.fetchProject('1651',
        () => {
          this.props.dispatch(ZooData.fetchWorkflow('2628'));
        }));

    }
  }

  fetchSpecificSubject(){
    this.props.dispatch(ZooData.fetchSubject('48407'));
  }

  fetchNextSubject(){
    this.props.dispatch(ZooData.fetchSubject());
  }

  render() {
    return (
      <div className="classifier-demo">
        <h1>Classifier Demo</h1>
        <div className="dashboard">
          <div className="subject-display-area">
            <div className="subject">
              {this.props.zooSubjectStatus === ZOODATA_STATUS.SUCCESS && this.props.zooSubjectData && (
                <img src={this.props.zooSubjectData.locations[0]['image/jpeg']} />)}
            </div>
            <button onClick={this.fetchSpecificSubject.bind(this)}>Fetch Subject #48407</button>
            <button onClick={this.fetchNextSubject.bind(this)}>Fetch Next Subject</button>
            <button>Submit Classification</button>
          </div>
          <div className="resource-status">
            <h2>Status of Project Resources</h2>
            <p>Project Id: {this.props.zooProjectId}</p>
            <p>Project Status: {this.props.zooProjectStatus}</p>
            {this.props.zooProjectStatusMessage && (
              <p>Project Error Message: {this.props.zooProjectStatusMessage}</p>)}
            <hr />
            <p>Workflow Id: {this.props.zooWorkflowId}</p>
            <p>Workflow Status: {this.props.zooWorkflowStatus}</p>
            {this.props.zooWorkflowStatusMessage && (
              <p>Workflow Error Message: {this.props.zooWorkflowStatusMessage}</p>)}
            <hr />
            <p>Subject Id: {this.props.zooSubjectId}</p>
            <p>Subject Status: {this.props.zooSubjectStatus}</p>
            {this.props.zooSubjectStatusMessage && (
              <p>Subject Error Message: {this.props.zooSubjectStatusMessage}</p>)}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...getZooDataStateValues(state)
  };
};

ClassifierDemo.defaultProps = {
  dispatch: () => {},
  ...ZOODATA_INITIAL_STATE
};

ClassifierDemo.propTypes = {
  dispatch: PropTypes.func,
};

export default connect(mapStateToProps)(ClassifierDemo);
