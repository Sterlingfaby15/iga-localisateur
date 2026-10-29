let produits = [];
let scanner = null;

fetch("produits.json")
  .then(response => response.json())
  .then(data => {
    produits = data;
  })
  .catch(error => {
    console.error("Erreur chargement JSON :", error);
  });

function searchProduct() {

  const recherche = document
    .getElementById("search")
    .value
    .toLowerCase()
    .trim();

  const results = document.getElementById("results");

  results.innerHTML = "";

  if (!recherche) {
    return;
  }

  const produitsTrouves = produits.filter(p => {

    const nom = (p.nom || "").toLowerCase();
    const upc = String(p.upc || "");
    const marque = (p.marque || "").toLowerCase();
    const categorie = (p.categorie || "").toLowerCase();

    return (
      nom.includes(recherche) ||
      upc.includes(recherche) ||
      marque.includes(recherche) ||
      categorie.includes(recherche)
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
          🏷️ ${p.marque || "N/D"}
        </div>

        <div class="categorie">
          ${p.categorie || "Non catégorisé"}
        </div>

        <div class="loc">
          ${direction}<br>
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

async function startScanner() {

  const reader = document.getElementById("reader");

  if (scanner) {

    try {
      await scanner.stop();
      await scanner.clear();
    } catch (e) {}

    scanner = null;
    reader.innerHTML = "";
    return;

  }

  scanner = new Html5Qrcode("reader");

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

        document.getElementById("search").value =
          decodedText;

        searchProduct();

        if ("vibrate" in navigator) {
          navigator.vibrate(200);
        }

        stopScanner();

      },

      () => {}
    );

  } catch (error) {

    console.error(error);

    alert(
      "Impossible d'accéder à la caméra."
    );

  }

}

async function stopScanner() {

  if (!scanner) {
    return;
  }

  try {

    await scanner.stop();
    await scanner.clear();

  } catch (e) {}

  scanner = null;

  document.getElementById("reader").innerHTML = "";

}

document
  .getElementById("search")
  .addEventListener("keypress", function(e) {

    if (e.key === "Enter") {
      searchProduct();
    }

  });
