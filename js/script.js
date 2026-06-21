console.log("SCRIPT.JS BERJALAN");

const API =
"https://script.google.com/macros/s/AKfycbyvxQTIdv1QUMFycls2x7pDgGZHZvvVTX7VMuzcnCMrpeIw6IeSs5eoMAYX2kZ3zmrD/exec?api=produk";

let semuaProduk = [];

const script = document.createElement("script");
script.src =
"https://script.google.com/macros/s/AKfycbyvxQTIdv1QUMFycls2x7pDgGZHZvvVTX7VMuzcnCMrpeIw6IeSs5eoMAYX2kZ3zmrD/exec?api=produk&callback=loadProduk";
document.body.appendChild(script);

function loadProduk(data){
    semuaProduk = data;
    tampilkan(data);
}

// ===== Tahap 5 =====
function tampilkan(data){

const container =
document.getElementById("produkContainer");

container.innerHTML = "";

data.forEach(item=>{

container.innerHTML += `
<div class="card">

<h3>${item.produk}</h3>

<p>${item.provider}</p>

<div class="harga">
Rp ${item.hargaJual.toLocaleString()}
</div>

<button
class="beli"
onclick="bukaPopup('${item.produk}',${item.hargaJual})">
Beli
</button>

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

function beliProduk(produk,harga){

const nomorWA =
"6282261467360";

const pesan =
`Halo Admin PPOB Desa Panglima Raja

Saya ingin membeli:

${produk}

Harga: Rp ${harga.toLocaleString()}
`;

window.open(
`https://wa.me/${nomorWA}?text=${encodeURIComponent(pesan)}`
);

}

function bukaPopup(produk,harga){

document.getElementById("popup")
.style.display="block";

document.getElementById("popupProduk")
.innerHTML=produk;

document.getElementById("produkDipilih")
.value=produk;

document.getElementById("hargaDipilih")
.value=harga;

}

function tutupPopup(){

document.getElementById("popup")
.style.display="none";

}

function kirimWA(){

const tujuan =
document.getElementById("tujuan").value;

const produk =
document.getElementById("produkDipilih").value;

const harga =
document.getElementById("hargaDipilih").value;

if(tujuan==""){

alert("Isi nomor tujuan terlebih dahulu");

return;

}

const admin =
"6282261467360";

const pesan =
`Halo Admin PPOB Desa Panglima Raja

Saya ingin membeli:

Produk : ${produk}

Tujuan : ${tujuan}

Harga : Rp ${Number(harga).toLocaleString()}
`;

window.open(
`https://wa.me/${admin}?text=${encodeURIComponent(pesan)}`
);

}

const API_SALDO =
"https://script.google.com/macros/s/AKfycbyvxQTIdv1QUMFycls2x7pDgGZHZvvVTX7VMuzcnCMrpeIw6IeSs5eoMAYX2kZ3zmrD/exec?api=saldo";

const saldoScript = document.createElement("script");

saldoScript.src =
"https://script.google.com/macros/s/AKfycbyvxQTIdv1QUMFycls2x7pDgGZHZvvVTX7VMuzcnCMrpeIw6IeSs5eoMAYX2kZ3zmrD/exec?api=saldo&callback=loadSaldo";

document.body.appendChild(saldoScript);

function loadSaldo(data){

document.getElementById("saldo")
.innerHTML =
Number(data.saldo)
.toLocaleString("id-ID");

}

const promoScript = document.createElement("script");

promoScript.src =
"https://script.google.com/macros/s/AKfycbyvxQTIdv1QUMFycls2x7pDgGZHZvvVTX7VMuzcnCMrpeIw6IeSs5eoMAYX2kZ3zmrD/exec?api=promo&callback=loadPromo";

document.body.appendChild(promoScript);

function loadPromo(data){

document
.getElementById("promoText")
.innerHTML =
data.promo;

}

function hubungiAdmin(){

window.open(
"https://wa.me/6282261467360"
);

}

function filterProduk(jenis){

const hasil =
semuaProduk.filter(
item => item.jenis === jenis
);

tampilkan(hasil);

}
