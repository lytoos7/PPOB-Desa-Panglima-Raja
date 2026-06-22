console.log("Aplikasi PPOB Berjalan");

// Gunakan URL Web App Anda
const API_URL = "https://script.google.com/macros/s/AKfycbxl3pLv9JsbRYVyt4V6KqwbI9IYZZhNtR8ly0-yY-vI8QCLZ8X9maNC0x826qc43xdY/exec";

let semuaProduk = [];
const container = document.getElementById("produkContainer");

// --- TAHAP 1: INISIALISASI ---
function inisialisasiApp() {
    container.innerHTML = `<p style="text-align:center; padding:20px; color:#636e72;"><i class="fa-solid fa-spinner fa-spin"></i> Sedang memuat produk...</p>`;
    
    const scriptProduk = document.createElement("script");
    scriptProduk.src = API_URL + "?api=produk&callback=loadProduk";
    document.body.appendChild(scriptProduk);

    const scriptSaldo = document.createElement("script");
    scriptSaldo.src = API_URL + "?api=saldo&callback=loadSaldo";
    document.body.appendChild(scriptSaldo);

    const scriptPromo = document.createElement("script");
    scriptPromo.src = API_URL + "?api=promo&callback=loadPromo";
    document.body.appendChild(scriptPromo);
}

function loadProduk(data) {
    if (!data || data.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:20px;">Belum ada produk di database.</p>`;
        return;
    }
    semuaProduk = data;
    tampilkan(semuaProduk, "Semua Produk"); // Tampilkan semua saat pertama buka
}

function loadSaldo(data) {
    document.getElementById("saldo").innerHTML = Number(data.saldo).toLocaleString("id-ID");
}

function loadPromo(data) {
    document.getElementById("promoText").innerHTML = data.promo;
}

// --- TAHAP 2: MENAMPILKAN PRODUK DENGAN JUDUL ---
function tampilkan(data, judul = "Semua Produk") {
    container.innerHTML = "";
    
    if(data.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:20px; color:#636e72;">Produk tidak ditemukan.</p>`;
        return;
    }

    // Header untuk memberi tahu user sedang melihat kategori apa
    let htmlTemplate = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:10px; border-bottom:2px dashed #e0e0e0;">
        <h3 style="margin:0; font-size:14px; color:#0b5394;"><i class="fa-solid fa-list"></i> ${judul}</h3>
        ${judul !== "Semua Produk" ? `<button onclick="tampilkan(semuaProduk, 'Semua Produk')" style="background:#f1f2f6; color:#e74c3c; border:none; padding:5px 12px; border-radius:8px; font-size:11px; font-weight:bold; cursor:pointer;"><i class="fa-solid fa-rotate-left"></i> Kembali</button>` : ''}
    </div>
    `;

    data.forEach(item => {
        const namaAman = item.produk.replace(/'/g, "\\'"); 
        htmlTemplate += `
        <div class="card">
            <h3>${item.produk}</h3>
            <p>${item.provider}</p>
            <div class="harga">Rp ${item.hargaJual.toLocaleString("id-ID")}</div>
            <button class="beli" onclick="bukaPopup('${namaAman}', ${item.hargaJual})">Beli</button>
        </div>
        `;
    });
    
    container.innerHTML = htmlTemplate;
}

// --- TAHAP 3: LOGIKA CERDAS FILTER & PROVIDER ---
function filterProduk(jenis) {
    if(jenis === "Semua") {
        tampilkan(semuaProduk, "Semua Produk");
        return;
    }

    // Ambil data berdasarkan kategori (misal: Pulsa)
    const produkKategori = semuaProduk.filter(item => 
        item.jenis && item.jenis.toLowerCase() === jenis.toLowerCase()
    );

    // Cari tahu ada berapa provider di kategori ini
    const providers = [...new Set(produkKategori.map(item => item.provider))];

    if (providers.length <= 1) {
        // Jika provider cuma 1 (seperti Dana, OVO, Gopay, Token PLN), LANGSUNG TAMPILKAN
        tampilkan(produkKategori, jenis);
    } else {
        // Jika provider banyak (seperti Pulsa: Telkomsel, XL, dll), BUKA MENU POPUP
        bukaPopupProvider(jenis, providers);
    }
}

function bukaPopupProvider(jenis, providers) {
    const box = document.getElementById("providerContainer");
    box.innerHTML = "";

    providers.forEach(prov => {
        const provAman = prov.replace(/'/g, "\\'");
        const jenisAman = jenis.replace(/'/g, "\\'");
        
        box.innerHTML += `
            <button class="provider-btn" onclick="pilihProvider('${jenisAman}', '${provAman}')">
                ${prov}
            </button>
        `;
    });

    document.getElementById("popupProvider").style.display = "flex";
}

function tutupProvider() {
    document.getElementById("popupProvider").style.display = "none";
}

function pilihProvider(jenis, provider) {
    tutupProvider(); // Tutup menu popup
    
    // Tampilkan produk yang sesuai jenis DAN provider yang dipilih
    const hasil = semuaProduk.filter(item => 
        item.jenis.toLowerCase() === jenis.toLowerCase() && 
        item.provider.toLowerCase() === provider.toLowerCase()
    );
    
    tampilkan(hasil, `${jenis} - ${provider}`);
}

// Pencarian Otomatis
document.getElementById("cari").addEventListener("keyup", function() {
    const keyword = this.value.toLowerCase();
    const hasil = semuaProduk.filter(item => 
        item.produk.toLowerCase().includes(keyword) || 
        item.provider.toLowerCase().includes(keyword)
    );
    tampilkan(hasil, keyword === "" ? "Semua Produk" : "Hasil Pencarian");
});

// --- TAHAP 4: FITUR BELI DAN CEK STATUS (Tetap sama) ---
function bukaPopup(produk, harga) {
    document.getElementById("popup").style.display = "flex";
    document.getElementById("popupProduk").innerHTML = produk;
    document.getElementById("produkDipilih").value = produk;
    document.getElementById("hargaDipilih").value = harga;
    setTimeout(() => { document.getElementById("tujuan").focus(); }, 100);
}

function tutupPopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("tujuan").value = ""; 
}

function kirimWA() {
    const tujuan = document.getElementById("tujuan").value;
    const produk = document.getElementById("produkDipilih").value;
    const harga = document.getElementById("hargaDipilih").value;

    if (tujuan.trim() === "") {
        alert("Mohon isi nomor HP atau ID Pelanggan tujuan terlebih dahulu.");
        return;
    }

    const adminWA = "6282261467360";
    const pesan = `Halo Admin PPOB Desa Panglima Raja 👋\n\nSaya ingin membeli:\n*Produk:* ${produk}\n*Tujuan:* ${tujuan}\n*Harga:* Rp ${Number(harga).toLocaleString("id-ID")}\n\nMohon diproses ya, terima kasih!`;

    window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(pesan)}`);
    tutupPopup();
}

function hubungiAdmin() {
    window.open("https://wa.me/6282261467360?text=Halo Admin PPOB Desa Panglima Raja, saya butuh bantuan...");
}

function bukaCekStatus() { document.getElementById("popupCek").style.display = "flex"; }

function tutupCek() {
    document.getElementById("popupCek").style.display = "none";
    document.getElementById("hasilCek").innerText = "";
    document.getElementById("idCek").value = "";
}

function prosesCek() {
    const id = document.getElementById("idCek").value;
    const hasil = document.getElementById("hasilCek");
    
    if (id.trim() === "") {
        hasil.innerHTML = '<span style="color:#e74c3c;">Harap masukkan ID Transaksi!</span>';
        return;
    }

    hasil.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Mencari data...';
    hasil.style.background = "#f8f9fa";
    hasil.style.color = "#333";
    
    // Memanggil API Google Sheets dari GitHub
    const scriptCek = document.createElement("script");
    scriptCek.src = API_URL + "?api=cekstatus&id=" + id + "&callback=hasilStatus";
    document.body.appendChild(scriptCek);
}

// Fungsi untuk menerima jawaban dari Google Sheets
function hasilStatus(res) {
    const hasil = document.getElementById("hasilCek");
    if(res.status === "Ditemukan") {
        hasil.style.background = res.statusProses.toLowerCase() === "sukses" ? "#d4edda" : "#fff3cd";
        hasil.style.color = res.statusProses.toLowerCase() === "sukses" ? "#155724" : "#856404";
        hasil.innerHTML = `<strong>Produk:</strong> ${res.produk}<br><strong>Status:</strong> ${res.statusProses.toUpperCase()}`;
    } else {
        hasil.style.background = "#f8d7da";
        hasil.style.color = "#721c24";
        hasil.innerHTML = "ID Transaksi tidak ditemukan.";
    }
}

inisialisasiApp();
