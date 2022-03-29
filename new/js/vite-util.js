function stealCookies() {
  let cookies = [
    ["vite-subjects", "Je,Tu,Il / Elle / On,Nous,Vous,Ils / Elles"],
    [
      "vite-verbs",
      "Venir,Pouvoir,Prendre,Connaître,Savoir,Avoir,Être,Aller,Faire,Manger,Finir,Vouloir,Dormir,Rester,Devoir,Suivre,Voir,Rendre,Pleurer,Sauter,Mettre,Conduire,Dire,Penser,Descendre,Retourner,Mourir,Rentre,Sortir,Arriver,Naître",
    ],
    ["Display-Mode", "QZ"],
    ["VITE-bg", "#ADD8E6"],
    ["vite-old-user", "true"],
    ["VITE-correct", 0],
    ["VITE-incorrect", 0],
    ["vite-skip-blank", false],
    ["vite-pc", true],
    ["vite-ps", true],
    ["vite-pr", true],
    ["vite-im", true],
    ["vite-fs", true],
    ["vite-fa", true],
    ["vite-co", true],
    ["vite-custom-verbs", ""],
  ];
  for (cookie of cookies) {
    localStorage[cookie[0]] = cookie[1];
  }
}
