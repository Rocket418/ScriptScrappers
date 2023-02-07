const fs= require('fs');
const { hasUncaughtExceptionCaptureCallback } = require('process');


async function call(police){
    return fetch(police)
        .then((response) => response.json())
        .then((scrapped) => {return scrapped})
        .catch((error) => console.log('Error al hacer el fetch', error));
}; 



async function reorganize(){
    const dePol = 'http://localhost:5000/dePol';
    const ofiPol= 'http://localhost:5000/ofiPol';
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
                                                        if(!!item.rightanswer.toString().includes(string.answer[1].toString())){
                                                            return string.id
                                                        }
                                                    }
                                                }
                                                answerObject.rightAnswer = correctAnswer()
                                                fixedAnswers.push({
                                                    Origin: items,
                                                    Answer: answerObject
                                                    }
                                                )
                                    }
                                }
                        }
                        if(indexof[0].includes('INTRO') || indexof[0].includes('NIVEL 1')){
                            for (fixedAnswer in fixedAnswers){
                                if(indexof[0] === fixedAnswers[fixedAnswer].Origin){
                                let index = {
                                Origin: indexof,
                                Preguntas: fixedAnswers[fixedAnswer].Answer
                                }
                                Category.basico.push(index)
                            }
                            }
                        } else if(indexof[0].includes('NIVEL 2') || indexof[0].includes('NIVEL 3')){
                            for (fixedAnswer in fixedAnswers){
                                if(indexof[0] === fixedAnswers[fixedAnswer].Origin){
                                let index = {
                                Origin: indexof,
                                Preguntas: fixedAnswers[fixedAnswer].Answer
                                }
                                Category.intermedio.push(index) 
                            }
                            }
                            
                        } else if(indexof[0].includes('NIVEL 4')){
                            for (fixedAnswer in fixedAnswers){
                                if(indexof[0] === fixedAnswers[fixedAnswer].Origin){
                                let index = {
                                Origin: indexof,
                                Preguntas: []
                                }
                                index.Preguntas.push(fixedAnswers[fixedAnswer].Answer)
                                Category.alto.push(index) 
                            }
                            }
                            
                        }
                    }
                }
            }
        }
    }

    const completeResponse = Category
    fs.writeFile('reorganicedScrapper.json', JSON.stringify(completeResponse), (err) => 
    {
        if (err){
            console.log(err);
        } else {
            console.log('file written successfully');
        }
    }
    )   
    }
else if(infoScrapper.length === 3){
    for (infoScrap of infoScrapper){
        scraps.push(infoScrap)
        for (scrapThemes in scraps[0]){
            /*Titulo del tema*/
            scraps[0][scrapThemes].map(function(x){
                for (difficulty in x){
                    if (difficulty.includes('Fácil')){
                        Category.basico.push(x[difficulty])
                    }else if(difficulty.includes('Normal')){
                        Category.intermedio.push(x[difficulty])
                    }else{
                        Category.alto.push(x[difficulty])
                    }
                    console.log(x[difficulty])
                } 
            })
            
        }
    }
}
}

reorganize()

