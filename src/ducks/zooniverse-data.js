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

const ZOODATA_STATUS = {
  IDLE: 'zooniverse-data/IDLE',
  FETCHING: 'zooniverse-data/FETCHING',
  SENDING: 'zooniverse-data/SENDING',
  SUCCESS: 'zooniverse-data/SUCCESS',
  ERROR: 'zooniverse-data/SUCCESS',
};

/*
--------------------------------------------------------------------------------
 */

// Reducer and Initial State
// -------------------------

const ZOODATA_INITIAL_STATE = {
  zooProjectId: null,
  zooProjectData: null,
  zooProjectStatus: ZOODATA_STATUS.IDLE,
  zooProjectStatusMessage: null,
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
        //TODO        
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
        zooProjectStatus: ZOODATA_STATUS.SUCCESS,
        zooProjectStatusMessage: action.statusMessage,
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
  fetchProject: (projectId) => {
    return (dispatch) => {
      
      //Store update: enter "fetching" state.
      dispatch({ type: FETCH_PROJECT, projectId });
      
      //Asynchronous action
      apiClient.type('projects').get(projectId)
        .then((project)=>{
          //Store update: enter "success" state and save fetched data.
          dispatch({ type: FETCH_PROJECT_SUCCESS, projectData: project });
        })
      
        .catch((err)=>{
          //Store update: enter "error" state.
          dispatch({ type: FETCH_PROJECT_ERROR, statusMessage: err });
        });
    }
  },
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
