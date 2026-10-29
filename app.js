let produits = [];
let scanner = null;

fetch("produits.json")
  .then(response => response.json())
  .then(data => {
    produits = data;
  });

function searchProduct() {

  const recherche =
    document
      .getElementById("search")
      .value
      .toLowerCase()
      .trim();

  const results =
    document.getElementById("results");

  results.innerHTML = "";

  if (!recherche) return;

  const produitsTrouves =
    produits.filter(p => {

      return (
        (p.nom || "")
          .toLowerCase()
          .includes(recherche)

        ||

        String(p.upc || "")
          .includes(recherche)

        ||

        (p.marque || "")
          .toLowerCase()
          .includes(recherche)

        ||

        (p.categorie || "")
          .toLowerCase()
          .includes(recherche)
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

async function startScanner() {

  if (scanner) return;

  scanner =
    new Html5Qrcode("reader");

  try {

    await scanner.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },

      (code) => {

        document.getElementById("search").value =
          code;

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

  }

}

async function stopScanner() {

  if (!scanner) return;

  try {

    await scanner.stop();
    await scanner.clear();

  } catch(e) {}

  scanner = null;

}

function toggleTheme(){

  document.body.classList.toggle("dark");

  localStorage.setItem(
    "darkMode",
    document.body.classList.contains(
      "dark"
    )
  );

}

window.addEventListener("load", () => {

  if (
    localStorage.getItem("darkMode")
    === "true"
  ) {
    document.body.classList.add("dark");
  }

});
