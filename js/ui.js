/*  
=========================
  ADMIN SECTION - START
=========================
*/

/*  
=======================
  select DOM elements
=======================
*/
const adminPanelSection = document.querySelector('.admin-panel-container');
export const insertQuestionBtn = document.querySelector('#question-insert-btn');
export const newQuestionsText = document.querySelector('#new-question-text');
export const adminOptions = document.querySelectorAll('.admin-option');
const adminOptionsContainer = document.querySelector('.admin-options-container');
export const questionsList = document.querySelector('.inserted-questions-wrapper');
const updateQuestionBtn = document.querySelector('#question-update-btn');
const deleteQuestionBtn = document.querySelector('#question-delete-btn');
export const clearQuestionBtn = document.querySelector('#questions-clear-btn');
export const resultsListWrapper = document.querySelector('.results-list-wrapper');
export const clearResultsBtn = document.querySelector('#results-clear-btn');



const addInputHandler = () => {

    const counter = document.querySelectorAll('.admin-option').length;
    const newAnswerField = document.createElement('div');
    newAnswerField.setAttribute('class', 'admin-option-wrapper');
    newAnswerField.innerHTML = `
    <input type="radio" class="admin-option-${counter}" name="answer" value=${counter}>
    <input type="text" class="admin-option admin-option-${counter}" value="">
    `;
    adminOptionsContainer.appendChild(newAnswerField);

    // skloni event listener sa 2. odgovora
    adminOptionsContainer.lastElementChild.previousElementSibling.lastElementChild.removeEventListener('focus', addInputHandler);

    // stavi event listener na poslednji odgovor
    adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInputHandler);

}

export const addQuestionInputsDinamically = () => {
    /*
        adminOptionsContainer --> kontejner za odgovore
        adminOptionsContainer.lastElementChild --> kontejner za poslednji odgovor (sadrzi radio button i input type text)
        adminOptionsContainer.lastElementChild.lastElementChild -->  input type text (odgovor)
    */
    adminOptionsContainer.lastElementChild.lastElementChild.addEventListener('focus', addInputHandler);
}

export const createQuestionList = (getQuestions) => {

    questionsList.innerHTML = "";

    if (getQuestions.getQuestionCollection() === null) {
        getQuestions.setQuestionCollection([]);
    } else {
        getQuestions.getQuestionCollection().forEach((q) => {
            const questionItem = document.createElement('li');
            questionItem.innerHTML = `
                <span>${q.id + 1}. ${q.questionText}</span>
                <button id="question-${q.id}">Edit</button>
            `;

            questionsList.appendChild(questionItem);
        });
    }
}

export const editQuestionsList = (event, storageQuestionList, addInputsFn, updateQuestionListFn) => {
    let getId;
    let getStorageQuestionsList;
    let selectedQuestionToEdit;
    let placeInArray;
    let renderAnswer = '';

    // ako postoji pitanje, i kliknes na EDIT
    if ('question-'.indexOf(event.target.id)) {
        //uzimas Id pitanja iz atributa id, split-ujes i uzmes samo broj (split('-)[1])
        getId = parseInt(event.target.id.split('-')[1]);

        // uzmes iz local storage-a listu pitanja
        getStorageQuestionsList = storageQuestionList.getQuestionCollection();

        // prodjes kroz pitanja
        getStorageQuestionsList.forEach((question) => {
            //  za svako pitanje pitas da li je id pitanja jednak id-iju pitanja na koje si kliknula (dobila si ga preko event objekta);
            if (question.id === getId) {
                // ako jeste, onda selectedQuestionToEdit postaje to pitanje
                selectedQuestionToEdit = question;
                placeInArray = question.id;
            }
        });

        //  input gde ide pitanje postaje vrednost kliknutog pitanja za editovanje
        newQuestionsText.value = selectedQuestionToEdit.questionText;

        // listu odgovora na pitanja ispraznis
        adminOptionsContainer.innerHTML = '';

        // pa za svaki odgovor kreiras ponovo input polje, da bi ti se prikazali svi odgovori konkretnog pitanja
        selectedQuestionToEdit.options.forEach((q) => {
            renderAnswer += ` 
                <div class="admin-option-wrapper">
                    <input type="radio" class="admin-option-${selectedQuestionToEdit.id}" name="answer" value="${selectedQuestionToEdit.id}" />
                    <input type="text" class="admin-option admin-option-${selectedQuestionToEdit.id}" value="${q}" />
                </div>
            `;
        });

        // i onda samo u list dodas odgovore koje si kreirala
        adminOptionsContainer.innerHTML = renderAnswer;

        // ovo je prosledjena funkcija, opet stavljas event listener da bi dinamicki dodala input polje za odgovor kada se fokusiras na poslednji odgovor, definisala si je ranije (pun naziv je addQuestionInputsDinamically);
        addInputsFn();

        // selektovala si button-e za update, delete i insert question, sada ih samo prikazujes, odnosno skrivas
        updateQuestionBtn.style.visibility = 'visible';
        deleteQuestionBtn.style.visibility = 'visible';

        insertQuestionBtn.style.visibility = 'hidden';
        clearQuestionBtn.style.pointerEvents = 'none';

        const clearInputFields = () => {
            let optionElements = document.querySelectorAll('.admin-option');
            newQuestionsText.value = '';
            optionElements.forEach((o) => {
                o.value = '';
                o.previousElementSibling.checked = false;
            });
        }

        const updateQuestionHandler = (event) => {
            //pravis prazan niz kako bi ubacila editovane odgovore
            const newOptions = [];
            // selektujes vec postojece odgovore
            let optionElements = document.querySelectorAll('.admin-option');
            //stavljas vrednost pitanja u input polje
            selectedQuestionToEdit.questionText = newQuestionsText.value;

            // resetujes tacan odgovor
            selectedQuestionToEdit.correctAnswer = '';

            optionElements.forEach((o) => {
                // ako odgovor nije prazan string
                if (o.value !== '') {
                    //  stavi ga u novi niz
                    newOptions.push(o.value);
                    if (o.previousElementSibling.checked) {
                        //  ako si cekirala radio button, uzmi vrednost i stavi u objekat selectedQuestionToEdit
                        selectedQuestionToEdit.correctAnswer = o.value;
                    }
                }
            });
            //  odgovori su jednaki novim odgovorima
            selectedQuestionToEdit.options = newOptions;
            // ako pitanje nije prazno
            if (selectedQuestionToEdit.questionText !== '') {
                //  ako ima vise od jednog odgovora
                if (selectedQuestionToEdit.options.length > 1) {
                    //  ako tacan odgovor je cekiran
                    if (selectedQuestionToEdit.correctAnswer !== '') {
                        //  uzmi iz local storage-a pitanja i zameni sa editovanim pitanjem
                        storageQuestionList.getQuestionCollection().splice(placeInArray, 1, selectedQuestionToEdit);
                        //  setuj u local storage
                        storageQuestionList.setQuestionCollection(getStorageQuestionsList);

                        // resetuj sva input polja
                        clearInputFields();

                        // promeni button-e
                        updateQuestionBtn.style.visibility = 'hidden';
                        deleteQuestionBtn.style.visibility = 'hidden';

                        insertQuestionBtn.style.visibility = 'visible';
                        clearQuestionBtn.style.pointerEvents = '';
                        //  update-uj listu pitanja
                        updateQuestionListFn(storageQuestionList);

                    } else {
                        alert('You missed to check correct answer, or you checked answer without value!')
                    }
                } else {
                    alert('You must insert at least two options!');
                }
            } else {
                alert('Please insert Question!')
            }
        }

        updateQuestionBtn.addEventListener('click', updateQuestionHandler);

        const deleteQuestionHandler = () => {
            //  izbrisi pitanje
            getStorageQuestionsList.splice(placeInArray, 1);
            // setuj novo stanje u local storage
            storageQuestionList.setQuestionCollection(getStorageQuestionsList);
            //  obrisi inpute
            clearInputFields();
            // update-uj listu pitanja
            updateQuestionListFn(storageQuestionList);
        }

        deleteQuestionBtn.addEventListener('click', deleteQuestionHandler);
    }
}

export const clearQuestionList = (storageQuestionList) => {
    //  ako list pitanja nije null, odnosno prazna
    if (storageQuestionList.getQuestionCollection() !== null) {
        // ako ima pitanja vise od 0
        if (storageQuestionList.getQuestionCollection().length > 0) {
            //  confirm() --> kao alert, samo sto je boolean vrednost
            let warningMessage = confirm('WARNING! You will loose the entire question list!');
            // ako si kliknula yes, izbrisi iz local storage-a pitanja
            if (warningMessage) {
                storageQuestionList.removeQuestionCollection();
                // resetuj listu
                questionsList.innerHTML = '';
            }
        }
    }
}

export const addResultOnPanel = (personLocalStorage) => {
    // isprazni listu rezultata na admin panelu
    resultsListWrapper.innerHTML = '';
    // uzmi iz local storage-a listu ljudi, i za svaku osobu kreiraj score
    personLocalStorage.getPersonData().forEach((person) => {

        let personScore = document.createElement('p');
        personScore.setAttribute('class', `person person-${person.id}`);
        personScore.innerHTML = `
            <span class="person-${person.id}">${person.firstName} ${person.lastName} - ${person.score} Points</span>
            <button id="delete-result-btn_${person.id}" class="delete-result-btn">Delete</button>  
        `;

        resultsListWrapper.appendChild(personScore);
    });
}

export const deleteResults = (event, personLocalStorage) => {
    let getId;
    // uzmi listu ljudi iz local storage-a
    let personsArray = personLocalStorage.getPersonData();
    // pronadji id osobe
    if ('delete-result-btn_'.indexOf(event.target.id)) {
        getId = parseInt(event.target.id.split('_')[1]);
        // prodji kroz listu ljudi
        personsArray.forEach((p) => {
            // ako se poklope id osobe i id kliknutog delete button-a
            if (p.id === getId) {
                // izbrisi tu osobu iz liste ljudi
                personsArray.splice(p, 1);
            }
            // setuj izmenjenu listu ljudi u local storage
            personLocalStorage.setPersonData(personsArray);


        });


    }
}

// zelimo da izbrisemo listu rezultata na admin strani
export const clearResultsList = (personLocalStorage) => { // funkcija prima iz local storage-a objekat
    // ako lista ljudi nije null
    if (personLocalStorage.getPersonData() !== null) {
        // ako list ljudi ima bar jednu osobu
        if (personLocalStorage.getPersonData().length > 0) {
            // upozoravamo admina da kada klikne na Clear Results button da ce izbrisati celu listu
            let confirmationToDelete = confirm('Warning! You will loose the entire result list.');
            // ako je confirmationToDelete true
            if (confirmationToDelete) {
                // izbrisi iz local storage-a ljude (odnosno isprazni niz)
                personLocalStorage.removePersonData();
                // dohvati listu u html-u i isprazni je
                resultsListWrapper.innerHTML = '';
            }
        }
    }
}

/*  
====================
  ADMIN PANEL END
====================
*/

/*  
========================
  QUIZ SECTION - START
========================
*/
const QuizPageSection = document.querySelector('.quiz-container');
const displayQuestionText = document.querySelector('#asked-question-text');
export const quizOptionsWrapper = document.querySelector('.quiz-options-wrapper');
const progressBar = document.querySelector('progress');
const progressParagraph = document.querySelector('#progress');
const instantAnswerContainer = document.querySelector('.instant-answer-container');
const instantAnswerText = document.querySelector('#instant-answer-text');
const instantAnswerDiv = document.querySelector('#instant-answer-wrapper');
const emotionIcon = document.querySelector('#emotion');
export const nextQuestionBtn = document.querySelector('#next-question-btn');


export const renderQuestions = (storageQuestionList, progress) => {
    //   ako je duzina niza pitanja veca od 0
    if (storageQuestionList.getQuestionCollection().length > 0) {
        // uzimamo iz local storage-a tekst pitanja i prikazujemo ga u html-u
        displayQuestionText.textContent = storageQuestionList.getQuestionCollection()[progress.questionIndex].questionText;

        // skrivamo default-ne odgovore koje smo zakucali u html-u
        quizOptionsWrapper.innerHTML = '';

        // za svaki odgovor na pitanje iz local storage-a kreiramo novi odgovor
        storageQuestionList.getQuestionCollection()[progress.questionIndex].options.forEach((o, key) => {
            const newOptions = document.createElement('div');
            newOptions.setAttribute('class', `choice-${key + 1}`)
            newOptions.innerHTML = `
                <span class="choice-${key + 1}">${key + 1}.</span>
                <p class="choice-${key + 1}">${o}</p>
            `;
            // kacimo ga za listu odgovora
            quizOptionsWrapper.appendChild(newOptions);
        });
    }
}

export const renderProgress = (storageQuestionList, progress) => {
    // imamo primer 1/3 (prvo pitanje od 3);
    // maksimalna vrednost progressBar-a je jednaka duzini niza pitanja iz local storage-a (ovo je onda broj 3);
    progressBar.max = storageQuestionList.getQuestionCollection().length;
    //  ovo je onda broj 1;
    progressBar.value = progress.questionIndex + 1;

    // imamo primer 1/3 (prvo pitanje od 3);
    // update-ujemo tekst tog elementa da bi nam pisalo 1/3
    progressParagraph.textContent = `${progress.questionIndex + 1}/ ${storageQuestionList.getQuestionCollection().length}`;

}

export const checkAnswer = (event, checkAnswer, isFinished) => {

    const updateOptionsDiv = quizOptionsWrapper.querySelectorAll('div');

    updateOptionsDiv.forEach((o, key) => {
        if (event.target.className === `choice-${key + 1}`) {
            const answer = document.querySelector(`.quiz-options-wrapper div p.${event.target.className}`);

            const answerResult = checkAnswer(answer);

            showAnswer(answerResult, answer);

            if (isFinished()) {
                nextQuestionBtn.textContent = 'Finish';
            }
        }
    });
}

export const showAnswer = (answerResult, clickedOptions) => {
    let index = 0;

    if (answerResult) {
        index = 1;
    }

    const twoOptions = {
        instantAnswerText: ['This is a wrong answer!', 'This is a correct answer!'],
        answerColor: ['red', 'green'],
        emoji: ['../images/sad.png', '../images/happy.png'],
        optionsBackground: ['rgba(200, 0, 0, 0.7)', 'rgba(0, 250, 0, 0.2)']
    };

    quizOptionsWrapper.style.cssText = 'opacity: 0.6; pointer-events: none';

    instantAnswerContainer.style.opacity = '1';

    instantAnswerText.textContent = twoOptions.instantAnswerText[index];

    instantAnswerDiv.className = twoOptions.answerColor[index];

    emotionIcon.setAttribute('src', twoOptions.emoji[index]);

    clickedOptions.previousElementSibling.style.backgroundColor = twoOptions.optionsBackground[index];



}

// f-ja koja resetuje izged pitanja na pocetni dizajn, odnosno kada treba da odgovoris na pitanje, ako ih jos ima
const resetDesign = () => {
    quizOptionsWrapper.style.cssText = '';
    instantAnswerContainer.style.opacity = '0';
}

export const nextQuestion = (questionData, progress, isFinished, personData, currentPersonData) => {
    //  ako je kviz zavrsen
    if (isFinished()) {
        // finish quiz
        personData();
        finalResut(currentPersonData);

        // ako kviz NIJE zavrsen, onda
    } else {
        //  vrati dizajn pitanja na pocetni
        resetDesign();
        // povecaj progres bar za 1;
        progress.questionIndex++;
        //  prikazi sledece pitanje
        renderQuestions(questionData, progress);
        //  prikazi progress bar
        renderProgress(questionData, progress);
    }
}
/*  
======================
  QUIZ SECTION - END
======================
*/


/*  
=======================
  LANDING PAGE - START
=======================
*/
const landingPageSection = document.querySelector('.landing-page-container');

export const startQuizBtn = document.querySelector('#start-quiz-btn');
export const firstName = document.querySelector('#firstname');
export const lastName = document.querySelector('#lastname');


export const getFullName = (currentPersonData, storageQuestionList, admin) => {

    if (firstName.value !== '' && lastName.value !== '') {

        if (!(firstName.value === admin[0] && lastName.value === admin[1])) {
            if (storageQuestionList.getQuestionCollection().length > 0) {
                currentPersonData.fullName.push(firstName.value, lastName.value);

                landingPageSection.style.display = 'none';
                QuizPageSection.style.display = 'block';
            } else {
                alert('Quiz is not ready, please contact the administrator.');
            }
        } else {
            landingPageSection.style.display = 'none';
            adminPanelSection.style.display = 'block';
        }
    } else {
        alert('Please enter your first name and last name.')
    }
}



/*  
=====================
  LANDING PAGE - END
=====================
*/

/*  
=============================
  FINAL RESULT PAGE - START
=============================
*/
const finalResultSection = document.querySelector('.final-result-container');
const finalScoreText = document.querySelector('#final-score-text');


export const finalResut = (currentPerson) => {

    finalScoreText.textContent = `${currentPerson.fullName[0]} ${currentPerson.fullName[1]}, your final score is: ${currentPerson.score}`;

    QuizPageSection.style.display = 'none';
    finalResultSection.style.display = 'block';
}



/*  
===========================
  FINAL RESULT PAGE - END
===========================
*/

