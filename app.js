let produits = [];

fetch("produits.json")
  .then(response => response.json())
  .then(data => {
    produits = data;
  });

function searchProduct() {

  const recherche = document
    .getElementById("search")
    .value
    .toLowerCase()
    .trim();

  const results = document.getElementById("results");

  results.innerHTML = "";

  if (recherche === "") {
    return;
  }

  const produitsTrouves = produits.filter(p => {

    return (
      p.nom.toLowerCase().includes(recherche) ||
      p.upc.includes(recherche) ||
      (p.marque && p.marque.toLowerCase().includes(recherche)) ||
      (p.categorie && p.categorie.toLowerCase().includes(recherche))
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

        <div>
          <strong>Marque :</strong>
          ${p.marque || "-"}
        </div>

        <div>
          <strong>Catégorie :</strong>
          ${p.categorie || "-"}
        </div>

        <div>
          <strong>UPC :</strong>
          ${p.upc}
        </div>

        <div>
          <strong>Format :</strong>
          ${p.poids || "-"}
        </div>

        <div class="loc">
          📍 ${direction} Allée ${p.allee}
        </div>

        <div class="tablette">
          📚 Tablette ${p.tablette}
        </div>

      </div>

    `;

  });

}

let scanner = null;

async function startScanner() {

  if (scanner) {
    return;
  }

  scanner = new Html5Qrcode("reader");

  await scanner.start(
    { facingMode: "environment" },
    {
      fps: 10,
      qrbox: 250
    },

    (code) => {

      document.getElementById("search").value = code;

      searchProduct();

      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      scanner.stop();

      scanner = null;
    },

    () => {}
  );
}
