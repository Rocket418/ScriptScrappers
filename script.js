
async function call(police){
    return fetch(police)
        .then((response) => response.json())
        .then((scrapped) => {return scrapped})
        .catch((error) => console.log('Error al hacer el fetch', error));
}; 



async function reorganize(){
    const dePol = 'http://localhost:5000/dePol';
    const infoScrapper = await call(dePol)
    const scraps = []
    let counter= 0;
    let answerCounter = 0;
    const Category = {
        basico:[],
        intermedio:[],
        alto:[],
    }
    const fixedAnswers = []
    if(infoScrapper.length===4){
        for (infoscrap of infoScrapper){
            scraps.push(infoscrap)
            if(scraps[3] && !scraps[3]['SIMULACROS 2022 EN PROCESO DE ACTUALIZACIÓN'].length){
                scraps.pop()
            }
        }
        for (scrap of scraps){
            for (topic in scrap){
                for (themes of scrap[topic]){
                    for (theme in themes){
                        for(let i = 0; i < themes[theme].length; i++){
                                const test = themes[theme][i]
                                let indexof = Object.keys(test)
                                if(indexof[0].includes('INTRO') || indexof[0].includes('NIVEL 1')){
                                    Category.basico.push(test) 
                                } else if(indexof[0].includes('NIVEL 2') || indexof[0].includes('NIVEL 3')){
                                    Category.intermedio.push(test)
                                } else if(indexof[0].includes('NIVEL 4')){
                                    Category.alto.push(test)
                                }
                                for(items in test){
                                    for(item of test[items]){
                                        counter= counter + 1

                                        
                                        if(item.question && item.answers && item.rightanswer){
                                                const answerObject = {
                                                        question: '',
                                                        answers: [],
                                                        rightAnswer: '',
                                                        feedback: '',
                                                        id: counter
                                                }
                                                
                                                answerObject.question = item.question.replace(/<\/?[^>]+(>|$)/g, "")
                                                answerObject.feedback = item.feedBack.replace(/<\/?[^>]+(>|$)/g, "").replaceAll('\n', '').replaceAll('&nbsp;', '')
                                                for (answer of item.answers){
                                                    
                                                    answerCounter = answerCounter + 1;
                                                    const cleanAnswer = { 
                                                        id: answerCounter,
                                                        answer: answer.replaceAll('&nbsp;', '').replace(/<\/?[^>]+(>|$)/g, "").replaceAll('\n', '').split('.', )
                                                    }
                                                    answerObject.answers.push(cleanAnswer)
                                                    
                                                }
                                                function correctAnswer(){
                                                    for (string of answerObject.answers){
                                                        if(!!item.rightanswer.toString().includes(string.answer[1].toString()) /* && answerObject.answers.length> */){
                                                            return string.id
                                                        }
                                                    }
                                                        
                                                }
                                                
                                                answerObject.rightAnswer = correctAnswer()
                                                fixedAnswers.push({
                                                    Origin: items,
                                                    Answer: answerObject
                                                    })
                                        
                                        /* break */
                                    }
                                    /* break */
                                }
                                
                                /* break */
                        }
                        /* break */
                    }
                    /* break */
                }
                /* break */
            }
           /*  break */
        }
    }
    
}
console.log(fixedAnswers)
}
reorganize()