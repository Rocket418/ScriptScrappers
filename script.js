
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
    const Category = {
        basico:[],
        intermedio:[],
        alto:[],
    }
    if(infoScrapper.length===4){
        for (infoscrap of infoScrapper){
            scraps.push(infoscrap)
            if(scraps[3]){
                if(!scraps[3]['SIMULACROS 2022 EN PROCESO DE ACTUALIZACIÓN'].length){
                    scraps.pop()
                }
            }
        }
        for (scrap of scraps){
            for (topic in scrap){
                for (themes of scrap[topic]){
                    for (theme in themes){
                        for(let i = 0; i < themes[theme].length; i++){
                                let indexof = Object.keys(themes[theme][i])
                                const test = themes[theme][i]
                                if(indexof[0].includes('INTRO') || indexof[0].includes('NIVEL 1')){
                                    Category.basico.push(test)
                                } else if(indexof[0].includes('NIVEL 2') || indexof[0].includes('NIVEL 3')){
                                    Category.intermedio.push(test)
                                } else if(indexof[0].includes('NIVEL 4')){
                                    Category.alto.push(test)
                                }
                                for ()
                        }
                        
                    }
                    
                }
                
            }
            
        }
    }
    /* console.log(Category) */
}

reorganize()