const fs = require('fs');


async function call(police) {
    return fetch(police)
        .then((response) => response.json())
        .then((scrapped) => { return scrapped })
        .catch((error) => console.log('Error al hacer el fetch', error));
};



async function reorganize() {
    const dePol = 'http://localhost:5000/dePol';
    const ofiPol = 'http://localhost:5000/ofiPol';
    const used = ofiPol;
    const infoScrapper = await call(used)
    const scraps = []
    let counter = 0;
    let answerCounter = 0;
    const Category = {
        unsorted: [],
        basico: [],
        intermedio: [],
        alto: [],
    }
    let fixedAnswers = []
    for (infoScrap of infoScrapper) {
        scraps.push(infoScrap)
        if (scraps[3] && !scraps[3]['SIMULACROS 2022 EN PROCESO DE ACTUALIZACIÓN'].length) {
            scraps.pop()
        }
        for (scrapThemes in infoScrap) {
            infoScrap[scrapThemes].map(function (x) {
                for (difficulty in x) {
                    for (topic of x[difficulty]) {
                        if (used === dePol) {
                            for (test in topic) {
                                for (questionObject of topic[test]) {
                                    counter = counter + 1
                                    const answerObject = {
                                        question: '',
                                        answers: [],
                                        rightAnswer: '',
                                        feedback: '',
                                        id: counter
                                    }
                                    answerObject.answers = []
                                    let realQuestion = questionObject.question.replace(/<\/?[^>]+(>|$)/g, "")
                                    answerObject.question = realQuestion
                                    answerObject.feedback = questionObject.feedBack.replace(/<\/?[^>]+(>|$)/g, "").replaceAll('\n', '').replaceAll('&nbsp;', '')
                                    for (answer of questionObject.answers) {
                                        answerCounter = answerCounter + 1;
                                        const cleanAnswer = {
                                            id: answerCounter,
                                            goodAnswer: answer.replaceAll('&nbsp;', '').replace(/<\/?[^>]+(>|$)/g, "").replaceAll('\n', '').split('.')
                                        }
                                        
                                        answerObject.answers.push(cleanAnswer)
                                    }
                                    function correctAnswer() {
                                        for (string of answerObject.answers) {
                                            if (!!questionObject.rightanswer.toString().includes(string.goodAnswer[1])) {
                                                return string.id
                                            }
                                        }
                                    }
                                    answerObject.rightAnswer = correctAnswer()
                                    fixedAnswers = []
                                    fixedAnswers.push({
                                        Origin: test,
                                        Answer: answerObject
                                    }
                                    )
                                    
                                }
                                if (test.includes('INTRO') || test.includes('NIVEL 1')) {
                                    for (fixedAnswer of fixedAnswers){
                                        if (test === fixedAnswer.Origin){
                                            let index = {
                                                Origin: difficulty,
                                                Preguntas: fixedAnswer.Answer
                                            }
                                            Category.basico.push(index)    
                                        }
                                    }
                                } else if (test.includes('NIVEL 2') || test.includes('NIVEL 3')) {
                                    for (fixedAnswer of fixedAnswers) {
                                        if (test === fixedAnswer.Origin) {
                                            let index = {
                                                Origin: test,
                                                Preguntas: fixedAnswer.Answer
                                            }
                                            Category.intermedio.push(index)
                                        }
                                    }
                                } else if (test.includes('NIVEL 4')) {
                                    for (fixedAnswer of fixedAnswers) {
                                        if (test === fixedAnswer.Origin) {
                                            let index = {
                                                Origin: test,
                                                Preguntas: fixedAnswer.Answer
                                            }
                                            Category.alto.push(index)
                                        }
                                    }
                                }   
                            }
                        } else if(used === ofiPol) {
                            counter = counter + 1
                            const answerObject = {
                                question: '',
                                answers: [],
                                rightAnswer: '',
                                feedback: '',
                                id: counter
                            }
                            let realQuestion = topic.question.replace(/<\/?[^>]+(>|$)/g, "").split('-',)
                            answerObject.question = realQuestion[1]
                            answerObject.feedback = topic.feedBack.replace(/<\/?[^>]+(>|$)/g, "").replaceAll('\n', '').replaceAll('&nbsp;', '')
                            for (answer of topic.answers) {
                                answerCounter = answerCounter + 1;
                                const cleanAnswer = {
                                    id: answerCounter,
                                    goodAnswer: answer.replaceAll('&nbsp;', '').replace(/<\/?[^>]+(>|$)/g, "").replaceAll('\n', '').split(') ',)
                                }
                                answerObject.answers.push(cleanAnswer)
                            }
                            function correctAnswer2() {
                                for (string of answerObject.answers) {
                                    if (!!topic.rightanswer.toString().includes(string.goodAnswer[0])) {
                                        return string.id
                                    }
                                }
                            }
                            answerObject.rightAnswer = correctAnswer2()
                            fixedAnswers = []
                            fixedAnswers.push({
                                Origin: difficulty,
                                Answer: answerObject
                            })
                        }
                        if (difficulty.includes('Facil') || difficulty.includes('Fácil')) {
                            for (fixedAnswer of fixedAnswers) {
                                if (difficulty === fixedAnswer.Origin) {
                                    let index = {
                                        Origin: scrapThemes,
                                        Preguntas: fixedAnswer.Answer
                                    }
                                    Category.basico.push(index)
                                }
                            }
                        } else if (difficulty.includes('Normal')) {
                            for (fixedAnswer of fixedAnswers) {
                                if (difficulty === fixedAnswer.Origin) {
                                    let index = {
                                        Origin: scrapThemes,
                                        Preguntas: fixedAnswer.Answer
                                    }
                                    Category.intermedio.push(index)
                                }
                            }
                        } else if (difficulty.includes('Dificil') || difficulty.includes('Difícil')) {
                            for (fixedAnswer of fixedAnswers) {
                                if (difficulty === fixedAnswer.Origin) {
                                    let index = {
                                        Origin: scrapThemes,
                                        Preguntas: fixedAnswer.Answer
                                    }
                                    Category.alto.push(index)
                                }
                            }
                        } else {
                            for (fixedAnswer of fixedAnswers) {
                                if (difficulty === fixedAnswer.Origin) {
                                    let index = {
                                        Origin: difficulty,
                                        Preguntas: fixedAnswer.Answer
                                    }
                                    Category.unsorted.push(index)
                                }
                            }
                        }
                    }
                }
            })
        }
        
    }
    
    const completeResponse = Category
    if (used === ofiPol) {
        fs.writeFile('reorganicedScrapperofiPol.json', JSON.stringify(completeResponse), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('ofiPol file written successfully');
            }
        })
    } else if (used === dePol) {
        fs.writeFile('reorganicedScrapperdePol.json', JSON.stringify(completeResponse), (err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('dePol file written successfully');
            }
        })
    }
}



reorganize()

