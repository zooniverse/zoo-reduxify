/*
Zooniverse Data Connector
-------------------------

This duck/functionality library allows Custom Front Ends to more easily connect
to, and manage, basic Zooniverse data functionality. This includes fetching
Project data, managing Workflow data, and submitting Classifications.

--------------------------------------------------------------------------------
 */

import apiClient from 'panoptes-client/lib/api-client.js';

//TODO
//const config = {
//  log: true,  //true/false: show console.log and console.error messages.
//};

/*
--------------------------------------------------------------------------------
 */

// Constants and Action Types
// --------------------------

const FETCH_PROJECT = 'zooniverse-data/FETCH_PROJECT';
const FETCH_PROJECT_SUCCESS = 'zooniverse-data/FETCH_PROJECT_SUCCESS';
const FETCH_PROJECT_ERROR = 'zooniverse-data/FETCH_PROJECT_ERROR';
const FETCH_WORKFLOW = 'zooniverse-data/FETCH_WORKFLOW';
const FETCH_WORKFLOW_SUCCESS = 'zooniverse-data/FETCH_WORKFLOW_SUCCESS';
const FETCH_WORKFLOW_ERROR = 'zooniverse-data/FETCH_WORKFLOW_ERROR';
const FETCH_SUBJECT = 'zooniverse-data/FETCH_SUBJECT';
const FETCH_SUBJECT_SUCCESS = 'zooniverse-data/FETCH_SUBJECT_SUCCESS';
const FETCH_SUBJECT_ERROR = 'zooniverse-data/FETCH_SUBJECT_ERROR';

const ZOODATA_STATUS = {
  IDLE: 'zooniverse-data/IDLE',
  FETCHING: 'zooniverse-data/FETCHING',
  SENDING: 'zooniverse-data/SENDING',
  SUCCESS: 'zooniverse-data/SUCCESS',
  ERROR: 'zooniverse-data/ERROR',
};

//See ./reducer.js for the store name.
const REDUX_STORE_NAME = 'zooniverseData';

/*
--------------------------------------------------------------------------------
 */

// Initial State / Default Values
// ------------------------------

const DEFAULT_PROJECT_VALUES = {
  zooProjectId: null,
  zooProjectData: null,
  zooProjectStatus: ZOODATA_STATUS.IDLE,
  zooProjectStatusMessage: null,
};

const DEFAULT_WORKFLOW_VALUES = {
  zooWorkflowId: null,
  zooWorkflowData: null,
  zooWorkflowStatus: ZOODATA_STATUS.IDLE,
  zooWorkflowStatusMessage: null,
};

const DEFAULT_SUBJECT_VALUES = {
  zooSubjectId: null,
  zooSubjectData: null,
  zooSubjectStatus: ZOODATA_STATUS.IDLE,
  zooSubjectStatusMessage: null,
};
const DEFAULT_CLASSIFICATION_VALUES = {};

/*
--------------------------------------------------------------------------------
 */

// React-Redux Helper Objects
// --------------------------

/*  ZOODATA_INITIAL_STATE defines the default/starting values of the Redux
    store. To use this in your Redux-connected React components, try...

    Usage:
      MyReactComponent.defaultProps = {
        ...ZOODATA_INITIAL_STATE,
        otherProp: 'default value'
      };
 */
const ZOODATA_INITIAL_STATE = {
  ...DEFAULT_PROJECT_VALUES,
  ...DEFAULT_WORKFLOW_VALUES,
  ...DEFAULT_SUBJECT_VALUES,
  ...DEFAULT_CLASSIFICATION_VALUES
};

/*  ZOODATA_PROPTYPES is used to define the property types of the data, and
    only matters to Redux-connected React components, and can be used like...

    Usage:
      MyReactComponent.propTypes = {
        ...ZOODATA_PROPTYES,
        otherProp: PropTypes.string,
      };
 */

const ZOODATA_PROPTYPES = {
  //TODO
};

/*
--------------------------------------------------------------------------------
 */

const zoodataReducer = (state = ZOODATA_INITIAL_STATE, action) => {
  switch (action.type) {

    // Projects
    // --------------------------------

    case FETCH_PROJECT:
      return Object.assign({}, state, {
        zooProjectId: action.projectId,
        zooProjectData: null,
        zooProjectStatus: ZOODATA_STATUS.FETCHING,
        zooProjectStatusMessage: null,

        //Reset all Project dependencies
        ...DEFAULT_WORKFLOW_VALUES,
        ...DEFAULT_SUBJECT_VALUES,
        ...DEFAULT_CLASSIFICATION_VALUES
      });
    case FETCH_PROJECT_SUCCESS:
      return Object.assign({}, state, {
        zooProjectData: action.projectData,
        zooProjectStatus: ZOODATA_STATUS.SUCCESS,
        zooProjectStatusMessage: null,
      });
    case FETCH_PROJECT_ERROR:
      return Object.assign({}, state, {
        zooProjectData: action.projectData,
        zooProjectStatus: ZOODATA_STATUS.ERROR,
        zooProjectStatusMessage: action.statusMessage,
      });

    // Workflows
    // --------------------------------

    case FETCH_WORKFLOW:
      return Object.assign({}, state, {
        zooWorkflowId: action.workflowId,
        zooWorkflowData: null,
        zooWorkflowStatus: ZOODATA_STATUS.FETCHING,
        zooWorkflowStatusMessage: null,

        //Reset all Workflow dependencies
        ...DEFAULT_SUBJECT_VALUES,
        ...DEFAULT_CLASSIFICATION_VALUES
      });
    case FETCH_WORKFLOW_SUCCESS:
      return Object.assign({}, state, {
        zooWorkflowData: action.workflowData,
        zooWorkflowStatus: ZOODATA_STATUS.SUCCESS,
        zooWorkflowStatusMessage: null
      });
    case FETCH_WORKFLOW_ERROR:
      return Object.assign({}, state, {
        zooWorkflowData: action.workflowData,
        zooWorkflowStatus: ZOODATA_STATUS.ERROR,
        zooWorkflowStatusMessage: action.statusMessage
      });

    // Subjects
    // --------------------------------
    case FETCH_SUBJECT:
      return Object.assign({}, state, {
        zooSubjectId: action.subjectId,
        zooSubjectData: null,
        zooSubjectStatus: ZOODATA_STATUS.FETCHING,
        zooSubjectStatusMessage: null,

        //Reset all Subject dependencies
        ...DEFAULT_CLASSIFICATION_VALUES
      });

    case FETCH_SUBJECT_SUCCESS:
      return Object.assign({}, state, {
        zooSubjectData: action.subjectData,
        zooSubjectStatus: ZOODATA_STATUS.SUCCESS,
        zooSubjectStatusMessage: null
      });

    case FETCH_SUBJECT_ERROR:
      return Object.assign({}, state, {
        zooSubjectData: action.subjectData,
        zooSubjectStatus: ZOODATA_STATUS.ERROR,
        zooSubjectStatusMessage: action.statusMessage
      });

    default:
      return state;
  };
};

/*
--------------------------------------------------------------------------------
 */

// Action Creators
// ---------------

/*  All Zooniverse Data-related actions are packaged into a single "library
    object" for ease of importing between components.
 */
const ZooData = {

  /*  Fetches a Zooniverse project from Panoptes.
      projectId: ID of the project, as a string. e.g.: "1234"
      onSucccess: callback function when the fetch succeeds.
      onError: callback function when the fetch fails.
   */
  fetchProject: (projectId, onSuccess = () => {}, onError = () => {}) => {
    return (dispatch) => {
      //Store update: enter "fetching" state.
      dispatch({ type: FETCH_PROJECT, projectId });

      //Asynchronous action
      apiClient.type('projects').get(projectId)
        .then((project) => {
          //Store update: enter "success" state and save fetched data.
          dispatch({ type: FETCH_PROJECT_SUCCESS, projectData: project });

          onSuccess();
        })

        .catch((err) => {
          //Store update: enter "error" state.
          dispatch({ type: FETCH_PROJECT_ERROR, statusMessage: err });

          onError();
        });
    };
  },

  /*  Fetches a Zooniverse workflow from Panoptes.
      workflowId: ID of the workflow, as a string. e.g.: "1234"
      onSucccess: callback function when the fetch succeeds.
      onError: callback function when the fetch fails.
   */
  fetchWorkflow: (workflowId, onSuccess = () => {}, onError = () => {}) => {
    return (dispatch) => {
      //Store update: enter "fetching" state.
      dispatch({ type: FETCH_WORKFLOW, workflowId });

      //Asynchronous action
      apiClient.type('workflows').get(workflowId)
        .then((workflow)=>{
          //Store update: enter "success" state and save fetched data.
          dispatch({ type: FETCH_WORKFLOW_SUCCESS, workflowData: workflow });

          onSuccess();
        })

        .catch((err)=>{
          //Store update: enter "error" state.
          dispatch({ type: FETCH_WORKFLOW_ERROR, statusMessage: err });

          onError();
        });
      };
  },

  fetchSubject: (subjectId, onSuccess = () => {}, onError = () => {}) => {
    return (dispatch) => {
      //Store update: enter "fetching" state.
      dispatch({ type: FETCH_SUBJECT, subjectId });

      //Asynchronous action
      apiClient.type('subjects').get(subjectId)
        .then((subject) => {
          //Store update: enter "success" state and save fetched data.
          dispatch({ type: FETCH_SUBJECT_SUCCESS, subjectData: subject });

          onSuccess();
        })

        .catch((err)=>{
          //Store update: enter "error" state.
          dispatch({ type: FETCH_SUBJECT_ERROR, statusMessage: err });

          onError();
        });
      };
  }

};

/*
--------------------------------------------------------------------------------
 */

// Helper Functions
// ----------------

/*  Used as a convenience feature in mapStateToProps() functions in
    Redux-connected React components.

    Usage:
      mapStateToProps = (state) => {
        return {
          ...getZooDataStateValues(state),
          someOtherValue: state.someOtherStore.someOtherValue
        }
      }
 */
const getZooDataStateValues = (state) => {
  return {
    zooProjectId: state[REDUX_STORE_NAME].zooProjectId,
    zooProjectData: state[REDUX_STORE_NAME].zooProjectData,
    zooProjectStatus: state[REDUX_STORE_NAME].zooProjectStatus,
    zooProjectStatusMessage: state[REDUX_STORE_NAME].zooProjectStatusMessage,
    zooWorkflowId: state[REDUX_STORE_NAME].zooWorkflowId,
    zooWorkflowData: state[REDUX_STORE_NAME].zooWorkflowData,
    zooWorkflowStatus: state[REDUX_STORE_NAME].zooWorkflowStatus,
    zooWorkflowStatusMessage: state[REDUX_STORE_NAME].zooWorkflowStatusMessage,
    zooSubjectId: state[REDUX_STORE_NAME].zooSubjectId,
    zooSubjectData: state[REDUX_STORE_NAME].zooSubjectData,
    zooSubjectStatus: state[REDUX_STORE_NAME].zooSubjectStatus,
    zooSubjectStatusMessage: state[REDUX_STORE_NAME].zooSubjectStatusMessage
  };
};

/*
--------------------------------------------------------------------------------
 */

// Exports
// -------

export default zoodataReducer;

export {
  ZooData,
  getZooDataStateValues,
  ZOODATA_INITIAL_STATE,
  ZOODATA_PROPTYPES,
  ZOODATA_STATUS,
};
