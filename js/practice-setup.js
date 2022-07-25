try{$(params.get("hide")).hide()}catch(e){}params.has("resolveto")&&$("#close-button").click((function(){e.preventDefault(),window.location.href=params.get("resolveto")}));var tenses={pr:"Présent",pc:"Passé Composé",im:"Imparfait",co:"Conditionnel",ps:"Passé Simple",fs:"Futur Simple",fa:"Futur Antérieur",cp:"Conditionnel Passé",su:"Subjonctif",sp:"Subjonctif Passé"},subjectDefinitions={Je:"I",Tu:"You","Il / Elle / On":"He / She / One",Nous:"We",Vous:"You","Ils / Elles":"They (m) / They (f) "},tenseDefinitions={pr:"Present tense",pc:"Past tense",pp:"Past perfect tense",ps:"Past tense (literature)",im:"Imperfect past (past state or ongoing action)",fs:"Future tense (intentions, predictions, conditional)",fa:"Future tense (actions previous to another)",co:"Conditional tense",cp:"Past conditional tense (regrets, what would / could have happened)",su:"Subjunctive Tense (opinions, emotions, and possibilities)",sp:"Past of the Subjunctive Tense (opinions, emotions, and possibilities)"};function setupApp(){$(".options-toggles > .option-toggle").remove();for(let e of["Je","Tu","Il / Elle / On","Nous","Vous","Ils / Elles"])$("#subject-toggles").append(`<button type="button" title="${subjectDefinitions[e]}" class="option-toggle subject-toggle ${JSON.parse(localStorage.userData).subjects.includes(e)?"active":""} box">${e}</button>`);for(let e of Object.keys(verbs))$("#verb-toggles").append(`<button type="button" title="${verbs[e].definition}" class="option-toggle verb-toggle ${JSON.parse(localStorage.userData).verbs.includes(e)?"active":""} box">${e}</button>`);for(let e of Object.keys(tenses))$("#tense-toggles").append(`<button id="${e}" type="button" title="${tenseDefinitions[e]}" class="option-toggle tense-toggle ${JSON.parse(localStorage.userData).tenses.includes(e)?"active":""} box-button fullborder">${tenses[e]}</button>`)}updatedJSON={};var updateTimedFunction,newJSON=JSON.parse(localStorage.getItem("userData"));function getCMOptions(){let e=[{icon:"cm-reset",text:"Reset Options",onclick:'$("#reset-button").click();closeContextMenu();'}];return!!e.length&&e}$(document.body).on("click",".option-toggle.verb-toggle",e=>{updatedJSON.verbs=[],$(".option-toggle.verb-toggle.active").length>=2||!$(e.target).hasClass("active")?($(e.target).toggleClass("active"),$(".option-toggle.verb-toggle.active").each((e,t)=>{updatedJSON.verbs.push($(t).text())}),updatedJSON.verbs.length>=1&&sendUpdate(updatedJSON)):alert("You must have at least one verb enabled!")}),$(document.body).on("click",".option-toggle.subject-toggle",e=>{updatedJSON.subjects=[],$(".option-toggle.subject-toggle.active").length>=2||!$(e.target).hasClass("active")?($(e.target).toggleClass("active"),$(".option-toggle.subject-toggle.active").each((e,t)=>{updatedJSON.subjects.push($(t).text())}),updatedJSON.subjects.length>=1&&sendUpdate(updatedJSON)):alert("You must have at least one subject enabled!")}),$(document.body).on("click",".option-toggle.tense-toggle",e=>{updatedJSON.tenses=[],$(".option-toggle.tense-toggle.active").length>=2||!$(e.target).hasClass("active")?($(e.target).toggleClass("active"),$(".option-toggle.tense-toggle.active").each((e,t)=>{updatedJSON.tenses.push(t.id)}),updatedJSON.tenses.length>=1&&sendUpdate(updatedJSON)):alert("You must have at least one tense enabled!")}),$("form").on("submit",e=>{e.preventDefault(),$("form").off();try{clearTimeout(updateTimedFunction)}catch(e){console.warn("could not clear previous update")}userDoc().set(newJSON,{merge:!0}).then(()=>{params.has("resolveto")?window.location.href=params.get("resolveto"):$("form").submit()})}),$("#reset-button").on("click",e=>{stealCookies().then(()=>{setupApp()})});