import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  ZooData, ZOODATA_MAP_STATE,
  ZOODATA_INITIAL_STATE, ZOODATA_PROPTYPES, ZOODATA_STATUS,
} from '../../ducks/zooniverse-data';

const DEFAULT_PROJECT_ID = '1651';  //Shaun's Transformers project on staging.
const DEFAULT_WORKFLOW_ID = '2628';
const DEFAULT_SAMPLE_SUBJECT_ID = '48407';
  
class ClassifierDemo extends React.Component {
  componentDidMount() {
    
    //If the project hasn't been loaded, load it first.
    if (this.props.zooProjectStatus === ZOODATA_STATUS.IDLE) {
  
      // Initial Project & Workflow Fetch
      // --------------------------------
  
      this.props.dispatch(ZooData.fetchProject(DEFAULT_PROJECT_ID))
  
        //Once the project has successfully fetched, fetch the workflow.
        .then((project)=>{
          console.log('+++ ClassifierDemo: successfully fetched project! ', project);
  
          const workflowId = (project && project.links && project.links.active_workflows)
            ? project.links.active_workflows[0] : DEFAULT_WORKFLOW_ID;
  
          //Remember to use `return` to allow Promise-chaining.
          return this.props.dispatch(ZooData.fetchWorkflow(workflowId));
        })

        //Once you've successfully fetched the workflow... relax, I guess.
        .then((workflow)=>{
          console.log('+++ ClassifierDemo: successfully fetched workflow! ', workflow);
          
          return;
        })
        
        //If anything goes wrong, the catch() here will notice it.
        //You can also force an error by using `throw(new Error('whoops'))`
        .catch((err)=>{
          alert('ClassifierDemo error!');
          console.error('+++ ClassifierDemo error: ', err);
        });

      // --------------------------------

      //NOTE: instead of using Promise chains to fetch project->workflow->etc in
      //sequence, we can also monitor whether a project/workflow/etc has been
      //successfully fetched by monitoring changes in
      //`this.props.zooProjectStatus`, `this.props.zooWorkflowStatus`, etc
    }
  }

  fetchSpecificSubject() {
    
    // Fetch Subject
    // --------------------------------
    this.props.dispatch(ZooData.fetchSubject(DEFAULT_SAMPLE_SUBJECT_ID))
      .then((subject) => {
        console.log('+++ ClassifierDemo: successfully fetched subject! ', subject);
      })
      .catch((err) => {
        console.error('+++ ClassifierDemo error: ', err);
      });
    // --------------------------------
  }

  fetchNextSubject() {
    
    // Fetch Subject
    // --------------------------------
    this.props.dispatch(ZooData.fetchSubject())
      .then((subject) => {
        console.log('+++ ClassifierDemo: successfully fetched subject! ', subject);
      })
      .catch((err) => {
        console.error('+++ ClassifierDemo error: ', err);
      });
    // --------------------------------
  }

  submitClasification() {
    
    // Submit Classification
    // --------------------------------
    
    //Add an object to the annotation, because otherwise, we can't submit to Panoptes.
    this.props.dispatch(ZooData.updateClassification({annotations:[{}]}));
    
    //Submit!
    this.props.dispatch(ZooData.submitClassification())
      .then((classification) => {
        console.log('+++ ClassifierDemo: successfully sent classification! ', classification);
        return this.props.dispatch(ZooData.fetchSubject());
      })
      .then((subject) => {
        console.log('+++ ClassifierDemo: OK, time for the next one... ', subject);
      })
      .catch((err) => {
        console.error('+++ ClassifierDemo error: ', err);
      });
    // --------------------------------
  }

  render() {
    return (
      <div className="classifier-demo">
        <h1>Classifier Demo</h1>
        <div className="dashboard">
          <div className="subject-display-area">
            <div>
              <button onClick={this.fetchSpecificSubject.bind(this)}>Fetch Subject #{DEFAULT_SAMPLE_SUBJECT_ID}</button>
              <button onClick={this.fetchNextSubject.bind(this)}>Fetch Next Subject</button>
              {(!this.props.zooSubjectData) ? null :
                <button onClick={this.submitClasification.bind(this)}>Submit Classification</button>}
            </div>
            <div className="subject">
              {this.props.zooSubjectStatus === ZOODATA_STATUS.SUCCESS && this.props.zooSubjectData && (
                <img src={this.props.zooSubjectData.locations[0]['image/jpeg']} />)}
            </div>
          </div>
          <div className="resource-status">
            <h2>Status of Project Resources</h2>
            <p>Project Id: {this.props.zooProjectId}</p>
            <p>Project Status: {this.props.zooProjectStatus}</p>
            {this.props.zooProjectStatusMessage && (
              <p>Project Error Message: {this.props.zooProjectStatusMessage.toString()}</p>)}
            <hr />
            <p>Workflow Id: {this.props.zooWorkflowId}</p>
            <p>Workflow Status: {this.props.zooWorkflowStatus}</p>
            {this.props.zooWorkflowStatusMessage && (
              <p>Workflow Error Message: {this.props.zooWorkflowStatusMessage.toString()}</p>)}
            <hr />
            <p>Subject Id: {this.props.zooSubjectId}</p>
            <p>Subject Status: {this.props.zooSubjectStatus}</p>
            {this.props.zooSubjectStatusMessage && (
              <p>Subject Error Message: {this.props.zooSubjectStatusMessage.toString()}</p>)}
            <hr />
            <p>Classification Status: {this.props.zooClassificationStatus}</p>
            {this.props.zooSubjectStatusMessage && (
              <p>Classification Error Message: {this.props.zooClassificationStatusMessage.toString()}</p>)}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    ...ZOODATA_MAP_STATE(state)
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
