// ── Data: elke zin heeft zijn eigen volgorde ───────────────────────
const zinnen = [
  {
    volgorde: ["wie","doen","wanneer","wat","waar"],
    wie: "Het meisje", doen: "leest",   wat: "een boek",    wanneer: "elke dag",      waar: "in de klas"
  },
  {
    volgorde: ["wie","doen","wanneer","wat","waar"],
    wie: "De hond",    doen: "speelt",  wat: "met een bal", wanneer: "elke ochtend",  waar: "in het park"
  },
  {
    volgorde: ["wie","doen","wanneer","wat","waar"],
    wie: "Mama",       doen: "kookt",   wat: "soep",        wanneer: "'s avonds",     waar: "in de keuken"
  },
  {
    volgorde: ["wie","doen","wanneer","wat","waar"],
    wie: "De jongen",  doen: "tekent",  wat: "een huis",    wanneer: "na school",     waar: "aan tafel"
  },
  {
    volgorde: ["wie","doen","wanneer","wat","waar"],
    wie: "Oma",        doen: "zingt",   wat: "een lied",    wanneer: "'s middags",    waar: "in de tuin"
  },
  {
    volgorde: ["wie","doen","wanneer","wat","waar"],
    wie: "De kat",     doen: "vangt",   wat: "een muis",    wanneer: "'s nachts",     waar: "in de schuur"
  },
  {
    volgorde: ["wie","doen","wanneer","wat","waar"],
    wie: "Papa",       doen: "leest",   wat: "de krant",    wanneer: "'s ochtends",   waar: "op de bank"
  },
  {
    volgorde: ["wie","doen","wanneer","wat","waar"],
    wie: "De kinderen",doen: "gooien",  wat: "een bal",     wanneer: "na het eten",   waar: "in de tuin"
  },
  {
    volgorde: ["wie","doen","wanneer","wat","waar"],
    wie: "De leraar",  doen: "vertelt", wat: "een verhaal", wanneer: "elke vrijdag",  waar: "in de klas"
  },
  {
    volgorde: ["wie","doen","wanneer","wat","waar"],
    wie: "Het meisje", doen: "voedt",   wat: "de vissen",   wanneer: "elke ochtend",  waar: "in de woonkamer"
  },
];

// ── Constanten ─────────────────────────────────────────────────────
const iconen  = { wie:"👤", doen:"⚡", wat:"📦", waar:"📍", wanneer:"⏰" };
const labels  = { wie:"Wie?", doen:"Doet?", wat:"Wat?", waar:"Waar?", wanneer:"Wanneer?" };

let huidigIndex = 0;
let huidigZin   = {};
let gekozen     = {};
let score       = 0;

// ── Laad een zin ──────────────────────────────────────────────────
function laadZin(index) {
  huidigZin = zinnen[index];
  const volgorde = huidigZin.volgorde;
  gekozen = {};
  volgorde.forEach(cat => gekozen[cat] = "");

  // Vakken hertekenen in de juiste volgorde voor deze zin
  const velden = document.getElementById("velden");
  velden.innerHTML = "";
  volgorde.forEach(cat => {
    const vak = document.createElement("div");
    vak.className = "vak " + cat;
    vak.innerHTML =
      "<div class='vak-label'>" + iconen[cat] + " " + labels[cat] + "</div>" +
      "<div id='" + cat + "'></div>";
    velden.appendChild(vak);
  });

  document.getElementById("resultaat").innerHTML = "";
  document.getElementById("btn-volgende").style.display = "none";
  document.getElementById("voortgang").textContent =
    "Zin " + (index + 1) + " van " + zinnen.length;

  // Woorden shuffelen en tonen
  const woordLijst = volgorde.map(cat => ({ woord: huidigZin[cat], categorie: cat }));
  shuffle(woordLijst);

  const container = document.getElementById("woorden");
  container.innerHTML = "";

  woordLijst.forEach(item => {
    const knop = document.createElement("div");
    knop.className = "woord";
    knop.id = "knop-" + item.categorie;
    knop.innerHTML = item.woord + " " + iconen[item.categorie];

    knop.onclick = function () {
      gekozen[item.categorie] = item.woord;
      document.getElementById(item.categorie).innerHTML =
        item.woord +
        " <span class='verwijder' onclick='verwijder(\"" + item.categorie + "\")'>✕</span>";
      document.querySelectorAll(".woord").forEach(k => {
        if (k.id === "knop-" + item.categorie) k.classList.add("gebruikt");
      });
      document.getElementById("resultaat").innerHTML = "";
    };

    container.appendChild(knop);
  });
}

// ── Woord verwijderen ──────────────────────────────────────────────
function verwijder(categorie) {
  gekozen[categorie] = "";
  document.getElementById(categorie).innerHTML = "";
  const knop = document.getElementById("knop-" + categorie);
  if (knop) knop.classList.remove("gebruikt");
}

// ── Controleer ────────────────────────────────────────────────────
function controleer() {
  const volgorde = huidigZin.volgorde;
  const allesIngevuld = volgorde.every(cat => gekozen[cat] !== "");
  if (!allesIngevuld) {
    document.getElementById("resultaat").innerHTML = "⚠️ Vul alle vakken in!";
    return;
  }

  const isGoed = volgorde.every(cat => gekozen[cat] === huidigZin[cat]);

  if (isGoed) {
    score++;
    updateScore();
    // Toon de volledige zin als bevestiging
    const zinTekst = volgorde.map(cat => huidigZin[cat]).join(" ");
    document.getElementById("resultaat").innerHTML =
      "🎉 Goed gedaan! ⭐<br><small>\"" + zinTekst + "\"</small>";
    document.getElementById("btn-volgende").style.display = "inline-block";
  } else {
    const fout = volgorde
      .filter(cat => gekozen[cat] !== huidigZin[cat])
      .map(cat => iconen[cat] + " " + labels[cat])
      .join(", ");
    document.getElementById("resultaat").innerHTML =
      "❌ Kijk nog eens naar: " + fout;
  }
}

// ── Volgende zin ──────────────────────────────────────────────────
function volgende() {
  huidigIndex++;
  if (huidigIndex >= zinnen.length) { eindeSpel(); return; }
  laadZin(huidigIndex);
}

// ── Einde spel ────────────────────────────────────────────────────
function eindeSpel() {
  document.querySelector(".spel").innerHTML =
    "<h1>🏆 Klaar!</h1>" +
    "<p style='font-size:28px'>Je hebt " + score + " van de " + zinnen.length + " zinnen goed!</p>" +
    "<button onclick='location.reload()'>🔄 Opnieuw spelen</button>";
}

// ── Score bijwerken ───────────────────────────────────────────────
function updateScore() {
  document.getElementById("score").textContent = "⭐ Score: " + score;
}

// ── Shuffle ───────────────────────────────────────────────────────
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── Begin ─────────────────────────────────────────────────────────
laadZin(0);
