class HairQuiz extends HTMLElement {
    constructor() {
        super();

        this.progressBar = this.querySelector('progress-bar');
        this.progressBarBlocks = this.querySelectorAll('progress-bar div');
        this.contentPanels = this.querySelectorAll('content-panel');
        this.quizControls = this.querySelectorAll('div[quiz-direction-controls]');
        this.buttonStartQuiz = this.querySelector('button[start-quiz]');
        this.buttonNext = this.querySelector('button[next]');
        this.buttonPrevious = this.querySelector('button[previous]');
        this.buttonRestart = this.querySelector('button[restart]');
        this.buttonExit = this.querySelector('button[exit]');
        this.buttonAnswers = this.querySelectorAll('button[answer]');
        this.relatedAnswers = this.querySelectorAll('div[related-answers]');
        this.productsContainer = this.querySelector('div[products-container]');
        this.dialog = this.querySelector('dialog');
        this.buttonDialogRestart = this.querySelector('button[dialog-restart]');

        this.buttonStartQuiz.addEventListener('click', this.startQuiz.bind(this));
        this.buttonNext.addEventListener('click', this.panelsDirection.bind(this));
        this.buttonPrevious.addEventListener('click', this.panelsDirection.bind(this));
        this.buttonRestart.addEventListener('click', this.restartQuiz.bind(this));
        this.buttonExit.addEventListener('click', this.restartQuiz.bind(this));
        this.buttonDialogRestart.addEventListener('click', this.restartQuiz.bind(this));
        this.buttonDialogRestart.addEventListener('click', this.closeDialog.bind(this));
        this.addEventListener('click', this.selectedAnswers.bind(this));

        this.setAnswers();
        this.dialog.close();
    }

    showProgressBar() {
        this.progressBar.classList.add('active-element');
    }

    resetProgressBar() {
        this.progressBar.classList.remove('active-element');

        this.progressBarBlocks.forEach(progressBarBlock => {
            progressBarBlock.classList.add('before:opacity-20');
        });
    }

    updateProgressBar(isDirectionNext) {
        this.progressBarBlocks.forEach(progressBarBlock => {
            if (this.buttonNext.getAttribute('quiz-page') == progressBarBlock.getAttribute('quiz-page')) {
                if (isDirectionNext) {
                    progressBarBlock.classList.remove('before:opacity-20');
                }
                else {
                    progressBarBlock.classList.add('before:opacity-20');
                }
            }
        });
    }

    showQuizControls() {
        this.quizControls.forEach(quizControl => {
            quizControl.classList.add('active-element');
        });
    }

    hideQuizControls() {
        this.quizControls.forEach(quizControl => {
            quizControl.classList.remove('active-element');
        });
    }

    closeDialog () {
        this.dialog.close();
    }

    showDialog () {
        this.dialog.showModal();
    }

    startQuiz() {
        this.contentPanels.forEach(contentPanel => {
            if (contentPanel.classList.contains('active-element') && contentPanel.hasAttribute('welcome-page')) {
                contentPanel.classList.remove('active-element');
                contentPanel.nextElementSibling.classList.add('active-element');
                this.buttonPrevious.setAttribute('quiz-page', 0);
                this.buttonRestart.classList.add('active-element');
                this.showQuizControls();
                this.showProgressBar();
                let isDirectionNext = true;
                this.updateProgressBar(isDirectionNext);
            }
        });
    }

    restartQuiz() {
        this.contentPanels.forEach(contentPanel => {
            this.resetPanels(contentPanel);
        });
    }

    panelsDirection(event) {
        let nextPage = 0;
        let previousPage = 0;
        let isDirectionNext = false;

        if (event.target.hasAttribute('quiz-page')) {
            if (event.target.hasAttribute('next')) {
                isDirectionNext = true;
                nextPage = parseInt(event.target.getAttribute('quiz-page'));
                nextPage = nextPage + 1;

                this.contentPanels.forEach(contentPanel => {
                    if (nextPage <= contentPanel.getAttribute('quiz-page')) {
                        event.target.setAttribute('quiz-page', nextPage);
                        previousPage = nextPage - 1;
                        this.buttonPrevious.setAttribute('quiz-page', previousPage);
                
                        this.updatePanels(event);
                        this.updateProgressBar(isDirectionNext);
                    }
                });
            }
            else if (event.target.hasAttribute('previous')) {
                this.updatePanels(event);
                this.updateProgressBar(isDirectionNext);

                previousPage = parseInt(event.target.getAttribute('quiz-page'));
                previousPage = previousPage - 1;
                
                if (previousPage >= 0) {
                    event.target.setAttribute('quiz-page', previousPage);
                    nextPage = previousPage + 1;
                    this.buttonNext.setAttribute('quiz-page', nextPage);
                }
            }
        }
    }

    updatePanels(event) {
        let answersArray = [];
        let isSubmitted = false;
        let answersCount = 0;

        this.contentPanels.forEach(contentPanel => {
            contentPanel.classList.remove('active-element');

            if (event.target.getAttribute('quiz-page') == contentPanel.getAttribute('quiz-page')) {
                contentPanel.classList.add('active-element');
                this.showProgressBar();

                if (contentPanel.hasAttribute('results-page')){
                    this.hideQuizControls();
                    this.buttonRestart.classList.remove('active-element');
                    this.buttonExit.classList.add('active-element');

                    this.buttonAnswers.forEach(buttonAnswer => {
                        if (buttonAnswer.hasAttribute('answer') && buttonAnswer.classList.contains('selected-answer')) {
                            isSubmitted = true;
                            answersArray.push(buttonAnswer.getAttribute('answer'));
                            answersCount++;
                        }
                        else {
                            this.showDialog();
                        }
                    });
                }
            }
            else if (event.target.getAttribute('quiz-page') == 0){
                this.resetPanels(contentPanel);
            }
        });

        if (answersCount >= 3) {
            this.trackUserAnswers(answersArray, isSubmitted);
            this.showResults();
            this.closeDialog();
        }
    }

    resetPanels(contentPanel) {
        contentPanel.classList.remove('active-element');
        this.querySelector('content-panel').classList.add('active-element');
        this.buttonNext.setAttribute('quiz-page', 1);
        this.buttonPrevious.setAttribute('quiz-page', 0);
        this.buttonExit.classList.remove('active-element');
        this.buttonRestart.classList.remove('active-element');
        this.hideQuizControls();
        this.resetProgressBar();
        this.resetUserAnswers();

        this.buttonAnswers.forEach(buttonAnswer => {
            buttonAnswer.classList.remove('selected-answer');
        });
        this.relatedAnswers.forEach(relatedAnswer => {
            relatedAnswer.classList.remove('active-element');
        });
    }

    setAnswers() {
        this.contentPanels.forEach(contentPanel => {
            this.buttonAnswers.forEach(buttonAnswer => {                                  
                if (buttonAnswer.getAttribute('quiz-page') == contentPanel.getAttribute('quiz-page')) {
                    contentPanel.querySelector('div[answers-container]').append(buttonAnswer);
                }
            });
        });
    }

    selectedAnswers(event) {
        if (event.target.hasAttribute('answer') && event.target.hasAttribute('quiz-page')) {
            if (event.target.classList.contains('selected-answer')) {
                event.target.classList.remove('selected-answer');
            }
            else {
                event.target.classList.add('selected-answer');
            }
        }
    }

    trackUserAnswers(answersArray, isSubmitted) {
        let userStorage = answersArray;
        let existingData = JSON.parse(sessionStorage.getItem('hairQuizAnswers') || '[]');

        if (isSubmitted) {
            existingData.push(userStorage);
            sessionStorage.setItem('hairQuizAnswers', JSON.stringify(existingData));
        }
    }

    resetUserAnswers() {
        sessionStorage.removeItem('hairQuizAnswers')
    }

    showResults() {
        let existingData = JSON.parse(sessionStorage.getItem('hairQuizAnswers'));

        this.relatedAnswers.forEach(relatedAnswer => { 
            if (existingData) {
                const filteredArrays = existingData[0].filter(element => JSON.stringify(relatedAnswer.getAttribute('related-answers')).includes(element));

                if (relatedAnswer.getAttribute('related-answers').includes(filteredArrays)) {
                    this.productsContainer.append(relatedAnswer);
                    relatedAnswer.classList.add('active-element');
                }
                else if (relatedAnswer.getAttribute('related-answers') == '') {
                    this.productsContainer.append(relatedAnswer);
                    relatedAnswer.classList.add('active-element');
                }
            }
        });
    }
}

customElements.define('hair-quiz', HairQuiz);