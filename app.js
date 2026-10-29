let produits = [];
let scanner = null;

/* =========================
   Chargement du JSON
========================= */

fetch("produits.json")
  .then(response => response.json())
  .then(data => {
    produits = data;
  })
  .catch(error => {
    console.error(
      "Erreur chargement JSON :",
      error
    );
  });

/* =========================
   Normalisation accents
========================= */

function normalizeText(text){

  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

}

/* =========================
   Recherche produit
========================= */

function searchProduct() {

  const recherche =
    normalizeText(
      document.getElementById("search").value
    );

  const results =
    document.getElementById("results");

  results.innerHTML = "";

  if (!recherche) {
    return;
  }

  const produitsTrouves =
    produits.filter(p => {

      const nom =
        normalizeText(p.nom);

      const marque =
        normalizeText(p.marque);

      const categorie =
        normalizeText(p.categorie);

      const upc =
        String(p.upc || "");

      return (

        nom.includes(recherche)

        ||

        marque.includes(recherche)

        ||

        categorie.includes(recherche)

        ||

        upc.includes(recherche)

      );

    });

  if (produitsTrouves.length === 0) {

    results.innerHTML = `
      <div class="card">
        <h3>Aucun produit trouvé</h3>
      </div>
    `;

    return;

  }

  produitsTrouves.forEach(p => {

    const direction =
      p.cote === "Gauche"
        ? "⬅️"
        : "➡️";

    results.innerHTML += `

      <div class="card">

        <h3>${p.nom}</h3>

        <div class="marque">
          🏷️ ${p.marque || "-"}
        </div>

        <div class="categorie">
          ${p.categorie || "-"}
        </div>

        <div class="loc">
          ${direction}
          <br>
          ALLÉE ${p.allee}
        </div>

        <div class="tablette">
          📚 TABLETTE ${p.tablette}
        </div>

        <div class="upc">
          UPC : ${p.upc}
        </div>

      </div>

    `;

  });

}

/* =========================
   Démarrer scanner
========================= */

async function startScanner() {

  if (scanner) {
    return;
  }

  document.getElementById(
    "stopBtn"
  ).style.display = "block";

  scanner =
    new Html5Qrcode("reader");

  try {

    await scanner.start(

      {
        facingMode: "environment"
      },

      {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250
        }
      },

      (decodedText) => {

        document.getElementById(
          "search"
        ).value = decodedText;

        searchProduct();

        if (navigator.vibrate) {
          navigator.vibrate(200);
        }

        stopScanner();

      },

      () => {}

    );

  } catch(error) {

    console.error(error);

    alert(
      "Impossible d'accéder à la caméra."
    );

    stopScanner();

  }

}

/* =========================
   Arrêter scanner
========================= */

async function stopScanner() {

  if (!scanner) {

    document.getElementById(
      "stopBtn"
    ).style.display = "none";

    return;
  }

  try {

    await scanner.stop();
    await scanner.clear();

  } catch(e) {

    console.log(e);

  }

  scanner = null;

  document.getElementById(
    "reader"
  ).innerHTML = "";

  document.getElementById(
    "stopBtn"
  ).style.display = "none";

}

/* =========================
   Mode sombre
========================= */

function toggleTheme(){

  document.body.classList.toggle(
    "dark"
  );

  localStorage.setItem(
    "darkMode",
    document.body.classList.contains(
      "dark"
    )
  );

}

/* =========================
   Initialisation
========================= */

window.addEventListener(
  "load",
  () => {

    if (
      localStorage.getItem("darkMode")
      === "true"
    ) {

      document.body.classList.add(
        "dark"
      );

    }

  }
);

/* =========================
   Entrée = recherche
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    document
      .getElementById("search")
      .addEventListener(
        "keypress",
        function(e){

          if(e.key === "Enter"){
            searchProduct();
          }

        }
      );

  }
);
