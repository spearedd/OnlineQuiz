import { produce } from 'immer';
import { setLoaderAction, stopLoaderAction } from '../loader';
import { showPopUpAction } from '../pop-up';
import { checkFetchError, fetchApi, fetchApiSendJson, shuffle } from '../../utils';

// actions are handled by socketMiddleware
export const wsConnect = (ping = false) => ({ type: 'WS_CONNECT', ping });
export const wsDisconnect = () => ({ type: 'WS_DISCONNECT' });
export const wsPing = command => ({ type: 'WS_PING', command });
// end of socketMiddleware actions

export const wsConnected = () => ({ type: 'WS_CONNECTED' });
export const wsDisconnected = () => ({ type: 'WS_DISCONNECTED' });
export const wsConnecting = () => ({ type: 'WS_CONNECTING' });
export const wsCrash = () => ({ type: 'WS_CRASH' });

export const fetchQuestions = selectedCategories => async dispatch => {
  try {
    dispatch(setLoaderAction('Retrieving Questions...'));
    dispatch({ type: 'CLEAR_QUESTIONS' });
    await Promise.all(
      selectedCategories.map(async ({ category }) => {
        const response = await fetchApi(`categories/${category}/questions`);
        const questions = await checkFetchError(response);
        dispatch({ type: 'QUESTIONS_FETCHED', questions });
      })
    );
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const confirmQuestionAndContinue = (roomCode, question) => async dispatch => {
  try {
    dispatch(setLoaderAction('Loading...'));
    const response = await fetchApiSendJson(`rooms/${roomCode}/question`, 'PUT', { question });
    const { questionClosed, questionNo } = await checkFetchError(response);

    dispatch({ type: 'CONFIRM_QUESTION_SELECTED', question, questionClosed, questionNo });
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const endQuizz = roomCode => async dispatch => {
  try {
    dispatch(setLoaderAction('Loading...'));
    const response = await fetchApi(`rooms/${roomCode}`, 'DELETE');
    await checkFetchError(response);

    dispatch(clearQuizzMaster());
    dispatch(wsDisconnect());
    dispatch(showPopUpAction('🏁', 'Quizz Ended.'));
  } catch (error) {
    dispatch(showPopUpAction('ERROR', error.message));
  } finally {
    dispatch(stopLoaderAction());
  }
};

export const clearQuizzMaster = () => ({ type: 'CLEAR_QUIZZ_MASTER' });

export default produce((draft, action) => {
  switch (action.type) {
    case 'QUESTIONS_FETCHED':
      shuffle(action.questions);
      draft.questions = [...draft.questions, ...action.questions];
      return;
    case 'ITEM_LIST_CHANGED_QUESTIONS':
      draft.selectedQuestion = action.value;
      return;
    case 'CLEAR_QUESTIONS':
      draft.questions = [];
      return;
    case 'CONFIRM_QUESTION_SELECTED':
      draft.currentQuestion = action.question;
      draft.questionsAsked = [...draft.questionsAsked, action.question._id];
      draft.questionClosed = action.questionClosed;
      draft.question = action.questionNo;
      draft.selectedQuestion = null;
      return;
    default:
      return;
  }
});
