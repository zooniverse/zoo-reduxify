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
const UPDATE_SUBJECT_QUEUE = 'zooniverse-data/UPDATE_SUBJECT_QUEUE';
const CREATE_CLASSIFICATION = 'zooniverse-data/CREATE_CLASSIFICATION';
const UPDATE_CLASSIFICATION = 'zooniverse-data/UPDATE_CLASSIFICATION';
const SUBMIT_CLASSIFICATION = 'zooniverse-data/SUBMIT_CLASSIFICATION';
const SUBMIT_CLASSIFICATION_SUCCESS = 'zooniverse-data/SUBMIT_CLASSIFICATION_SUCCESS';
const SUBMIT_CLASSIFICATION_ERROR = 'zooniverse-data/SUBMIT_CLASSIFICATION_ERROR';

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
  zooSubjectQueue: null,
};

const DEFAULT_CLASSIFICATION_VALUES = {
  zooClassificationObject: null,
  zooClassificationStatus: ZOODATA_STATUS.IDLE,
  zooClassificationStatusMessage: null,
};

/*
--------------------------------------------------------------------------------
 */

// React-Redux Helper Objects/Functions
// ------------------------------------

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
  ...DEFAULT_CLASSIFICATION_VALUES,
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

/*  ZOODATA_MAP_STATE is used as a convenience feature in mapStateToProps()
    functions in Redux-connected React components.

    Usage:
      mapStateToProps = (state) => {
        return {
          ...ZOODATA_MAP_STATE(state),
          someOtherValue: state.someOtherStore.someOtherValue
        }
      }
 */
const ZOODATA_MAP_STATE = (state) => {
  const mappedObject = {};
  Object.keys(ZOODATA_INITIAL_STATE).map((key) => {
    mappedObject[key] = state[REDUX_STORE_NAME][key];
  });
  return mappedObject;
};

/*
--------------------------------------------------------------------------------
 */

// Redux Reducer
// -------------

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
        zooWorkflowStatus: ZOODATA_STATUS.ERROR,
        zooWorkflowStatusMessage: action.statusMessage
      });

    // Subjects
    // --------------------------------

    case FETCH_SUBJECT:
      return Object.assign({}, state, {
        zooSubjectId: action.subjectId,
        //Note: if fetchSubject() is called without a specific ID (i.e. using
        //the subject queue), this will be undefined at first, until the queue
        //is fetched.
        
        zooSubjectData: null,
        zooSubjectStatus: ZOODATA_STATUS.FETCHING,
        zooSubjectStatusMessage: null,

        //Reset all Subject dependencies
        ...DEFAULT_CLASSIFICATION_VALUES
      });

    case FETCH_SUBJECT_SUCCESS:
      return Object.assign({}, state, {
        zooSubjectId: (action.subjectData)
          ? action.subjectData.id : state.zooSubjectId,
        //Note: This "update subject id" logic is redunant if fetchSubject() is
        //called with a specific ID, but necessary if called without an ID
        //(i.e. uses the subject queue).
        
        zooSubjectData: action.subjectData,
        zooSubjectStatus: ZOODATA_STATUS.SUCCESS,
        zooSubjectStatusMessage: null
      });

    case FETCH_SUBJECT_ERROR:
      return Object.assign({}, state, {
        zooSubjectStatus: ZOODATA_STATUS.ERROR,
        zooSubjectStatusMessage: action.statusMessage
      });

    case UPDATE_SUBJECT_QUEUE:
      return Object.assign({}, state, {
        zooSubjectQueue: action.subjectQueue
      });
      
    
    // Classifications
    // --------------------------------
    
    case CREATE_CLASSIFICATION:
      return Object.assign({}, state, {
        zooClassificationObject: action.classification,
        zooClassificationStatus: ZOODATA_STATUS.IDLE,
        zooClassificationStatusMessage: null,
      });
    
    case UPDATE_CLASSIFICATION:
      return Object.assign({}, state, {
        zooClassificationObject: action.classification,
      });
    
    case SUBMIT_CLASSIFICATION:
      return Object.assign({}, state, {
        zooClassificationStatus: ZOODATA_STATUS.SENDING,
      });
    
    case SUBMIT_CLASSIFICATION_SUCCESS:
      return Object.assign({}, state, {
        zooClassificationStatus: ZOODATA_STATUS.SUCCESS,
      });
    
    case SUBMIT_CLASSIFICATION_ERROR:
      return Object.assign({}, state, {
        zooClassificationStatus: ZOODATA_STATUS.ERROR,
        zooClassificationStatusMessage: action.statusMessage,
      });
      
    // --------------------------------

    default:
      return state;
  };
};

/*
--------------------------------------------------------------------------------
 */

// Action Creators
// ---------------

/*  Fetches a Zooniverse project from Panoptes.
    projectId: ID of the project, as a string. e.g.: "1234"
 */
const fetchProject = (projectId) => {
  return (dispatch) => {
    //Store update: enter "fetching" state.
    dispatch({ type: FETCH_PROJECT, projectId });

    //Asynchronous action
    //Remember to `return` the apiClient to allow Promise-chaining.
    return apiClient.type('projects').get(projectId)
      .then((project) => {
        //Sanity check
        if (!project) { throw new Error('ZooData.fetchProject() error: no project data'); }

        //Store update: enter "success" state and save fetched data.
        dispatch({ type: FETCH_PROJECT_SUCCESS, projectData: project });

        //Endpoint: Success
        return project;
      })

      .catch((err) => {
        //Store update: enter "error" state.
        dispatch({ type: FETCH_PROJECT_ERROR, statusMessage: err });

        //Endpoint: Error
        throw(err);
      });
  };
};

/*  Fetches a Zooniverse workflow from Panoptes.
    workflowId: ID of the workflow, as a string. e.g.: "1234"
 */
const fetchWorkflow = (workflowId) => {
  return (dispatch) => {
    //Store update: enter "fetching" state.
    dispatch({ type: FETCH_WORKFLOW, workflowId });

    //Asynchronous action
    //Remember to `return` the apiClient to allow Promise-chaining.
    return apiClient.type('workflows').get(workflowId)
      .then((workflow)=>{
        //Sanity check
        if (!workflow) { throw new Error('ZooData.fetchWorkflow() error: no workflow data'); }

        //Store update: enter "success" state and save fetched data.
        dispatch({ type: FETCH_WORKFLOW_SUCCESS, workflowData: workflow });

        //Endpoint: Success
        return workflow;
      })

      .catch((err)=>{
        //Store update: enter "error" state.
        dispatch({ type: FETCH_WORKFLOW_ERROR, statusMessage: err });

        //Endpoint: Error
        throw(err);
      });
    };
};

/*  Fetches a Zooniverse subject from Panoptes.
    subjectId: OPTIONAL. ID of the subject, as a string. e.g.: "1234"
      If unspecified (undefined), fetches from list of queued subjects.
 */
const fetchSubject = (subjectId = undefined) => {
  return (dispatch, getState) => {

    //Fetch Specific Subject
    if (subjectId) {

      //Store update: enter "fetching" state.
      dispatch({ type: FETCH_SUBJECT, subjectId });

      //Asynchronous action
      //Remember to `return` the apiClient to allow Promise-chaining.
      return apiClient.type('subjects').get(subjectId)
        .then((subject) => {
          //Sanity check
          if (!subject) { throw new Error('ZooData.fetchSubject() error: no subject data'); }

          //Store update: enter "success" state and save fetched data.
          dispatch({ type: FETCH_SUBJECT_SUCCESS, subjectData: subject });
        
          //Create a new classification for this subject.
          dispatch(ZooData.createClassification());

          //Endpoint: Success
          return subject;
        })

        .catch((err)=>{
          //Store update: enter "error" state.
          dispatch({ type: FETCH_SUBJECT_ERROR, statusMessage: err });

          //Endpoint: Error
          throw(err);
        });

    //Fetch Next Subject In Queue
    } else {
      //Store update: enter "fetching" state.
      dispatch({ type: FETCH_SUBJECT, subjectId: undefined });
      //TODO What if the fetched queue is empty?

      //Is there a queue and are there subjects in the queue?
      const store = getState()[REDUX_STORE_NAME];
      if (store.zooSubjectQueue && store.zooSubjectQueue.length > 0) {
        const queue = store.zooSubjectQueue.slice();  //Create a copy of the queue.
        const subject = queue.shift();

        //Store update: enter "success" state and save fetched data.
        dispatch({ type: FETCH_SUBJECT_SUCCESS, subjectData: subject });
        
        //Create a new classification for this subject.
        dispatch(ZooData.createClassification());

        //Store update: update the queue.
        dispatch({ type: UPDATE_SUBJECT_QUEUE, subjectQueue: queue });

        //Endpoint: Success
        return subject;

      //If there's no queue, or the queue's empty, fetch a fresh new one.
      } else {

        //Asynchronous action
        //Remember to `return` the apiClient to allow Promise-chaining.
        return apiClient.type('subjects/queued').get({ workflow_id: store.zooWorkflowId }) // TODO: Maybe make the query more flexible?
          .then((subjectQueue) => {
            //Sanity check
            if (!subjectQueue || subjectQueue.length === 0) {
              throw new Error('ZooData.fetchSubject() error: invalid subject queue');
            }

            const queue = subjectQueue.slice();  // Create a copy of the queue.
            const subject = queue.shift();

            //Store update: enter "success" state and save fetched data.
            dispatch({ type: FETCH_SUBJECT_SUCCESS, subjectData: subject });
          
            //Create a new classification for this subject.
            dispatch(ZooData.createClassification());

            //Store update: update the queue.
            dispatch({ type: UPDATE_SUBJECT_QUEUE, subjectQueue: queue });

            //Endpoint: Success
            return subject;
          })
          .catch((err)=>{
            //Store update: enter "error" state.
            dispatch({ type: FETCH_SUBJECT_ERROR, statusMessage: err });

            //Endpoint: Error
            throw(err);
          });
      }
    }
  }
};

/*  Creates a Zooniverse classification for the current Zooniverse subject;
    this classification is the user's "answer" that will be submitted to
    Panoptes.
    annotations: OPTIONAL. The initial annotations for the classification. This
      field is OK to leave blank at the "create classification" stage, because
      usually, the CFE manually updates this field right before the "submit
      classification" step.
    metadata: OPTIONAL.
 */
const createClassification = (annotations = [], metadata = {}) => {
  return (dispatch, getState) => {
    //Sanity check
    const store = getState()[REDUX_STORE_NAME];
    const project = store.zooProjectData;
    const workflow = store.zooWorkflowData;
    const subject = store.zooSubjectData;
    if (!project || !workflow || !subject) { throw new Error('ZooData.createClassification() error: no project, workflow, and/or subject data'); }

    const classificationData = {
      annotations,
      metadata: {
        workflow_version: workflow.version,
        started_at: (new Date()).toISOString(),
        finished_at: (new Date()).toISOString(),
        user_agent: (window.navigator) ? window.navigator.userAgent : '',
        user_language: '',
        utc_offset: ((new Date()).getTimezoneOffset() * 60).toString(),
        subject_dimensions: subject.imageMetadata,
        ...metadata,
      },
      links: {
        project: store.zooProjectId,
        workflow: store.zooWorkflowId,
        subjects: [store.zooSubjectId]
      }
    };

    const classification = apiClient.type('classifications').create(classificationData);
    classification._workflow = workflow;  //Warning: voodoo. Not sure what this is for, but it's used in PFE. (@shaun.a.noordin 20180511)
    classification._subjects = [subject];  //Warning: voodoo.

    //Store update: new classification created.
    dispatch({ type: CREATE_CLASSIFICATION, classification });
    
    //Endpoint
    return classification;  //Return, to allow Promise chaining.
  }
}

/*  Updates a Zooniverse classification. e.g. let's say you want to add new
    annotations to the classification right before submitClassification().
    
    Example:
      dispatch(updateClassification({
        annotations: [{ task:'T1', x:16, y:32, value:'apples' }],
        completed: true,
        'metadata.finished_at': (new Date()).toISOString(),
      })).then(()=>{
        dispatch(submitClassification());
      });
    
    WARNING: This method is mildly unreliable in triggering React component
    renders, since the _pointer_ to the classificationObject (the pointer is
    what's recorded in the store, not the object) doesn't change.
 */
const updateClassification = (classificationData) => {
  return (dispatch, getState) => {
    //Sanity check
    const store = getState()[REDUX_STORE_NAME];
    const classification = store.zooClassificationObject;
    if (!classification) { throw new Error('ZooData.updateClassification() error: no classification to update'); }
    
    classification.update(classificationData);
    
    //Store update: new classification created.
    dispatch({ type: CREATE_CLASSIFICATION, classification });
    
    //Endpoint
    return classification;  //Return, to allow Promise chaining.
  }
}

/*  Submit a Zooniverse classification.
    extraClassificationData: OPTIONAL. Adds final metadata to the classification
      before submission.
    
    WARNING: cannot submit if classification.annotations is empty.
 */
const submitClassification = (extraClassificationData = {}) => {
  return (dispatch, getState) => {
    //Sanity check
    const store = getState()[REDUX_STORE_NAME];
    const classification = store.zooClassificationObject;
    if (!classification) { throw new Error('ZooData.submitClassification() error: no classification to submit'); }
    
    //Store update: enter "sending" state.
    dispatch({ type: SUBMIT_CLASSIFICATION });
    
    return classification
      .update({  //pre-submission update
        completed: true,
        'metadata.finished_at': (new Date()).toISOString(),
        ...extraClassificationData,
      })
      .save()

      .then((data) => {
        //Store update: enter "success" state.
        dispatch({ type: SUBMIT_CLASSIFICATION_SUCCESS });

        //Endpoint: success
        return data;
      })
    
      .catch((err) => {
        //Store update: enter "error" state.
        dispatch({ type: SUBMIT_CLASSIFICATION_ERROR });

        //Endpoint: error
        throw(err);
      });
  }
};

/*  All Zooniverse Data-related actions are packaged into a single "library
    object" for ease of importing between components.
 */
const ZooData = {
  fetchProject,
  fetchWorkflow,
  fetchSubject,
  createClassification,
  updateClassification,
  submitClassification,
};

/*
--------------------------------------------------------------------------------
 */

// Exports
// -------

export default zoodataReducer;

export {
  ZooData,
  ZOODATA_MAP_STATE,
  ZOODATA_INITIAL_STATE,
  ZOODATA_PROPTYPES,
  ZOODATA_STATUS,
};
