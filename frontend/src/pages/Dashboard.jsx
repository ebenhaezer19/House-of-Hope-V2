import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Outlet } from 'react-router-dom'
import api from '../services/api'
import { Card } from '../components/shared'
import { Bar, Pie, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

const Dashboard = () => {
  const navigate = useNavigate()
  const [residents, setResidents] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    byEducation: {},
    byGender: {
      MALE: 0,
      FEMALE: 0
    },
    byAssistance: {
      YAYASAN: 0,
      DIAKONIA: 0
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [timeStats, setTimeStats] = useState({
    byMonth: {
      labels: [],
      active: [],
      new: [],
      alumni: []
    }
  });

  // Tambahkan ref untuk chart
  const chartRef = useRef(null);
  const dashboardRef = useRef(null);  // Tambahkan ref untuk dashboard container

  // Definisikan warna yang konsisten
  const chartColors = {
    active: 'rgb(79, 70, 229)', // Indigo-600 untuk Penghuni Aktif
    new: 'rgb(34, 197, 94)',    // Green-600 untuk Penghuni Baru
    alumni: 'rgb(202, 138, 4)'  // Yellow-600 untuk Alumni
  };

  // Fungsi untuk menghitung statistik timeline
  const calculateTimeStats = (residents) => {
    // Inisialisasi statistik per bulan
    const monthlyStats = {};
    
    // Dapatkan rentang waktu yang mencakup semua data
    const allDates = [];
    
    residents.forEach(resident => {
      // Tambahkan tanggal masuk
      allDates.push(new Date(resident.createdAt));
      
      // Tambahkan tanggal keluar untuk alumni
      if (resident.status === 'ALUMNI' && resident.exitDate) {
        allDates.push(new Date(resident.exitDate));
      }
    });

    const minDate = allDates.length > 0 ? new Date(Math.min(...allDates)) : new Date();
    const maxDate = new Date();

    // Inisialisasi semua bulan dengan nilai 0
    let currentDate = new Date(minDate);
    while (currentDate <= maxDate) {
      const monthKey = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
      monthlyStats[monthKey] = { active: 0, new: 0, alumni: 0 };
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Proses setiap penghuni
    residents.forEach(resident => {
      const startDate = new Date(resident.createdAt);
      const startKey = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}`;

      console.log('Processing resident:', {
        name: resident.name,
        status: resident.status,
        startKey,
        exitDate: resident.exitDate
      });

      switch (resident.status) {
        case 'NEW':
          // Penghuni baru dihitung di bulan masuk
          if (monthlyStats[startKey]) {
            monthlyStats[startKey].new++;
          }
          break;

        case 'ALUMNI':
          if (resident.exitDate) {
            const exitDate = new Date(resident.exitDate);
            const exitKey = `${exitDate.getFullYear()}-${(exitDate.getMonth() + 1).toString().padStart(2, '0')}`;
            
            console.log('Alumni processing:', {
              name: resident.name,
              exitKey,
              monthlyStats: monthlyStats[exitKey]
            });

            // Tambahkan ke alumni di bulan keluar
            if (monthlyStats[exitKey]) {
              monthlyStats[exitKey].alumni++;
            }

            // Untuk alumni, tidak perlu dihitung sebagai aktif setelah tanggal keluar
            let currentDate = new Date(startDate);
            while (currentDate < exitDate) {
              const key = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
              if (monthlyStats[key]) {
                monthlyStats[key].active++;
              }
              currentDate.setMonth(currentDate.getMonth() + 1);
            }
          }
          break;

        case 'ACTIVE':
          // Hitung sebagai aktif dari bulan masuk sampai sekarang
          let currentDate = new Date(startDate);
          const now = new Date();
          while (currentDate <= now) {
            const key = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}`;
            if (monthlyStats[key]) {
              monthlyStats[key].active++;
            }
            currentDate.setMonth(currentDate.getMonth() + 1);
          }
          break;
      }
    });

    // Format hasil dengan urutan bulan yang benar
    const sortedMonths = Object.keys(monthlyStats).sort();
    const result = {
      labels: sortedMonths.map(month => {
        const [year, monthNum] = month.split('-');
        return new Date(year, parseInt(monthNum) - 1).toLocaleDateString('id-ID', { 
          month: 'short', 
          year: 'numeric' 
        });
      }),
      active: sortedMonths.map(month => monthlyStats[month].active),
      new: sortedMonths.map(month => monthlyStats[month].new),
      alumni: sortedMonths.map(month => monthlyStats[month].alumni)
    };

    console.log('Monthly stats:', monthlyStats);
    console.log('Final timeline stats:', result);
    return result;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/residents');
        const residentsData = response.data;
        
        console.log('Fetched residents data:', residentsData);
        setResidents(residentsData);

        // Hitung statistik timeline
        const timelineStats = calculateTimeStats(residentsData);
        setTimeStats({
          byMonth: timelineStats
        });

        // Hitung statistik
        const statistics = {
          total: residentsData.length,
          byEducation: {},
          byGender: {
            MALE: 0,
            FEMALE: 0
          },
          byAssistance: {
            YAYASAN: 0,
            DIAKONIA: 0
          }
        }

        // Hitung berdasarkan pendidikan
        residentsData.forEach(resident => {
          if (resident.education) {
            statistics.byEducation[resident.education] = 
              (statistics.byEducation[resident.education] || 0) + 1
          }
          
          if (resident.gender) {
            statistics.byGender[resident.gender]++
          }
          
          if (resident.assistance) {
            statistics.byAssistance[resident.assistance]++
          }
        })

        console.log('Calculated stats:', statistics) // Debug log
        setStats(statistics)

      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Update useEffect untuk destroy chart sebelum update
  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20
        }
      }
    }
  }

  // Chart data
  const educationChartData = {
    labels: Object.keys(stats.byEducation),
    datasets: [{
      label: 'Jumlah Penghuni',
      data: Object.values(stats.byEducation),
      backgroundColor: [
        'rgba(99, 102, 241, 0.8)',  // Indigo
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(16, 185, 129, 0.8)',  // Green
        'rgba(245, 158, 11, 0.8)',  // Yellow
        'rgba(239, 68, 68, 0.8)',   // Red
        'rgba(168, 85, 247, 0.8)'   // Purple
      ]
    }]
  }

  const genderChartData = {
    labels: ['Laki-laki', 'Perempuan'],
    datasets: [{
      data: [stats.byGender.MALE, stats.byGender.FEMALE],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',  // Blue
        'rgba(236, 72, 153, 0.8)'   // Pink
      ]
    }]
  }

  const assistanceChartData = {
    labels: ['Yayasan', 'Diakonia'],
    datasets: [{
      data: [stats.byAssistance.YAYASAN, stats.byAssistance.DIAKONIA],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',  // Green
        'rgba(245, 158, 11, 0.8)'   // Yellow
      ]
    }]
  }

  // Data untuk timeline chart
  const timelineChartData = {
    labels: timeStats.byMonth.labels,
    datasets: [
      {
        label: 'Penghuni Aktif',
        data: timeStats.byMonth.active,
        backgroundColor: chartColors.active,
        borderColor: chartColors.active,
        borderWidth: 1
      },
      {
        label: 'Penghuni Baru',
        data: timeStats.byMonth.new,
        backgroundColor: chartColors.new,
        borderColor: chartColors.new,
        borderWidth: 1
      },
      {
        label: 'Alumni',
        data: timeStats.byMonth.alumni,
        backgroundColor: chartColors.alumni,
        borderColor: chartColors.alumni,
        borderWidth: 1
      }
    ]
  };

  // Options untuk timeline chart
  const timelineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false
      },
      y: {
        stacked: false,
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        position: 'bottom'
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y || 0;
            return `${label}: ${value} orang`;
          }
        }
      }
    }
  };

  // Fungsi untuk export PDF
  const exportToPDF = async () => {
    try {
      const dashboard = dashboardRef.current;
      const canvas = await html2canvas(dashboard, {
        scale: 2,  // Tingkatkan kualitas
        useCORS: true,  // Untuk menangani gambar cross-origin
        logging: false  // Matikan logging
      });

      const imgWidth = 210;  // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');

      // Tambahkan header
      pdf.setFontSize(16);
      pdf.text('Laporan Statistik Penghuni', 105, 15, { align: 'center' });
      pdf.setFontSize(12);
      pdf.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 105, 22, { align: 'center' });
      
      // Tambahkan gambar dashboard
      pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight);

      // Download PDF
      pdf.save(`statistik-penghuni-${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error('Error exporting PDF:', error);
      // Tambahkan notifikasi error jika perlu
    }
  };

  // Tambahkan fungsi untuk handle klik
  const handleStatusClick = (status) => {
    navigate('/dashboard/residents', { 
      state: { filterStatus: status }
    });
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="text-lg text-gray-600">Memuat statistik...</div>
    </div>
  )

  if (error) return (
    <div className="bg-red-50 p-4 rounded-lg">
      <div className="text-red-700">{error}</div>
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Tampilkan konten dashboard hanya jika di route /dashboard exact */}
      {window.location.pathname === '/dashboard' && (
        <>
          <div className="flex justify-between items-center pb-4 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900">Statistik Penghuni</h1>
            <button
              onClick={exportToPDF}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-sm font-medium text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path 
                  fillRule="evenodd" 
                  d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" 
                  clipRule="evenodd" 
                />
              </svg>
              Export PDF
            </button>
          </div>

          <div ref={dashboardRef} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-3">Total Penghuni</h3>
                  <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-3">Berdasarkan Gender</h3>
                  <div className="mt-3 space-y-3">
                    <div>
                      <span className="text-gray-600">Laki-laki:</span>
                      <span className="ml-3 font-bold text-indigo-600">{stats.byGender.MALE}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Perempuan:</span>
                      <span className="ml-3 font-bold text-indigo-600">{stats.byGender.FEMALE}</span>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium mb-3">Berdasarkan Bantuan</h3>
                  <div className="mt-3 space-y-3">
                    <div>
                      <span className="text-gray-600">Yayasan:</span>
                      <span className="ml-3 font-bold text-indigo-600">{stats.byAssistance.YAYASAN}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Diakonia:</span>
                      <span className="ml-3 font-bold text-indigo-600">{stats.byAssistance.DIAKONIA}</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="p-6">
                <h3 className="text-lg font-medium mb-6">Statistik Pendidikan</h3>
                <div className="h-[300px]">
                  <Bar data={educationChartData} options={chartOptions} />
                </div>
              </Card>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-6">Statistik Gender</h3>
                  <div className="h-[200px]">
                    <Doughnut data={genderChartData} options={chartOptions} />
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-medium mb-6">Statistik Bantuan</h3>
                  <div className="h-[200px]">
                    <Pie data={assistanceChartData} options={chartOptions} />
                  </div>
                </Card>
              </div>
            </div>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-6">Status Penghuni</h3>
              
              <div className="grid grid-cols-3 gap-6">
                <button 
                  onClick={() => handleStatusClick('ACTIVE')}
                  className="text-center p-6 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-150"
                >
                  <h4 className="text-sm font-medium text-indigo-600 mb-2">Penghuni Aktif</h4>
                  <p className="text-2xl font-bold text-indigo-600">
                    {residents.filter(r => r.status === 'ACTIVE').length}
                  </p>
                  <span className="text-sm text-indigo-500 mt-2 block">
                    Klik untuk lihat detail
                  </span>
                </button>

                <button 
                  onClick={() => handleStatusClick('NEW')}
                  className="text-center p-6 bg-green-50 rounded-lg hover:bg-green-100 transition-colors duration-150"
                >
                  <h4 className="text-sm font-medium text-green-600 mb-2">Penghuni Baru</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {residents.filter(r => r.status === 'NEW').length}
                  </p>
                  <span className="text-sm text-green-500 mt-2 block">
                    Klik untuk lihat detail
                  </span>
                </button>

                <button 
                  onClick={() => handleStatusClick('ALUMNI')}
                  className="text-center p-6 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-150"
                >
                  <h4 className="text-sm font-medium text-yellow-600 mb-2">Alumni</h4>
                  <p className="text-2xl font-bold text-yellow-600">
                    {residents.filter(r => r.status === 'ALUMNI').length}
                  </p>
                  <span className="text-sm text-yellow-500 mt-2 block">
                    Klik untuk lihat detail
                  </span>
                </button>
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Outlet untuk nested routes */}
      <Outlet />
    </div>
  )
}

export default Dashboard 