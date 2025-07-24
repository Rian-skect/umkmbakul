// Sidebar toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const sidebarClose = document.getElementById('sidebarClose');

    // Debug: Check if elements exist
    console.log('Elements found:', {
        sidebarToggle: !!sidebarToggle,
        sidebar: !!sidebar,
        sidebarOverlay: !!sidebarOverlay,
        sidebarClose: !!sidebarClose
    });

    // Toggle sidebar function
    function toggleSidebar() {
        console.log('toggleSidebar called');
        
        if (sidebar && sidebarOverlay) {
            sidebar.classList.toggle('open');
            sidebarOverlay.classList.toggle('show');
            
            // Prevent body scroll when sidebar is open
            if (sidebar.classList.contains('open')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
            
            console.log('Sidebar classes:', sidebar.className);
            console.log('Overlay classes:', sidebarOverlay.className);
        }
    }

    // Close sidebar function
    function closeSidebar() {
        console.log('closeSidebar called');
        
        if (sidebar && sidebarOverlay) {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
            document.body.style.overflow = '';
            
            console.log('Sidebar closed');
        }
    }

    // Event listeners
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Hamburger button clicked');
            toggleSidebar();
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function(e) {
            console.log('Overlay clicked');
            closeSidebar();
        });
    }

    if (sidebarClose) {
        sidebarClose.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Close button clicked');
            closeSidebar();
        });
    }

    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar && sidebar.classList.contains('open')) {
            console.log('Escape key pressed');
            closeSidebar();
        }
    });

    // Close sidebar when clicking any sidebar link (mobile)
    const sidebarLinks = document.querySelectorAll('#sidebar a');
    sidebarLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            console.log('Sidebar link clicked');
            closeSidebar();
        });
    });

    // Handle window resize - close sidebar if window becomes large
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 1024) { // lg breakpoint
            closeSidebar();
        }
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

        function renderTable(data, page = 1) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    // Define brown color schemes for categories
    const categoryColors = {
        'Kuliner / Makanan & Minuman': 'bg-amber-100 text-amber-800',
        'Produksi dan Penjualan Barang (Kerajinan, Mebel, Sandal, Pakaian)': 'bg-yellow-100 text-yellow-800', 
        'Toko Kelontong / Sembako / Eceran': 'bg-orange-100 text-orange-800',
        'Jasa': 'bg-stone-100 text-stone-800',
        'Perdagangan Online': 'bg-amber-50 text-amber-900',
        'Lainnya': 'bg-stone-200 text-stone-900'
    };

    // Function to get category color
    function getCategoryColor(kategori) {
        if (!kategori) return categoryColors['Lainnya'];
        
        // Direct match first
        if (categoryColors[kategori]) {
            return categoryColors[kategori];
        }
        
        // Partial match for shorter keywords
        const lowerKategori = kategori.toLowerCase();
        
        if (lowerKategori.includes('kuliner') || lowerKategori.includes('makanan') || lowerKategori.includes('minuman')) {
            return categoryColors['Kuliner / Makanan & Minuman'];
        }
        if (lowerKategori.includes('produksi') || lowerKategori.includes('kerajinan') || lowerKategori.includes('mebel') || lowerKategori.includes('pakaian')) {
            return categoryColors['Produksi dan Penjualan Barang (Kerajinan, Mebel, Sandal, Pakaian)'];
        }
        if (lowerKategori.includes('toko') || lowerKategori.includes('kelontong') || lowerKategori.includes('sembako') || lowerKategori.includes('eceran')) {
            return categoryColors['Toko Kelontong / Sembako / Eceran'];
        }
        if (lowerKategori.includes('jasa')) {
            return categoryColors['Jasa'];
        }
        if (lowerKategori.includes('online') || lowerKategori.includes('perdagangan')) {
            return categoryColors['Perdagangan Online'];
        }
        
        // Default color for undefined categories
        return categoryColors['Lainnya'];
    }

    const tableBody = document.getElementById('umkm-table-body');
    tableBody.innerHTML = '';

    paginatedData.forEach((umkm, index) => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 border-b border-gray-200';
        
        const categoryColor = getCategoryColor(umkm.kategori);
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">${startIndex + index + 1}</td>
            <td class="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                <div class="text-sm font-bold text-gray-900">${umkm.nama_usaha ?? '-'}</div>
                <div class="text-xs text-gray-500">${umkm.nama ?? '-'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                <span class="px-2 py-1 text-xs font-medium ${categoryColor} rounded-full">${umkm.kategori ?? '-'}</span>
            </td>
            <td class="px-6 py-4 text-sm text-blue-600 underline">
                ${umkm.lokasi_gmaps 
                    ? `<a href="${umkm.lokasi_gmaps}" target="_blank">${umkm.alamat ?? 'Lihat Lokasi'}</a>` 
                    : (umkm.alamat ?? '-')}
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Update pagination info
    document.getElementById('showingStart').textContent = startIndex + 1;
    document.getElementById('showingEnd').textContent = Math.min(endIndex, data.length);
    document.getElementById('totalData').textContent = data.length;
    document.getElementById('pageInfo').textContent = `Halaman ${page} dari ${Math.ceil(data.length / itemsPerPage)}`;

    // Update button states
    document.getElementById('prevBtn').disabled = page === 1;
    document.getElementById('nextBtn').disabled = page === Math.ceil(data.length / itemsPerPage);
    }

        // Event listeners
        document.getElementById('prevBtn').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderTable(umkmData, currentPage);
            }
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            const maxPages = Math.ceil(umkmData.length / itemsPerPage);
            if (currentPage < maxPages) {
                currentPage++;
                renderTable(umkmData, currentPage);
            }
        });

        let umkmData = [];
        let currentPage = 1;
        const itemsPerPage = 20;

    document.addEventListener('DOMContentLoaded', function () {
    fetch('../stat/api/get_umkm.php')
        .then(response => response.json())
        .then(data => {
            console.log("ISI DATA:", data); // ✅ debug

            const filtered = data.filter(item => item.lokasi_gmaps && item.lokasi_gmaps.trim() !== '');
umkmData = filtered;

// Total semua UMKM (dari semua data asli)
document.getElementById('totalUmkm').textContent = data.length;

// Hanya yang punya lokasi Maps
document.getElementById('googleUmkm').textContent = umkmData.length;



// Hitung kategori terbanyak
const kategoriCount = {};
umkmData.forEach(item => {
  const kategori = item.kategori ?? '-';
  kategoriCount[kategori] = (kategoriCount[kategori] || 0) + 1;
});

const kategoriTerbanyak = Object.entries(kategoriCount)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 2);

// Tampilkan kategori terbanyak
document.getElementById('kategori1Nama').textContent = kategoriTerbanyak[0]?.[0] ?? '-';
document.getElementById('kategori1Jumlah').textContent = kategoriTerbanyak[0]?.[1] ?? 0;
document.getElementById('kategori2Nama').textContent = kategoriTerbanyak[1]?.[0] ?? '-';
document.getElementById('kategori2Jumlah').textContent = kategoriTerbanyak[1]?.[1] ?? 0;

            // Tampilkan jumlah data di tabel untuk memastikan masuk
            document.getElementById('umkm-table-body').innerHTML = `
                <tr>
                    <td colspan="4" class="text-center py-4 text-blue-500">
                        Jumlah data: ${umkmData.length}
                    </td>
                </tr>
            `;

            // Render tabel jika data ada
            if (umkmData.length > 0) {
                renderTable(umkmData, currentPage);
            }
        })
        .catch(error => {
            console.error('Gagal fetch data UMKM:', error);
        });

    // Tombol Prev
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderTable(umkmData, currentPage);
        }
    });

    // Tombol Next
    document.getElementById('nextBtn').addEventListener('click', () => {
        const maxPages = Math.ceil(umkmData.length / itemsPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            renderTable(umkmData, currentPage);
        }
    });
});




