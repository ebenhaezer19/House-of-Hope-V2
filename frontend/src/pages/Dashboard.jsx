import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
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

  // Fungsi untuk menghitung statistik timeline
  const calculateTimeStats = (residents) => {
    console.log('Raw residents data:', residents);

    // Inisialisasi statistik per bulan
    const monthlyStats = {};
    
    residents.forEach(resident => {
      const createdAt = new Date(resident.createdAt);
      const monthKey = `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}`;
      
      // Inisialisasi data bulan jika belum ada
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          active: 0,
          new: 0,
          alumni: 0,
          total: 0
        };
      }

      // Hitung berdasarkan status
      if (resident.status === 'ALUMNI') {
        // Jika alumni, tambahkan ke bulan keluar
        if (resident.exitDate) {
          const exitDate = new Date(resident.exitDate);
          const exitMonthKey = `${exitDate.getFullYear()}-${(exitDate.getMonth() + 1).toString().padStart(2, '0')}`;
          
          if (!monthlyStats[exitMonthKey]) {
            monthlyStats[exitMonthKey] = {
              active: 0,
              new: 0,
              alumni: 0,
              total: 0
            };
          }
          
          monthlyStats[exitMonthKey].alumni++;
          monthlyStats[exitMonthKey].total--;
        }
      } else if (resident.status === 'NEW') {
        monthlyStats[monthKey].new++;
        monthlyStats[monthKey].total++;
      } else {
        monthlyStats[monthKey].active++;
        monthlyStats[monthKey].total++;
      }
    });

    console.log('Monthly stats before sorting:', monthlyStats);

    // Sort bulan
    const sortedMonths = Object.keys(monthlyStats).sort();

    // Hitung akumulasi
    let runningTotal = 0;
    sortedMonths.forEach(month => {
      runningTotal += monthlyStats[month].total;
      monthlyStats[month].active = runningTotal - monthlyStats[month].alumni;
    });

    // Format hasil akhir
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

    console.log('Final timeline stats:', result);
    return result;
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const response = await api.get('/api/residents')
        const residentsData = response.data
        console.log('Raw residents data:', residentsData)

        // Simpan data residents
        setResidents(residentsData);

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

        // Tambahkan perhitungan timeline stats
        const timelineStats = calculateTimeStats(residentsData);
        setTimeStats({
          byMonth: timelineStats
        });

      } catch (error) {
        console.error('Error fetching statistics:', error)
        setError('Gagal memuat statistik')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

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
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      },
      {
        label: 'Penghuni Baru',
        data: timeStats.byMonth.new,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1
      },
      {
        label: 'Alumni',
        data: timeStats.byMonth.alumni,
        backgroundColor: 'rgba(245, 158, 11, 0.8)',
        borderColor: 'rgba(245, 158, 11, 1)',
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
        stacked: true
      },
      y: {
        stacked: true,
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
        intersect: false
      }
    }
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
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Statistik Penghuni</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium">Total Penghuni</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">{stats.total}</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium">Berdasarkan Gender</h3>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-gray-600">Laki-laki:</span>
                <span className="ml-2 font-bold text-indigo-600">{stats.byGender.MALE}</span>
              </div>
              <div>
                <span className="text-gray-600">Perempuan:</span>
                <span className="ml-2 font-bold text-indigo-600">{stats.byGender.FEMALE}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <h3 className="text-lg font-medium">Berdasarkan Bantuan</h3>
            <div className="mt-2 space-y-2">
              <div>
                <span className="text-gray-600">Yayasan:</span>
                <span className="ml-2 font-bold text-indigo-600">{stats.byAssistance.YAYASAN}</span>
              </div>
              <div>
                <span className="text-gray-600">Diakonia:</span>
                <span className="ml-2 font-bold text-indigo-600">{stats.byAssistance.DIAKONIA}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-medium mb-4">Statistik Pendidikan</h3>
          <div className="h-[300px]">
            <Bar data={educationChartData} options={chartOptions} />
          </div>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-medium mb-4">Statistik Gender</h3>
            <div className="h-[200px]">
              <Doughnut data={genderChartData} options={chartOptions} />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-medium mb-4">Statistik Bantuan</h3>
            <div className="h-[200px]">
              <Pie data={assistanceChartData} options={chartOptions} />
            </div>
          </Card>
        </div>
      </div>

      {/* Timeline Section */}
      <Card>
        <h3 className="text-lg font-medium mb-4">Statistik Timeline Penghuni</h3>
        
        {/* Status Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-indigo-50 rounded-lg">
            <h4 className="text-sm font-medium text-indigo-600">Penghuni Aktif</h4>
            <p className="text-2xl font-bold text-indigo-600">
              {residents.filter(r => r.status === 'ACTIVE').length}
            </p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <h4 className="text-sm font-medium text-green-600">Penghuni Baru</h4>
            <p className="text-2xl font-bold text-green-600">
              {residents.filter(r => r.status === 'NEW').length}
            </p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <h4 className="text-sm font-medium text-yellow-600">Alumni</h4>
            <p className="text-2xl font-bold text-yellow-600">
              {residents.filter(r => r.status === 'ALUMNI').length}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[300px]">
          <Bar 
            ref={chartRef}
            data={timelineChartData} 
            options={timelineChartOptions}
          />
        </div>
      </Card>
    </div>
  )
}

export default Dashboard 