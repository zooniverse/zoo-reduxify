/*
Zooniverse Data Connector
-------------------------

This duck/functionality library allows Custom Front Ends to more easily connect
to, and manage, basic Zooniverse data functionality. This includes fetching
Project data, managing Workflow data, and submitting Classifications.

--------------------------------------------------------------------------------
 */

import apiClient from 'panoptes-client/lib/api-client.js';

// Constants and Action Types
// --------------------------

const FETCH_PROJECT = 'zooniverse-data/FETCH_PROJECT';
const FETCH_PROJECT_SUCCESS = 'zooniverse-data/FETCH_PROJECT_SUCCESS';
const FETCH_PROJECT_ERROR = 'zooniverse-data/FETCH_PROJECT_ERROR';
const FETCH_WORKFLOW = 'zooniverse-data/FETCH_WORKFLOW';
const FETCH_WORKFLOW_SUCCESS = 'zooniverse-data/FETCH_WORKFLOW_SUCCESS';
const FETCH_WORKFLOW_ERROR = 'zooniverse-data/FETCH_WORKFLOW_ERROR';

const ZOODATA_STATUS = {
  IDLE: 'zooniverse-data/IDLE',
  FETCHING: 'zooniverse-data/FETCHING',
  SENDING: 'zooniverse-data/SENDING',
  SUCCESS: 'zooniverse-data/SUCCESS',
  ERROR: 'zooniverse-data/ERROR',
};

/*
--------------------------------------------------------------------------------
 */

// Reducer and Initial State
// -------------------------

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

const DEFAULT_SUBJECT_VALUES = {};
const DEFAULT_CLASSIFICATION_VALUES = {};

const ZOODATA_INITIAL_STATE = {
  ...DEFAULT_PROJECT_VALUES,
  ...DEFAULT_WORKFLOW_VALUES,
  ...DEFAULT_SUBJECT_VALUES,
  ...DEFAULT_CLASSIFICATION_VALUES
};

const zoodataReducer = (state = ZOODATA_INITIAL_STATE, action) => {
  switch (action.type) {
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
    //----- Workflows
    case FETCH_WORKFLOW:
      return Object.assign({}, state, {
        zooWorkflowId: action.workflowId,
        zooWorkflowData: null,
        zooWorkflowStatus: ZOODATA_STATUS.FETCHING,
        zooWorkflowStatusMessage: null

        //Reset all Project dependencies
        //TODO
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

    default:
      return state;
  };
};

/*
--------------------------------------------------------------------------------
 */

// Action Creators
// ---------------

const ZooData =  {
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
  }
};

/*
--------------------------------------------------------------------------------
 */

// Exports
// -------

export default zoodataReducer;

export {
  ZooData,
  ZOODATA_INITIAL_STATE,
  ZOODATA_STATUS,
};
