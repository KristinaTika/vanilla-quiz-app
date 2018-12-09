import *  as data from './data.js';
import * as ui from './ui.js';

/*  
=====================
  ADMIN SECTION START
=====================
*/
const insertQuestionHandler = () => {

    // selektujemo svaki put odgovore, kako bi se dinamicki povecavao broj odgovora koje dodajemo u pitanju
    const adminOptions = document.querySelectorAll('.admin-option');


    const checkBoolean = data.addQuestionToLocalStorage(ui.newQuestionsText, adminOptions, ui.clickedOptions);

    if(checkBoolean) {
        ui.createQuestionList(data.questionMethodsForLocalStorage);
    }
}

const addInsertQuestionListener = () => {
    ui.insertQuestionBtn.addEventListener('click', insertQuestionHandler);
}

const editQuestionsHandler = (event) => {
    ui.editQuestionsList(event, data.questionMethodsForLocalStorage, ui.addQuestionInputsDinamically,  ui.createQuestionList);
}

const addEditQuestionsListener = () => {
    ui.questionsList.addEventListener('click', editQuestionsHandler);
}

const clearQuestionsListHandler = () => {
    ui.clearQuestionList(data.questionMethodsForLocalStorage);
}

const addClearQuestionsListListener = () => {
    ui.clearQuestionBtn.addEventListener('click', clearQuestionsListHandler);
}

const addResultOnPanel = () => {
    ui.addResultOnPanel(data.personLocalStorage);
}

const deleteResultsHandler = (event) => {
    ui.deleteResults(event, data.personLocalStorage);
    addResultOnPanel();
}

const addDeleteSingleResultListener = () => {
    ui.resultsListWrapper.addEventListener('click', deleteResultsHandler);
}

const clearResultsListHandler = () => {
    ui.clearResultsList(data.personLocalStorage);
}

const addClearResultsListListener = () => {
    ui.clearResultsBtn.addEventListener('click', clearResultsListHandler);
}

const adminSection = () => {
    ui.addQuestionInputsDinamically();
    ui.createQuestionList(data.questionMethodsForLocalStorage);
    addInsertQuestionListener();
    addEditQuestionsListener();
    addClearQuestionsListListener();
    addResultOnPanel();
    addDeleteSingleResultListener();
    addClearResultsListListener();
}

/*  
====================
  ADMIN SECTION END
====================
*/

/*  
======================
  QUIZ SECTION START
======================
*/

const checkAnswerHandler = (event) => {
    ui.checkAnswer(event, data.checkAnswer, data.isQuizFinished);
}

const addCheckAnswerListener = () => {
    ui.quizOptionsWrapper.addEventListener('click', checkAnswerHandler);
}

const nextQuestionHandler = () => {
    ui.nextQuestion(data.questionMethodsForLocalStorage, data.quizProgress, data.isQuizFinished, data.addPersonToLocalStorage, data.currentPersonData);
}

const addNextQuestionListener = () => {
    ui.nextQuestionBtn.addEventListener('click', nextQuestionHandler);
}

const quizSection = () => {
    ui.renderQuestions(data.questionMethodsForLocalStorage, data.quizProgress);
    ui.renderProgress(data.questionMethodsForLocalStorage, data.quizProgress);
    addCheckAnswerListener();
    addNextQuestionListener();
}
/*  
====================
  QUIZ SECTION END
====================
*/

/*  
============================
  START QUIZ SECTION START
============================
*/

const startQuizHandler = () => {
    ui.getFullName(data.currentPersonData, data.questionMethodsForLocalStorage, data.adminFullName);
}

const addLoginOnEnterListener = () => {
    ui.lastName.addEventListener('focus', (event) => {
        ui.lastName.addEventListener('keypress', (event) => {
            if(event.keyCode === 13) {
                ui.getFullName(data.currentPersonData, data.questionMethodsForLocalStorage, data.adminFullName);
            }
        });
    });
}

const addStartQuizListener = () => {
    ui.startQuizBtn.addEventListener('click', startQuizHandler);
}

const startQuizSection = () => {
    addStartQuizListener();
    addLoginOnEnterListener();
}

export const init = () => {
    adminSection();
    quizSection();
    startQuizSection();
}