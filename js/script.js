const API =
"https://script.google.com/macros/s/AKfycbyvxQTIdv1QUMFycls2x7pDgGZHZvvVTX7VMuzcnCMrpeIw6IeSs5eoMAYX2kZ3zmrD/exec?api=produk";

let semuaProduk = [];

fetch(API)
.then(res => res.json())
.then(data => {

    semuaProduk = data;

    tampilkan(data);

});

// ===== Tahap 5 =====
function tampilkan(data){

    const container =
    document.getElementById("produkContainer");

    container.innerHTML = "";

    data.forEach(item=>{

        container.innerHTML += `
            <div class="card">
                <h3>${item.produk}</h3>
                <p>Provider: ${item.provider}</p>
                <p>Harga: Rp ${item.hargaJual.toLocaleString()}</p>
            </div>
        `;

    });

}

// ===== Tahap 6 =====
document
.getElementById("cari")
.addEventListener("keyup", function(){

    const keyword =
    this.value.toLowerCase();

    const hasil =
    semuaProduk.filter(item =>
        item.produk.toLowerCase()
        .includes(keyword)
    );

    tampilkan(hasil);

});
