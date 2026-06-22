console.log("Aplikasi PPOB Berjalan");

// Gunakan URL Web App Anda yang sudah di-deploy ulang
const API_URL = "https://script.google.com/macros/s/AKfycbwZhJQyWpKUsZZh4xjNOJ1-QS5zqsBIr06wBsEyab9u0aSZ3q2_JZ_9eODJbJ_rTc76/exec";

let semuaProduk = [];
const container = document.getElementById("produkContainer");

// --- TAHAP 1: MENGAMBIL DATA PRODUK ---
function inisialisasiApp() {
    container.innerHTML = `<p style="text-align:center; padding:20px; color:#636e72;"><i class="fa-solid fa-spinner fa-spin"></i> Sedang memuat produk...</p>`;
    
    // Ambil Produk
    const scriptProduk = document.createElement("script");
    scriptProduk.src = API_URL + "?api=produk&callback=loadProduk";
    scriptProduk.onerror = () => {
        container.innerHTML = `<p style="text-align:center; color:#d63031;">Gagal terhubung ke server database.</p>`;
    };
    document.body.appendChild(scriptProduk);

    // Ambil Saldo
    const scriptSaldo = document.createElement("script");
    scriptSaldo.src = API_URL + "?api=saldo&callback=loadSaldo";
    document.body.appendChild(scriptSaldo);

    // Ambil Promo
    const scriptPromo = document.createElement("script");
    scriptPromo.src = API_URL + "?api=promo&callback=loadPromo";
    document.body.appendChild(scriptPromo);
}

// Callback dari Google Apps Script
function loadProduk(data) {
    if (!data || data.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:20px;">Belum ada produk di database.</p>`;
        return;
    }
    semuaProduk = data;
    tampilkan(semuaProduk);
}

function loadSaldo(data) {
    document.getElementById("saldo").innerHTML = Number(data.saldo).toLocaleString("id-ID");
}

function loadPromo(data) {
    document.getElementById("promoText").innerHTML = data.promo;
}

// --- TAHAP 2: MENAMPILKAN DATA ---
function tampilkan(data) {
    container.innerHTML = "";
    
    if(data.length === 0) {
        container.innerHTML = `<p style="text-align:center; padding:20px; color:#636e72;">Produk tidak ditemukan.</p>`;
        return;
    }

    let htmlTemplate = '';
    data.forEach(item => {
        // Mencegah error kutip pada pemanggilan fungsi
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

// --- TAHAP 3: FITUR FILTER & PENCARIAN ---
function filterProduk(jenis) {
    if(jenis === "Semua") {
        tampilkan(semuaProduk);
        return;
    }
    const hasil = semuaProduk.filter(item => 
        item.jenis && item.jenis.toLowerCase() === jenis.toLowerCase()
    );
    tampilkan(hasil);
}

document.getElementById("cari").addEventListener("keyup", function() {
    const keyword = this.value.toLowerCase();
    const hasil = semuaProduk.filter(item => 
        item.produk.toLowerCase().includes(keyword) || 
        item.provider.toLowerCase().includes(keyword)
    );
    tampilkan(hasil);
});

// --- TAHAP 4: POPUP & PEMESANAN WHATSAPP ---
function bukaPopup(produk, harga) {
    // Tampilkan menggunakan flex agar tata letak Bottom Sheet CSS berfungsi
    document.getElementById("popup").style.display = "flex";
    document.getElementById("popupProduk").innerHTML = produk;
    document.getElementById("produkDipilih").value = produk;
    document.getElementById("hargaDipilih").value = harga;
    
    // Auto fokus ke input tujuan
    setTimeout(() => {
        document.getElementById("tujuan").focus();
    }, 100);
}

function tutupPopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("tujuan").value = ""; // Reset input
}

function kirimWA() {
    const tujuan = document.getElementById("tujuan").value;
    const produk = document.getElementById("produkDipilih").value;
    const harga = document.getElementById("hargaDipilih").value;

    if (tujuan.trim() === "") {
        alert("Mohon isi nomor HP atau ID Pelanggan tujuan terlebih dahulu.");
        return;
    }

    const adminWA = "6282261467360"; // Nomor Anda
    const pesan = `Halo Admin PPOB Desa Panglima Raja 👋\n\nSaya ingin membeli:\n*Produk:* ${produk}\n*Tujuan:* ${tujuan}\n*Harga:* Rp ${Number(harga).toLocaleString("id-ID")}\n\nMohon diproses ya, terima kasih!`;

    window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(pesan)}`);
    tutupPopup();
}

function hubungiAdmin() {
    window.open("https://wa.me/6282261467360?text=Halo Admin PPOB Desa Panglima Raja, saya butuh bantuan...");
}

// Jalankan aplikasi saat halaman pertama kali dimuat
inisialisasiApp();

function bukaCekStatus() {
    document.getElementById("popupCek").style.display = "flex";
}

function tutupCek() {
    document.getElementById("popupCek").style.display = "none";
    document.getElementById("hasilCek").innerText = "";
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
    
    google.script.run
        .withSuccessHandler(function(res) {
            if(res.status === "Ditemukan") {
                hasil.style.background = res.statusProses.toLowerCase() === "sukses" ? "#d4edda" : "#fff3cd";
                hasil.style.color = res.statusProses.toLowerCase() === "sukses" ? "#155724" : "#856404";
                hasil.innerHTML = `<strong>Produk:</strong> ${res.produk}<br><strong>Status:</strong> ${res.statusProses.toUpperCase()}`;
            } else {
                hasil.style.background = "#f8d7da";
                hasil.style.color = "#721c24";
                hasil.innerHTML = "ID Transaksi tidak ditemukan.";
            }
        })
        .cekStatusTransaksi(id);
}
