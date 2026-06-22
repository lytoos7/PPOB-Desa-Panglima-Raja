console.log("Aplikasi PPOB Berjalan");

// Menghilangkan Splash Screen setelah 2 detik
window.addEventListener('load', function() {
    setTimeout(function() {
        const splash = document.getElementById('splashScreen');
        splash.style.opacity = '0';
        splash.style.visibility = 'hidden';
    }, 2000); // 2000 ms = 2 detik
});

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
    const tujuan = document.getElementById("tujuan").value.trim(); // Hapus spasi kiri/kanan
    const produk = document.getElementById("produkDipilih").value;
    const harga = document.getElementById("hargaDipilih").value;

    // 1. Cek apakah kosong
    if (tujuan === "") {
        alert("Peringatan: Nomor HP atau ID Pelanggan tidak boleh kosong!");
        return;
    }

    // 2. Cek apakah mengandung huruf (hanya boleh angka)
    // Pengecualian jika format ID Game butuh huruf, Anda bisa menghapus blok ini nanti
    const regexAngka = /^[0-9]+$/;
    if (!regexAngka.test(tujuan)) {
        alert("Peringatan: Format salah! Nomor tujuan hanya boleh berisi angka.");
        return;
    }

    // 3. Cek jumlah digit (minimal 8 atau 10 angka untuk nomor Indonesia/ID Game)
    if (tujuan.length < 8) {
        alert("Peringatan: Nomor terlalu pendek! Pastikan nomor tujuan sudah benar.");
        return;
    }

    // Jika semua validasi lolos, buat pesan WA
    const adminWA = "6282261467360";
    const pesan = `Halo Admin PPOB Desa Panglima Raja 👋\n\nSaya ingin membeli:\n*Produk:* ${produk}\n*Tujuan:* ${tujuan}\n*Harga:* Rp ${Number(harga).toLocaleString("id-ID")}\n\nMohon diproses ya, terima kasih!`;

    window.open(`https://wa.me/${adminWA}?text=${encodeURIComponent(pesan)}`);
    tutupPopup(); // Tutup popup setelah dialihkan ke WA
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
    const idTrx = document.getElementById("idCek").value; // Ambil ID yang diinput
    
    if(res.status === "Ditemukan") {
        const isSukses = res.statusProses.toLowerCase() === "sukses";
        
        // Atur warna background (Hijau jika sukses, Kuning jika proses/pending)
        hasil.style.background = isSukses ? "#d4edda" : "#fff3cd";
        hasil.style.color = isSukses ? "#155724" : "#856404";
        
        let htmlInfo = `
            <strong>Produk:</strong> ${res.produk}<br>
            <strong>Tujuan:</strong> ${res.tujuan || "-"}<br>
            <strong>Status:</strong> ${res.statusProses.toUpperCase()}
        `;
        
        // JIKA SUKSES, TAMBAHKAN TOMBOL DOWNLOAD STRUK!
        if (isSukses) {
            // Mencegah error kutip pada produk
            const produkAman = res.produk.replace(/'/g, "\\'");
            const tujuanAman = (res.tujuan || "Tidak ada").replace(/'/g, "\\'");
            
            htmlInfo += `
            <button onclick="downloadStruk('${idTrx}', '${produkAman}', '${tujuanAman}')" 
                style="margin-top: 15px; background: #0b5394; color: white; border: none; padding: 10px; border-radius: 8px; font-weight: bold; cursor: pointer; width: 100%; transition: 0.2s;">
                <i class="fa-solid fa-receipt"></i> Download Struk
            </button>`;
        }
        
        hasil.innerHTML = htmlInfo;
    } else {
        hasil.style.background = "#f8d7da";
        hasil.style.color = "#721c24";
        hasil.innerHTML = "ID Transaksi tidak ditemukan.";
    }
}

// --- FITUR CETAK STRUK DIGITAL ---
function downloadStruk(id, produk, tujuan) {
    // 1. Masukkan data dari database ke dalam Template HTML Struk kita
    const sekarang = new Date();
    // Mengubah format waktu ke lokal Indonesia (contoh: 22/06/2026, 19:10:00)
    document.getElementById("strukWaktu").innerText = sekarang.toLocaleString('id-ID');
    document.getElementById("strukId").innerText = id;
    document.getElementById("strukStatus").innerText = "SUKSES";
    document.getElementById("strukProduk").innerText = produk;
    document.getElementById("strukTujuan").innerText = tujuan;

    const areaStruk = document.getElementById("strukArea");
    
    // 2. Beri efek loading pada tombol agar terlihat canggih
    const btnDown = event.currentTarget;
    const btnLama = btnDown.innerHTML;
    btnDown.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Memproses Struk...';
    btnDown.style.opacity = "0.7";

    // 3. Proses 'memotret' HTML menjadi gambar menggunakan html2canvas
    setTimeout(() => {
        html2canvas(areaStruk, { 
            scale: 2, // Kualitas HD (Dua kali lipat resolusi biasa)
            backgroundColor: "#ffffff"
        }).then(canvas => {
            // Ubah kanvas menjadi URL Gambar PNG
            const imgData = canvas.toDataURL("image/png");
            
            // Buat 'link gaib' untuk mengunduh gambar secara otomatis
            const a = document.createElement("a");
            a.href = imgData;
            a.download = `STRUK_${id}.png`; // Nama file yang tersimpan di HP pelanggan
            document.body.appendChild(a);
            a.click(); // Pencet tombol gaibnya
            document.body.removeChild(a); // Hapus tombol gaibnya

            // Kembalikan tombol ke semula
            btnDown.innerHTML = '<i class="fa-solid fa-circle-check"></i> Struk Tersimpan!';
            btnDown.style.background = "#27ae60";
            
            setTimeout(() => {
                btnDown.innerHTML = btnLama;
                btnDown.style.background = "#0b5394";
                btnDown.style.opacity = "1";
            }, 3000);
        });
    }, 500); // Jeda setengah detik biar data terisi dulu
}

inisialisasiApp();
