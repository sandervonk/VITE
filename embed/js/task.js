$("#signin-overlay-button").click((function(){window.open("/VITE/?redirect="+encodeURIComponent("/FocusTime/app/"),"_parent")})),$("#embed-content").click((function(){console.log("click"),window.open("/VITE/app/","_parent")}));var today=new Date,date=[String(today.getMonth()+1).padStart(2,"0"),String(today.getDate()).padStart(2,"0"),today.getFullYear()].join("-");const config={apiKey:"AIzaSyCZelR1HSbmcPf70rTI5Ig02yasL8RSdPw",authDomain:"vite-practice.firebaseapp.com",projectId:"vite-practice",storageBucket:"vite-practice.appspot.com",messagingSenderId:"559659689480",appId:"1:559659689480:web:417819295e1ad204e193bd",measurementId:"G-61KY0KX892"};firebase.initializeApp(config);const auth=firebase.auth(),db=firebase.firestore();db.settings({timestampsInSnapshots:!0,merge:!0});var userDoc=function(){return db.collection("users").doc(auth.getUid())};function setupContent(){$("#user-image").attr("data",auth.currentUser.photoURL),$("#user-name").text(auth.currentUser.displayName),userDoc().get().then((function(t){let e=t.data();if(e){let t=e.xphistory[date]?e.xphistory[date]:0;$("[data-role='authcontent']").show(),$("#user-xp-bar-fill-text").attr({"data-value":t,"data-goal":e.goal+" xp"}),$("#user-xp-bar-fill").css("width",t/e.goal*100+"%"),$("#total-xp").text(e.xp+" xp")}else window.location.reload()}))}auth.onAuthStateChanged((function(t){console.log("auth state changed"),$("#embed-context-menu").hide(),t?($("[data-role='authwall']").hide(),setupContent(),userDoc().onSnapshot((function(t){console.log("user doc changed"),setupContent()}))):($("[data-role='authwall']").show(),$("[data-role='authcontent']").hide())}));try{let t=25;document.body;loop={start:function(){for(var e=0;e<=t;e++){var a=this.newStar();a.style.top=100*this.rand()+"%",a.style.left=100*this.rand()+"%",a.style.webkitAnimationDelay=this.rand()+"s",a.style.mozAnimationDelay=this.rand()+"s",document.getElementById("bg-stars").appendChild(a)}},rand:function(){return Math.random()},newStar:function(){var t=document.createElement("div");return t.innerHTML='<figure class="star"></figure>',t.firstChild}},loop.start()}catch(t){}$(document.body).on("contextmenu",(function(t){t.preventDefault(),$("#embed-context-menu").toggle(),console.log("contextmenu")})),$("#auth-signout").click((function(){auth.signOut()}));
