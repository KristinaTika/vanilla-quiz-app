/*  
===================
  NAPRAVI PITANJE
===================
*/
class Question {
    constructor(id, questionText, options, correctAnswer) {
        this.id = id;
        this.questionText = questionText;
        this.options = options;
        this.correctAnswer = correctAnswer;
    }
}

/*  
=============================================
  METODE ZA LOCAL STORAGE - PITANJA - START
=============================================
*/
export const questionMethodsForLocalStorage = {
    setQuestionCollection: (newCollection) => {
        localStorage.setItem('questionCollection', JSON.stringify(newCollection));
    },
    getQuestionCollection: () => {
        return JSON.parse(localStorage.getItem('questionCollection'));
    },
    removeQuestionCollection: () => {
        localStorage.removeItem('questionCollection');
    }
}
/*  
=========================================
  METODE ZA LOCAL STORAGE - PITANJA END
=========================================
*/

export const addQuestionToLocalStorage = (newQuestionText, options) => {
    // niz u koji smestamo ponudjene odgovore
    let correctAnswer;
    let questionId;
    let newQuestion;
    let isChecked;
    const optionsArray = [];

    isChecked = false;

    // ako je prazan LocalStorage (kada je prazan LocalStorage vraca null), stavi prazan niz;
    if (questionMethodsForLocalStorage.getQuestionCollection() === null) {
        questionMethodsForLocalStorage.setQuestionCollection([]);
    }

    // prolazimo kroz niz input type text(odgovora)
    options.forEach((o) => {
        // ako vrednost odgovora nije prazan string
        if (o.value !== '') {
            // dodajemo ga u niz ponudjenih odgovora 
            optionsArray.push(o.value);
        }
        // o.previousElementSibling --> selektujemo radio button ispred odgovora
        // proveravamo da li je kliknut i da li vrednost odgovora nije prazan string
        if (o.previousElementSibling.checked && o.value !== '') {
            // tacan odgovor postaje vrednost odgovora
            correctAnswer = o.value;
            isChecked = true;
        }
    });

    // ako localStorage nije prazan
    if (questionMethodsForLocalStorage.getQuestionCollection().length > 0) {
        /* onda id pitanje postaje:
        questionId = 
            1) 
                uzmemo duzinu niza iz localStorage-a (questionMethodsForLocalStorage.getQuestionCollection()[questionMethodsForLocalStorage.getQuestionCollection().length -1])
            2)
                pristupimo propertiju ID (.id)
            3)
                povecamo ga za 1 (+ 1)
        */
        questionId = questionMethodsForLocalStorage.getQuestionCollection()[questionMethodsForLocalStorage.getQuestionCollection().length - 1].id + 1;
    } else {
        questionId = 0;
    }

    if (newQuestionText.value !== "") {
        if (optionsArray.length > 1) {
            if (isChecked) {
                // pitanje --> selektovali smo ga u UI modulu, prosledili kao argument ovoj funkciji i samo smo sacuvali value u varijablu
                const questionText = newQuestionText.value;

                // pravimo novo pitanje i prosledjujemo mu propertije
                newQuestion = new Question(questionId, questionText, optionsArray, correctAnswer);

                /*  
                =====================================
                  CUVANJE PITANJA U LOCAL STORAGE-U
                =====================================
                */

                // uzimamo sacuvani niz iz localStorage-a i cuvamo vrednost u varijabli (getStoredQuestions);
                const getStoredQuestions = questionMethodsForLocalStorage.getQuestionCollection();

                // dodajemo novo pitanje u niz
                getStoredQuestions.push(newQuestion);

                // setujemo localStorage ponovo
                questionMethodsForLocalStorage.setQuestionCollection(getStoredQuestions);
                /*  
                ====================================
                 CUVANJE PITANJA U LOCAL STORAGE-U
                ====================================
                */

                /*  
                =============================================
                  OCISTITI INPUT POLJA POSLE DODATOG PITANJA
                =============================================
                */
                newQuestionText.value = ""; // pitanje
                options.forEach((o) => { // odgovori
                    o.value = "";
                    o.previousElementSibling.checked = false; // radio button ispred odgovora
                });
                /*  
                =============================================
                  OCISTITI INPUT POLJA POSLE DODATOG PITANJA
                =============================================
                */
                return true;

            } else {
                alert('You missed to check the correct answer, or you checked answer without value!');
                return false;
            }
        } else {
            alert('You must insert at least two options!');
            return false;
        }
    } else {
        alert('Please insert Question');
        return false;
    }
}

export const quizProgress = {
    questionIndex: 0
}

export const checkAnswer = (answer) => {
    if (questionMethodsForLocalStorage.getQuestionCollection()[quizProgress.questionIndex].correctAnswer === answer.textContent) {
        currentPersonData.score++;
        return true;
    } else {
        return false;
    }
}

export const isQuizFinished = () => {
    return quizProgress.questionIndex + 1 === questionMethodsForLocalStorage.getQuestionCollection().length;
}

/*  
=================
  NAPRAVI OSOBU
=================
*/
class Person {
    constructor(id, firstName, lastName, score) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.score = score;
    }
}

export const currentPersonData = {
    fullName: [],
    score: 0
};

export const adminFullName = ['Rick', 'Grimes'];

/*  
=========================================
  METODE ZA LOCAL STORAGE - OSOBE START
=========================================
*/

export const personLocalStorage = {
    setPersonData: (newPersonData) => {
        localStorage.setItem('personData', JSON.stringify(newPersonData));
    },
    getPersonData: () => {
        return JSON.parse(localStorage.getItem('personData'));
    },
    removePersonData: () => {
        localStorage.removeItem('personData');
    }
}

/*  
=======================================
  METODE ZA LOCAL STORAGE - OSOBE END
=======================================
*/

if (personLocalStorage.getPersonData() === null) {
    personLocalStorage.setPersonData([]);
}


export const addPersonToLocalStorage = () => {
    let newPerson;
    let personId;
    let personData;

    if (personLocalStorage.getPersonData().length > 0) {
        personId = personLocalStorage.getPersonData()[personLocalStorage.getPersonData().length - 1].id + 1;
    } else {
        personId = 0;
    }

    newPerson = new Person(personId, currentPersonData.fullName[0], currentPersonData.fullName[1], currentPersonData.score);

    personData = personLocalStorage.getPersonData();
    personData.push(newPerson);

    personLocalStorage.setPersonData(personData);
}