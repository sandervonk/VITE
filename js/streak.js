function getCalendarHTML(e,t,a){let r=`<div id="streak-calendar" date="${e.toDateString()}">`,l=new Date(e.getFullYear(),e.getMonth(),1),n=new Date(e.getFullYear(),e.getMonth()+1,0),d=0,o=[[0,"empty",""],[0,"empty",""],[0,"empty",""],[0,"empty",""],[0,"empty",""],[0,"empty",""]];r+=`<div id="streak-calendar-head"> <button class="calendar-button" id="cal-month-prev"></button> <div id="streak-month">${l.toLocaleString("en-us",{month:"long"})+(l.getFullYear()==(new Date).getFullYear()?"":" <span class='cal-year'>"+l.getFullYear())+"</span>"}</div> <button class="calendar-button" id="cal-month-next"></button> </div>`,r+='<div id="streak-days">',d=l.getDay();for(let e=d;e<n.getDate()+d;e++){let r=t[(s=l.setDate(1-d+e),s=new Date(s),[String(s.getMonth()+1).padStart(2,"0"),String(s.getDate()).padStart(2,"0"),s.getFullYear()].join("-"))];dayVal=r||0,o[e]=[dayVal,dayVal>=a?"streak":r>=0?"login":"none",e-d+1]}var s;for(let e=0;e<o.length;e++){let t=Array.from(o[e]);o[e-1]&&o[e][1]==o[e-1][1]&&e%7!=0&&(t[1]+=" connect-left"),o[e+1]&&o[e][1]==o[e+1][1]&&e%7!=6&&(t[1]+=" connect-right"),r+=`<div class="calendar-day day-${t[1]}" xp="${t[0]}">${t[2]}</div>`}return r+="</div></div>",r}$(document).on("click","body:not([header-collapsed]) [streak='calendar']",e=>{$("#streak-overlay").remove(),$(document.body).append('<div id="streak-overlay" class="center">'+getCalendarHTML(new Date,JSON.parse(localStorage.getItem("userData")).xphistory,JSON.parse(localStorage.getItem("userData")).goal)+"</div>"),$("#streak-overlay").addClass("fadein"),$("#streak-calendar").addClass("fadezoomin")}),$(document.body).on("click","#streak-overlay",e=>{"streak-overlay"==e.target.id&&($("#streak-overlay").addClass("fadeout"),$("#streak-calendar").addClass("fadezoomout"))}),$(document.body).on("click",".calendar-button",e=>{let t=0;"cal-month-prev"==e.target.id?t=-1:"cal-month-next"==e.target.id&&(t=1);let a=$("#streak-calendar"),r=new Date(a.attr("date")).setMonth(new Date(a.attr("date")).getMonth()+t);a.attr("date",new Date(r).toDateString()),a.html(getCalendarHTML(new Date(a.attr("date")),JSON.parse(localStorage.getItem("userData")).xphistory,JSON.parse(localStorage.getItem("userData")).goal))});