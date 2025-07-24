// Sidebar toggle functionality
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function toggleSidebar() {
      sidebar.classList.toggle('open');
      sidebarOverlay.classList.toggle('show');
      document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }

    function closeSidebar() {
      sidebar.classList.remove('open');
      sidebarOverlay.classList.remove('show');
      document.body.style.overflow = '';
    }

    sidebarToggle?.addEventListener('click', toggleSidebar);
    sidebarOverlay?.addEventListener('click', closeSidebar);

    // Close sidebar on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });

    // Close sidebar when clicking close button
    const sidebarClose = document.getElementById('sidebarClose');
    if (sidebarClose) {
      sidebarClose.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking any sidebar link (mobile)
    const sidebarLinks = document.querySelectorAll('#sidebar a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeSidebar();
      });
    });

      // Close sidebar on escape key
      document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
              closeSidebar();
          }
      });

      // Handle window resize
      window.addEventListener('resize', () => {
          if (window.innerWidth >= 1024) {
              closeSidebar();
          }
      });

        // Chart options with integrated legends
        const barOptions = {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y', // This makes it horizontal
            plugins: {
                legend: {
                    display: false // Hide legend for horizontal bar chart
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'UMKM ' + context.parsed.x.toLocaleString('id-ID');
                        }
                    }
                },

            // Add value labels plugin specifically for bar chart
              valueLabels: {
              display: true
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(75, 57, 36, 0.1)'
                    },
                    ticks: {
                        color: '#4b3924',
                        font: {
                            size: 12
                        },
                        callback: function(value) {
                            return '' + value.toLocaleString('id-ID');
                        }
                    }
                },
                y: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#4b3924',
                        font: {
                            size: 11
                        },

                    }
                }
            },
            layout: {
                padding: {
                    left: 30,
                    right: 30
                }
            },
            onHover: (event, activeElements) => {
                event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
            }
        };

        // Add value labels plugin specifically for bar charts only
        Chart.register({
            id: 'valueLabels',
            afterDatasetsDraw: function(chart) {
                // Check if this is a bar chart and if value labels are enabled
                if (chart.config.type === 'bar' && 
                    chart.config.options.plugins.valueLabels && 
                    chart.config.options.plugins.valueLabels.display) {
                    
                    const ctx = chart.ctx;
                    chart.data.datasets.forEach((dataset, i) => {
                        const meta = chart.getDatasetMeta(i);
                        meta.data.forEach((bar, index) => {
                            const data = dataset.data[index];
                            ctx.fillStyle = '#4b3924';
                            ctx.font = window.innerWidth < 480 ? '10px Arial' : '12px Arial';
                            ctx.textAlign = 'left';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(
                                ' ' + data.toLocaleString('id-ID'),
                                bar.x + 5,
                                bar.y
                            );
                        });
                    });
                }
            }
        });

        const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false // We'll use custom legend
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.label || '';
                        const value = context.parsed;
                        return label + ': ' + value + '%';
                    }
                }
            }
        },
        onHover: (event, activeElements) => {
            event.native.target.style.cursor = activeElements.length > 0 ? 'pointer' : 'default';
        }
    };

    const doughnutOptions = {
        responsive: false,
        maintainAspectRatio: false,
        cutout: '50%',
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    padding: 20,
                    font: {
                        size: 14,
                        weight: 600
                    },
                    color: '#4b3924'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.label + ': ' + context.parsed + 'UMKM';
                    }
                }
            }
        }
    };

        // Plugin untuk label di pie chart
const pieLabelsPlugin = {
    id: 'labelOnPie',
    afterDatasetDraw(chart) {
        const { ctx } = chart;
        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);
        const total = dataset.data.reduce((a, b) => a + b, 0);
        
        ctx.save();
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        
        meta.data.forEach((arc, i) => {
            const angle = (arc.startAngle + arc.endAngle) / 2;
            const r = (arc.outerRadius + arc.innerRadius) / 2;
            const x = chart.width / 2 + r * Math.cos(angle);
            const y = chart.height / 2 + r * Math.sin(angle);
            const value = dataset.data[i];
            const percent = Math.round((value / total) * 100);
            
            // Only show label if percentage is >= 3%
            if (percent >= 3) {
                ctx.fillText(`${value}`, x, y - 7);
                ctx.fillText(`(${percent}%)`, x, y + 7);
            }
        });
        ctx.restore();
    }
};

// Plugin untuk label di donut chart (diperbaiki agar lebih tengah)
const doughnutLabelsPlugin = {
    id: 'labelInsideSlice',
    afterDatasetDraw(chart) {
        const { ctx } = chart;
        const dataset = chart.data.datasets[0];
        const meta = chart.getDatasetMeta(0);
        const total = dataset.data.reduce((a, b) => a + b, 0);

        ctx.save();
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 2;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        meta.data.forEach((arc, i) => {
            const angle = (arc.startAngle + arc.endAngle) / 2;
            // Posisi lebih presisi di tengah slice
            const radius = arc.innerRadius + (arc.outerRadius - arc.innerRadius) * 0.5;
            const x = chart.chartArea.left + (chart.chartArea.width / 2) + radius * Math.cos(angle);
            const y = chart.chartArea.top + (chart.chartArea.height / 2) + radius * Math.sin(angle);

            const value = dataset.data[i];
            const percent = Math.round((value / total) * 100);

            // Hanya tampilkan label jika persentase >= 3%
            if (percent >= 3) {
                ctx.fillText(`${value}`, x, y - 7);
                ctx.fillText(`(${percent}%)`, x, y + 7);
            }
        });

        ctx.restore();
    }
};

 document.addEventListener('DOMContentLoaded', function() {
});

    // Handle window resize
    window.addEventListener('resize', function() {
      // Charts will automatically resize due to responsive: true option
    });

    // Animate numbers on page load
    function animateNumbers() {
      const statsElements = [
        { element: document.getElementById('aktif-umkm'), target: 22 },
        { element: document.getElementById('total-umkm'), target: 25 },
        { element: document.getElementById('total-rw'), target:  19},
        { element: document.getElementById('total-pemilik'), target: 25 }
      ];

      statsElements.forEach(({ element, target }) => {
        if (element) {
          let current = 0;
          const increment = target / 50;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              element.textContent = target;
              clearInterval(timer);
            } else {
              element.textContent = Math.floor(current);
            }
          }, 30);
        }
      });
    }
    let UMKM_DATA = [];
    let filteredData = [];
    let currentPage = 1;
    const itemsPerPage = 10;

   fetch('api/get_umkm.php')
  .then(response => response.json())
  .then(data => {
    console.log("Data dari server:", data); // Cek apakah berhasil
    UMKM_DATA = data;
    filteredData = [...UMKM_DATA];
    renderTable(filteredData, currentPage);
    const sudahPelatihan = UMKM_DATA.filter(
  d => d.status_plt?.toString().trim().toLowerCase() === "pernah"
).length;



const belumPelatihan = UMKM_DATA.length - sudahPelatihan;

const doughnutData = {
  labels: ['Sudah Pelatihan', 'Belum Pelatihan'],
  datasets: [{
    data: [belumPelatihan, sudahPelatihan],
    backgroundColor: ['#D7C0A6', '#A67C52'],
    borderColor: ['#D7C0A6', '#A67C52'],
    borderWidth: 2
  }]
};


    

const totalHalal = UMKM_DATA.filter(
  d => d.sertif_halal?.toLowerCase().trim() === "sudah memiliki"
).length;

const belumHalal = UMKM_DATA.filter(
  d => d.sertif_halal?.toLowerCase().trim() === "belum memiliki"
).length;


document.getElementById("halal-certified").textContent = totalHalal;
document.getElementById("no-halal-cert").textContent = belumHalal;

// Hitung jumlah UMKM berdasarkan kategori dinamis
const categoryCounts = {};
UMKM_DATA.forEach(item => {
  const kategori = item.kategori?.trim();
  if (kategori) {
    categoryCounts[kategori] = (categoryCounts[kategori] || 0) + 1;
  }
});

// Urutkan kategori dari jumlah terbanyak ke terkecil
const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
const labels = sortedCategories.map(([k]) => k);
const dataChart = sortedCategories.map(([_, v]) => v);



    
              // Update deskripsi UMKM Unggulan dari data status NIB
    const total = UMKM_DATA.length;
    const memiliki = UMKM_DATA.filter(d => d.status_nib?.toLowerCase().trim() === "sudah memiliki").length;
    const belum = total - memiliki;
    const persenMemiliki = ((memiliki / total) * 100).toFixed(1);
    const persenBelum = (100 - persenMemiliki).toFixed(1);
    const summaryText = `
      Berdasarkan data yang terhimpun, <strong>UMKM unggulan</strong> di Kelurahan Kahuripan dikategorikan berdasarkan kelengkapan surat keterangan usaha, 
      yaitu <strong>${persenMemiliki}%</strong> sudah memiliki Surat Keterangan Usaha dan <strong>${persenBelum}%</strong> belum memiliki. 
      Informasi ini dapat digunakan sebagai dasar pengembangan program legalitas UMKM.
      
    `;
    
    // Warna
    const backgroundColor = [
      '#4E342E', // dark cocoa
      '#6D4C41', // earthy brown
      '#8D6E63', // grey-brown
      '#A1887F', // warm brown
      '#5D4037', // deep coffee
      '#795548', // soft dark brown
      '#3E2723', // darkest brown
      '#A0522D', // sienna
      '#7B3F00', // chocolate root
      '#C49E8A', // clay
      '#A9746E', // dusty red-brown
      '#B86B40', // toffee
      '#D2691E', // bold chocolate
      '#996633', // wood
      '#8B5A2B'  // bronze
    ];

const borderColor = backgroundColor.map(() => '#ffffff'); // garis pemisah antar slice


if (window.kategoriPieChart) {
  window.kategoriPieChart.destroy();
}

    document.getElementById("nib-summary").innerHTML = summaryText;
    // === PIE CHART NIB START ===

const pieLabels = ['Sudah Memiliki SKU', 'Belum Memiliki SKU'];
const pieData = [memiliki, belum];
const pieBackgroundColor = ['#A67C52', '#D7C0A6'];

if (window.kategoriPieChart) {
  window.kategoriPieChart.destroy();
}

// Membuat doughnut chart dengan plugin yang diperbaiki
const doughnutCtx = document.getElementById('doughnutChart')?.getContext('2d');
if (doughnutCtx) {
  if (window.pelatihanDonutChart) {
    window.pelatihanDonutChart.destroy();
  }

  window.pelatihanDonutChart = new Chart(doughnutCtx, {
    type: 'doughnut',
    data: doughnutData,
    options: doughnutOptions,
    plugins: [doughnutLabelsPlugin]
    
  });
}
const persenSudah = ((sudahPelatihan / UMKM_DATA.length) * 100).toFixed(1);


document.querySelector('.doughnut-chart-info .chart-description p').innerHTML = `
  Sebaran data pada diagram menunjukkan jumlah UMKM yang sudah mengikuti dan belum mengikuti pelatihan. 
  Dari total ${UMKM_DATA.length} UMKM, sebanyak ${sudahPelatihan} UMKM (${persenSudah}%) telah mengikuti pelatihan, 
  sedangkan ${belumPelatihan} UMKM (${persenBelum}%) belum mengikuti pelatihan. 
  Data ini menggambarkan bahwa sebagian besar pelaku UMKM masih belum mendapatkan akses atau kesempatan pelatihan. 
  Hal ini menjadi perhatian penting untuk meningkatkan kapasitas, daya saing, dan kualitas usaha 
  melalui program pelatihan yang lebih merata dan terjangkau.
`;



// Membuat pie chart dengan labels angka
const ctxPie = document.getElementById('pieChart')?.getContext('2d');
if (ctxPie) {
    window.kategoriPieChart = new Chart(ctxPie, {
        type: 'pie',
        data: {
            labels: pieLabels,
            datasets: [{
                data: pieData,
                backgroundColor: pieBackgroundColor,
                borderColor: ['#ffffff', '#ffffff'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const totalPie = pieData.reduce((a, b) => a + b, 0);
                            const value = context.parsed;
                            const percentage = ((value / totalPie) * 100).toFixed(1);
                            return `${context.label}: ${value} UMKM (${percentage}%)`;
                        }
                    }
                }
            }
        },
        plugins: [pieLabelsPlugin] // Menambahkan plugin labels
    });
}

// Siapkan data bar chart
const barData = {
    labels: labels,
    datasets: [{
        label: 'Jumlah UMKM',
        data: dataChart,
        backgroundColor: backgroundColor.slice(0, labels.length),
        borderColor: borderColor.slice(0, labels.length),
        borderWidth: 1
    }]
};

const ctxBar = document.getElementById('barChart')?.getContext('2d');
if (ctxBar) {
    if (window.kategoriBarChart) {
        window.kategoriBarChart.destroy();
    }

    window.kategoriBarChart = new Chart(ctxBar, {
        type: 'bar',
        data: barData,
        options: barOptions
    });

// === Dashboard Stats ===

document.getElementById('total-umkm').textContent = UMKM_DATA.length;

const totalSKU = UMKM_DATA.filter(
  d => d.status_nib?.toLowerCase().trim() === "sudah memiliki"
).length;

const belumSKU = UMKM_DATA.filter(
  d => d.status_nib?.toLowerCase().trim() !== "sudah memiliki"
).length;

document.getElementById('umkm-nib').textContent = totalSKU;
document.getElementById('no-nib-count').textContent = belumSKU;

const uniqueRW = new Set(UMKM_DATA.map(d => d.rw)).size;

}

  })


    // Get category styling class
    function getCategoryClass(category) {
      const classes = {
        'Kuliner / Makanan & Minuman': 'kuliner',
        'Jasa': 'jasa',
        'Perdagangan Online': 'online',
        'Toko Kelontong / Sembako / Eceran': 'toko',
        'Produksi dan Penjualan Barang': 'produksi',
        'Pertanian & Peternakan': 'pertanian',
        'Pendidikan & Layanan Khusus': 'pendidikan',
        'Kos-kosan / Kontrakan / Penyewaan Properti': 'properti',
        'Jual Pulsa / Produk Digital': 'pulsa',
        'Otomotif / Bengkel': 'otomotif'
      };
      return classes[category] || 'bg-gray-100 text-gray-800';
    }

    // Render table
    function renderTable(data, page = 1) {
      const tbody = document.getElementById('umkm-table-body');
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const pageData = data.slice(startIndex, endIndex);

      tbody.innerHTML = pageData.map((item, index) => `
  <tr class="table-row border-b border-gray-100">
    <td class="px-6 py-4 font-medium text-[#6b5842]">${startIndex + index + 1}</td>
    <td class="px-6 py-4 font-medium text-[#6b5842]">${item.nama_usaha}</td>
    <td class="px-6 py-4">
      <span class="px-3 py-1 text-xs font-semibold rounded-full ${getCategoryClass(item.kategori)}">
        ${item.kategori}
      </span>
    </td>
    <td class="px-6 py-4 text-sm text-gray-600">${item.rt}</td>
    <td class="px-6 py-4 text-sm text-gray-600">${item.rw}</td>
    <td class="px-6 py-4 text-sm text-gray-600">${item.alamat}</td>
    <td class="px-6 py-4">
      <span class="px-3 py-1 text-xs font-semibold rounded-full ${
        item.status_nib && item.status_nib.toLowerCase() === 'sudah memiliki'
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'
      }">
        ${item.status_nib}
      </span>
    </td>
    <!-- Tambahkan bagian ini untuk sertif_halal -->
    <td class="px-6 py-4">
      <span class="px-3 py-1 text-xs font-semibold rounded-full ${
        item.sertif_halal && item.sertif_halal.toLowerCase().includes('sudah memiliki')
          ? 'bg-green-100 text-green-800'
          : 'bg-red-100 text-red-800'
      }">
        ${item.sertif_halal || '-'}
      </span>
    </td>



`).join('');


      renderPagination(data, page);
    }

    // Function untuk update info data
    function updateDataInfo(data, currentPage) {
      const totalData = data.length;
      const startIndex = (currentPage - 1) * itemsPerPage + 1;
      const endIndex = Math.min(currentPage * itemsPerPage, totalData);
      
      const dataInfo = document.getElementById('data-info');
      if (totalData === 0) {
        dataInfo.textContent = 'Tidak ada data yang ditampilkan';
      } else {
        dataInfo.textContent = `Menampilkan ${startIndex} sampai ${endIndex} dari ${totalData} data`;
      }
    }

    // Render pagination
    function renderPagination(data, currentPage) {
      const totalPages = Math.ceil(data.length / itemsPerPage);
      const paginationNumbers = document.getElementById('pagination-numbers');
      const prevBtn = document.getElementById('prev-page');
      const nextBtn = document.getElementById('next-page');

      // Update info data
      updateDataInfo(data, currentPage);

      // Update button states
      prevBtn.disabled = currentPage === 1;
      nextBtn.disabled = currentPage === totalPages || totalPages === 0;

      // Generate page numbers with box styling
      let paginationHTML = '';
      const maxVisiblePages = 5;
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
          <button class="pagination-number ${i === currentPage ? 'active' : ''}" 
                  onclick="goToPage(${i})">${i}</button>
        `;
      }

      paginationNumbers.innerHTML = paginationHTML;
    }

    // Go to specific page
    function goToPage(page) {
      currentPage = page;
      renderTable(filteredData, currentPage);
    }

    // Previous page
    document.getElementById('prev-page').addEventListener('click', () => {
      if (currentPage > 1) {
        goToPage(currentPage - 1);
      }
    });

    // Next page
    document.getElementById('next-page').addEventListener('click', () => {
      const totalPages = Math.ceil(filteredData.length / itemsPerPage);
      if (currentPage < totalPages) {
        goToPage(currentPage + 1);
      }
    });

      // Initialize table when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
      renderTable(UMKM_DATA, currentPage);
    });
   // Pastikan event listener aktif
    document.getElementById('filter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    applyFilters();
    console.log("RT select:", document.getElementById('rt').value);
    console.log("RT dari data:", [...new Set(UMKM_DATA.map(d => String(d.rt)))]);

      });

    function applyFilters() {
      const kategoriVal = document.getElementById('kategori-umkm').value.trim().toLowerCase();
      const rtVal = document.getElementById('rt').value.trim();
      const rwVal = document.getElementById('rw').value.trim();
      const skuVal = document.getElementById('status-nib').value.trim().toLowerCase();
      const halalVal = document.getElementById('status-halal').value.trim().toLowerCase();

      console.log("RT selected:", rtVal);
      console.log("RW selected:", rwVal);
      console.log("All RT in data:", [...new Set(UMKM_DATA.map(d => String(d.rt)))]);
      console.log("All RW in data:", [...new Set(UMKM_DATA.map(d => String(d.rw)))]);
      console.log("Filter RT:", rtVal);
      console.log("Data RT tersedia:", [...new Set(UMKM_DATA.map(d => d.rt))]);

      filteredData = UMKM_DATA.filter(item => {
      const kategoriOk = kategoriVal === 'all' || (item.kategori?.trim().toLowerCase() === kategoriVal);
      const rtOk = rtVal === 'all' || String(item.rt).trim() === rtVal;
      const rwOk = rwVal === 'all' || String(item.rw).trim() === rwVal;
      const skuOk = skuVal === 'all' || item.status_nib.toLowerCase().includes(skuVal);
      const halalOk = halalVal === 'all' || (
      halalVal === 'memiliki'
        ? item.sertif_halal?.toLowerCase().includes('memiliki')
        : item.sertif_halal?.toLowerCase().includes('belum')
    );

      return kategoriOk && rtOk && rwOk && skuOk && halalOk;
    });

      console.log("Data setelah filter:", filteredData.length);

      currentPage = 1;
      renderTable(filteredData, currentPage);
    }

        // Reset filters
        function resetFilters() {
          document.getElementById('filter-form').reset();
          filteredData = [...UMKM_DATA];
          currentPage = 1;
          renderTable(filteredData, currentPage);

        }        

        // Event listeners
        document.getElementById('filter-form').addEventListener('submit', (e) => {
          e.preventDefault();
          applyFilters();
        });

        document.getElementById('filter-form').addEventListener('reset', () => {
          setTimeout(resetFilters, 100);
        });

        // Chatbot functionality - FIXED VERSION
        function makeLinksClickable(text) {
          const urlRegex = /(https?:\/\/[^\s]+)/g;
          return text.replace(urlRegex, function (url) {
            return `<a href="${url}" target="_blank" class="clickable-link">${url}</a>`;
          });
        }

        function toggleChatbot() {
          // FIXED: Ganti 'window' dengan 'chatbotWin' untuk avoid conflict dengan global window object
          const chatbotWin = document.getElementById("chatbotWindow");
          if (!chatbotWin) {
            console.error("Element chatbotWindow tidak ditemukan");
            return;
          }
          chatbotWin.classList.toggle("active");
        }

        function sendMessage() {
          const input = document.getElementById("chatInput");
          if (!input) {
            console.error("Element chatInput tidak ditemukan");
            return;
          }
          
          const message = input.value.trim();

          if (message) {
            addMessage(message, "user");
            input.value = "";

            // Auto-collapse questions
            autoCollapseQuestions();

            // Show typing indicator
            showTypingIndicator();

            // Simulate bot response
            setTimeout(() => {
              hideTypingIndicator();
              const response = getBotResponse(message);
              addMessage(response, "bot");
            }, 1500);
          }
        }

        function handleEnter(event) {
          if (event.key === "Enter") {
            sendMessage();
          }
        }

        function addMessage(text, sender) {
          const messagesContainer = document.getElementById("chatbotMessages");
          if (!messagesContainer) {
            console.error("Element chatbotMessages tidak ditemukan");
            return;
          }
          
          const messageDiv = document.createElement("div");
          messageDiv.className = `message ${sender}`;

          const bubbleDiv = document.createElement("div");
          bubbleDiv.className = "message-bubble";

          // FIXED: Tambahkan makeLinksClickable untuk pesan bot
          if (sender === "bot") {
            bubbleDiv.innerHTML = makeLinksClickable(text);
          } else {
            bubbleDiv.innerHTML = text;
          }

          messageDiv.appendChild(bubbleDiv);
          messagesContainer.appendChild(messageDiv);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function askQuestion(type) {
          let question = "";
          let response = "";

          switch (type) {
            case "panduan-kbli":
              question = "Panduan KBLI (Klasifikasi Baku Lapangan Usaha)";
              response = `📋 <strong>Panduan KBLI:</strong><br><br>
                        KBLI (Klasifikasi Baku Lapangan Usaha Indonesia) adalah sistem klasifikasi resmi yang digunakan di Indonesia untuk mengelompokkan kegiatan ekonomi atau jenis usaha berdasarkan aktivitas utamanya. KBLI ini wajib dicantumkan saat pelaku usaha mendaftarkan NIB (Nomor Induk Berusaha) melalui sistem OSS (Online Single Submission).<br><br>
                        <strong>Fungsi KBLI dalam pengajuan NIB:</strong><br>
                        Menentukan jenis usaha yang dijalankan pelaku usaha. 
                        Menjadi dasar penentuan perizinan berusaha dan kewajiban lainnya.
                        Digunakan oleh pemerintah untuk keperluan statistik, pajak, dan pembinaan usaha. <br><br>
                        <strong>Cara menentukan KBLI:</strong><br>
                        1. Identifikasi kegiatan utama usaha Anda<br>
                        2. Cari kategori yang paling sesuai di daftar KBLI<br>
                        3. Gunakan kode 5 digit yang tepat<br><br>
                        <strong>Contoh:</strong><br>
                        • Warung makan: 56101<br>
                        • Toko kelontong: 47211<br>
                        • Jasa potong rambut: 96021`;
              break;

            case "persyaratan-nib":
              question = "Persyaratan Pengajuan NIB";
              response = `📄 <strong>Persyaratan NIB (Nomor Induk Berusaha):</strong><br><br>
                        <strong>Dokumen yang diperlukan untuk Usaha Perseorangan (UMK/Usaha Mikro dan Kecil):</strong><br>
                        1.	KTP dan NIK pemilik usaha<br>
                        2.	Alamat lengkap usaha<br>
                        3.	Jenis dan nama usaha<br>
                        4.	Nomor telepon dan email aktif<br>
                        5.	Kode KBLI yang sesuai dengan jenis usaha<br>
                        6.	NPWP (jika ada)<br>
                        7.	Lokasi dan luas tempat usaha<br>
                        8.	Jumlah tenaga kerja<br>
                        9.	Rencana investasi atau modal usaha<br>
                        10.	Surat pernyataan bersedia mematuhi peraturan (akan muncul otomatis di sistem OSS)<br><br>
                        <strong>Untuk Badan Usaha (PT, CV, Yayasan, dll.):</strong><br>
                        1.	Akta pendirian dan SK Kemenkumham<br>
                        2.	NPWP Badan Usaha<br>
                        3.	Data pengurus/pemilik<br>
                        4.	Alamat email & nomor HP perusahaan<br>
                        5.	Dokumen pendukung lain tergantung jenis badan usaha<br><br>
                        <strong>Catatan:</strong><br>
                        • NIB berlaku seumur hidup<br>
                        • Gratis dan dapat diurus online di OSS`;
              break;

            case "langkah-nib":
              question = "Langkah-langkah Pengajuan NIB";
              response = `📝 <strong>Langkah-langkah Pengajuan NIB </strong><br><br>
                        Pengajuan NIB dilakukan secara online melalui platform resmi OSS (Online Single Submission). NIB dapat diperoleh oleh pelaku usaha perseorangan maupun non-perseorangan (seperti PT, CV, koperasi, yayasan). <br><br>
                        <strong>Adapun Langkah-langkah Pengajuan NIB : </strong><br>
                        1. Akses Website OSS. Buka https://oss.go.id Pilih menu "Daftar" dan buat akun OSS jika belum memiliki.<br>
                        2. Lengkapi data diri dan data usaha.<br>
                        3. Pilih KBLI sesuai usaha.<br>
                        4. Submit dan cetak NIB.<br><br>
                        <strong>Catatan:</strong> Gunakan KBLI 2020 yang sesuai agar tidak terkendala dalam proses perizinan lanjutan. Simpan baik-baik file NIB dan akun OSS kamu.`;
              break;

            case "persyaratan-halal":
              question = "Persyaratan Sertifikat Halal";
              response = `🥘 <strong>Persyaratan Sertifikat Halal:</strong><br><br>
                        <strong>Dokumen yang diperlukan:</strong><br>
                        1. Sertifikat NIB<br>
                        2. Manual sistem jaminan halal<br>
                        3. Daftar produk dan bahan baku<br>
                        4. Sertifikat halal bahan baku<br>
                        5. Dokumentasi proses produksi<br>
                        6. Daftar penyelia halal<br><br>
                        <strong>Biaya:</strong><br>
                        • Mikro: Gratis<br>
                        • Kecil: Rp 300.000<br>
                        • Menengah: Rp 2.500.000`;
              break;

            case "langkah-halal":
              question = "Langkah-langkah Sertifikat Halal";
              response = `✅ <strong>Langkah-langkah Sertifikat Halal:</strong><br><br>
                        1. <strong>Persiapan</strong> dokumen persyaratan<br>
                        2. <strong>Daftar</strong> di SIHALAL https://bpjph.halal.go.id/ <br>
                        3. <strong>Upload</strong> semua dokumen<br>
                        4. <strong>Pembayaran</strong> biaya sertifikasi<br>
                        5. <strong>Pemeriksaan</strong> dokumen oleh LPPOM MUI<br>
                        6. <strong>Audit</strong> ke lokasi produksi<br>
                        7. <strong>Keputusan</strong> komisi fatwa MUI<br>
                        8. <strong>Penerbitan</strong> sertifikat halal<br><br>
                        <strong>Masa berlaku:</strong> 4 tahun`;
              break;

            case "bantuan-umkm":
              question = "Program Bantuan UMKM";
              response = `💰 <strong>Program Bantuan UMKM:</strong><br><br>
                        <strong>1. Bantuan Produktif Usaha Mikro (BPUM)</strong><br>
                        • Dana bantuan Rp 2.4 juta<br>
                        • Untuk usaha mikro terdampak pandemi<br><br>
                        <strong>2. KUR (Kredit Usaha Rakyat)</strong><br>
                        • Mikro: hingga Rp 50 juta<br>
                        • Kecil: hingga Rp 500 juta<br>
                        • Bunga rendah dan mudah diakses<br><br>
                        <strong>3. Program Pelatihan UMKM</strong><br>
                        • Pelatihan digital marketing<br>
                        • Manajemen keuangan usaha<br>
                        • Pengembangan produk<br><br>
                        <strong>Info lebih lanjut:</strong> Hubungi Dinas Koperasi setempat`;
              break;
          }

          addMessage(question, "user");

          // Show typing indicator
          showTypingIndicator();

          setTimeout(() => {
            hideTypingIndicator();
            addMessage(response, "bot");

            // Auto-collapse questions setelah memilih
            autoCollapseQuestions();
          }, 1500);
        }

        function getBotResponse(message) {
          const msg = message.toLowerCase();

          if (msg.includes("halo") || msg.includes("hai") || msg.includes("selamat")) {
            return "Halo! 👋 Selamat datang di BAKUL KAHURIPAN. Saya siap membantu Anda dengan informasi seputar UMKM, NIB, sertifikat halal, dan layanan lainnya. Ada yang bisa saya bantu?";
          }

          if (msg.includes("nib") || msg.includes("nomor induk berusaha")) {
            return `🆔 <strong>Tentang NIB:</strong><br><br>
                    NIB (Nomor Induk Berusaha) adalah identitas tunggal untuk pelaku usaha di Indonesia. NIB menggantikan TDP, SIUP, dan izin usaha lainnya.<br><br>
                    Silakan pilih pertanyaan spesifik tentang NIB di menu cepat, atau tanyakan hal spesifik yang ingin Anda ketahui.`;
          }

          if (msg.includes("halal") || msg.includes("sertifikat halal")) {
            return `🥘 <strong>Tentang Sertifikat Halal:</strong><br><br>
                    Sertifikat halal adalah bukti tertulis yang dikeluarkan oleh MUI untuk menyatakan kehalalan suatu produk.<br><br>
                    Wajib untuk produk makanan, minuman, obat, dan kosmetik yang beredar di Indonesia.<br><br>
                    Pilih pertanyaan spesifik di menu cepat untuk info lebih detail!`;
          }

          if (msg.includes("kbli") || msg.includes("klasifikasi")) {
            return `📋 <strong>Tentang KBLI:</strong><br><br>
                    KBLI adalah sistem klasifikasi untuk mengelompokkan unit usaha menurut kegiatan ekonomi yang dilakukan.<br><br>
                    Setiap usaha harus memiliki kode KBLI yang sesuai dengan kegiatan utamanya. Pilih "Panduan KBLI" di menu cepat untuk info lengkap!`;
          }

          if (msg.includes("bantuan") || msg.includes("modal") || msg.includes("pinjaman")) {
            return `💰 <strong>Program Bantuan UMKM:</strong><br><br>
                    Ada berbagai program bantuan untuk UMKM seperti BPUM, KUR, dan program pelatihan.<br><br>
                    Pilih "Program Bantuan UMKM" di menu cepat untuk info lengkap tentang syarat dan cara mengajukan!`;
          }

          if (msg.includes("terima kasih") || msg.includes("thanks")) {
            return "🙏 Sama-sama! Senang bisa membantu Anda. Jika ada pertanyaan lain tentang UMKM, NIB, sertifikat halal, atau layanan BAKUL KAHURIPAN lainnya, jangan ragu untuk bertanya ya!";
          }

          if (msg.includes("statistik") || msg.includes("data")) {
            return `📊 <strong>Data UMKM BAKUL KAHURIPAN:</strong><br><br>
                    • Total UMKM: 443 usaha<br>
                    • Yang sudah memiliki NIB: 86 usaha<br>
                    • Kategori terbanyak: Kuliner (168 usaha)<br>
                    • Tersebar di 104 RT dan 19 RW<br><br>
                    Data ini terus diupdate untuk memberikan gambaran terkini perkembangan UMKM di wilayah Kahuripan.`;
          }

          // Default response
          return `Maaf, saya belum memahami pertanyaan Anda dengan baik. 😅<br><br>
                Silakan pilih dari pertanyaan yang tersedia di menu cepat, atau coba tanyakan tentang:<br>
                • NIB (Nomor Induk Berusaha)<br>
                • Sertifikat Halal<br>
                • KBLI<br>
                • Program Bantuan UMKM<br>
                • Statistik UMKM<br><br>
                Atau ketik pertanyaan dengan kata kunci yang lebih spesifik ya! 🤖`;
        }

        // Add typing indicator
        function showTypingIndicator() {
          const messagesContainer = document.getElementById("chatbotMessages");
          if (!messagesContainer) {
            console.error("Element chatbotMessages tidak ditemukan");
            return;
          }
          
          const typingDiv = document.createElement("div");
          typingDiv.className = "message bot typing-indicator";
          typingDiv.id = "typing-indicator";

          const bubbleDiv = document.createElement("div");
          bubbleDiv.className = "message-bubble";
          bubbleDiv.innerHTML = "💭 Sedang mengetik...";

          typingDiv.appendChild(bubbleDiv);
          messagesContainer.appendChild(typingDiv);
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        function hideTypingIndicator() {
          const indicator = document.getElementById("typing-indicator");
          if (indicator) {
            indicator.remove();
          }
        }

        // Function to toggle quick questions
        function toggleQuestions() {
          const quickQuestions = document.getElementById("quickQuestions");
          if (!quickQuestions) {
            console.error("Element quickQuestions tidak ditemukan");
            return;
          }
          
          const isExpanded = quickQuestions.classList.contains("expanded");

          if (isExpanded) {
            quickQuestions.classList.remove("expanded");
            quickQuestions.classList.add("collapsed");
          } else {
            quickQuestions.classList.remove("collapsed");
            quickQuestions.classList.add("expanded");
          }
        }

        // Auto-collapse questions after user sends a message
        function autoCollapseQuestions() {
          const quickQuestions = document.getElementById("quickQuestions");
          if (quickQuestions && quickQuestions.classList.contains("expanded")) {
            setTimeout(() => {
              quickQuestions.classList.remove("expanded");
              quickQuestions.classList.add("collapsed");
            }, 1000);
          }
        }

        // Chatbot animations and effects
        document.addEventListener("DOMContentLoaded", function () {
          console.log("DOM loaded, initializing chatbot...");
          
          // Set initial state ke expanded
          const quickQuestions = document.getElementById("quickQuestions");
          if (quickQuestions) {
            quickQuestions.classList.add("expanded");
            console.log("Quick questions initialized");
          } else {
            console.error("quickQuestions element tidak ditemukan");
          }

          // Add welcome message animation
          setTimeout(() => {
            const firstMessage = document.querySelector(".message.bot .message-bubble");
            if (firstMessage) {
              firstMessage.style.animation = "fadeInUp 0.5s ease";
            }
          }, 500);

          // Add floating animation to chatbot button
          const chatbotToggle = document.querySelector(".chatbot-toggle");
          if (chatbotToggle) {
            setInterval(() => {
              chatbotToggle.style.transform = "translateY(-2px) scale(1.02)";
              setTimeout(() => {
                chatbotToggle.style.transform = "translateY(0) scale(1)";
              }, 1000);
            }, 3000);
          }
        });

        // Add CSS for chatbot animations
        const chatbotStyle = document.createElement("style");
        chatbotStyle.textContent = `
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .typing-indicator .message-bubble {
                    animation: pulse 1.5s infinite;
                }
                
                @keyframes pulse {
                    0% { opacity: 1; }
                    50% { opacity: 0.7; }
                    100% { opacity: 1; }
                }
                
                .question-button {
                    position: relative;
                    overflow: hidden;
                }
                
                .question-button::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
                    transition: left 0.5s ease;
                }
                
                .question-button:hover::before {
                    left: 100%;
                }
            `;
        document.head.appendChild(chatbotStyle);

        // Test function - untuk debug
        function testChatbot() {
          console.log("Testing chatbot elements:");
          console.log("chatbotWindow:", document.getElementById("chatbotWindow"));
          console.log("chatInput:", document.getElementById("chatInput"));
          console.log("chatbotMessages:", document.getElementById("chatbotMessages"));
          console.log("quickQuestions:", document.getElementById("quickQuestions"));
        }

      console.log("Contoh data:", UMKM_DATA.slice(0, 5));
      console.log(
        "Semua nilai sertif_halal:",
        UMKM_DATA.map((d) => d.sertif_halal)
      );

      console.log("Contoh data:", UMKM_DATA.slice(0, 5));
      console.log("Semua nilai sertif_halal:", UMKM_DATA.map(d => d.sertif_halal));





        
