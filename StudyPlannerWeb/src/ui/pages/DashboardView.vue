<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue'; // ✅ FIX: Import nextTick
import Chart from 'chart.js/auto';
import type { DashboardDTO } from '../../domain/entities/DashboardDTO/DashboardDTO'; // ✅ FIX: Import DashboardDTO type (adjust path)
import { useDashboardStore } from '../../application/stores/DashboardStore'; // Adjust path as needed

const dashboardStore = useDashboardStore();
const isLoading = ref(true);
const errorMessage = ref<string | null>(null);
const dashboard = ref<DashboardDTO | null>(null);

// Chart refs
const classesChartRef = ref<HTMLCanvasElement | null>(null);
const groupsChartRef = ref<HTMLCanvasElement | null>(null);
const newAccountsChartRef = ref<HTMLCanvasElement | null>(null);

const fetchData = async () => {
  try {
    await dashboardStore.fetchDashboardData();
    dashboard.value = dashboardStore.dashboard;
    if (!dashboard.value) {
      errorMessage.value = 'Không thể tải dữ liệu dashboard';
    }
  } catch (err) {
    errorMessage.value = 'Lỗi khi tải dữ liệu: ' + (err as Error).message;
  } finally {
    isLoading.value = false;
  }
};

const initCharts = () => {
  if (!dashboard.value) return;

  // Classes Bar Chart
  if (classesChartRef.value && dashboard.value.ClassWithStudentCounts && dashboard.value.ClassWithStudentCounts.length > 0) {
    const ctx = classesChartRef.value.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dashboard.value.ClassWithStudentCounts.map((c) => c.ClassName || 'Unknown'),
          datasets: [{
            label: 'Số Lượng Học Sinh',
            data: dashboard.value.ClassWithStudentCounts.map((c) => c.TotalStudent || 0),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true }
          }
        }
      });
    }
  }

  // Groups Doughnut Chart
  if (groupsChartRef.value && dashboard.value.GroupsWithUserCounts && dashboard.value.GroupsWithUserCounts.length > 0) {
    const ctx = groupsChartRef.value.getContext('2d');
    if (ctx) {
      // Dynamic colors for any number of groups
      const colors = [
        'rgba(34, 197, 94, 0.5)', 'rgba(249, 115, 22, 0.5)', 'rgba(168, 85, 247, 0.5)',
        'rgba(59, 130, 246, 0.5)', 'rgba(245, 101, 101, 0.5)', 'rgba(16, 185, 129, 0.5)',
        'rgba(236, 72, 153, 0.5)', 'rgba(107, 114, 128, 0.5)'
      ];
      const numGroups = dashboard.value.GroupsWithUserCounts.length;
      const backgroundColors = colors.slice(0, numGroups);
      const borderColors = backgroundColors.map(color => color.replace('0.5', '1'));

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: dashboard.value.GroupsWithUserCounts.map((g) => g.GroupName || 'Unknown'),
          datasets: [{
            data: dashboard.value.GroupsWithUserCounts.map((g) => g.TotalUser || 0),
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right', // ✅ Di chuyển chú thích sang bên phải
              labels: {
                boxWidth: 12,
                padding: 16,
                font: { size: 12 }
              }
            },
            title: {
              display: false
            }
          },
          layout: {
            padding: 10
          }
        }

      });
    }
  }

  // New Accounts Trend Chart (Bar chart showing previous vs current month)
  if (newAccountsChartRef.value) {
    const ctx = newAccountsChartRef.value.getContext('2d');
    if (ctx) {
      const current = dashboard.value.TotalNewAccountInMonth || 0;
      const percent = dashboard.value.PercentUpDownNewRegisterAccount || 0;
      let previous = 0;
      if (Math.abs(percent) < 100 && current > 0) {
        previous = Math.round(current / (1 + percent / 100));
      } else {
        previous = current; // Fallback if extreme percentage or no current
      }
      const isIncrease = percent >= 0;

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Tháng trước', 'Tháng này'],
          datasets: [{
            label: 'Tài khoản mới',
            data: [previous, current],
            backgroundColor: [
              'rgba(156, 163, 175, 0.5)', // Previous: gray
              isIncrease ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)' // Current: green if increase, red if decrease
            ],
            borderColor: [
              'rgba(156, 163, 175, 1)',
              isIncrease ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      });
    }
  }
};

onMounted(async () => {
  await fetchData();
  if (dashboard.value) {
    await nextTick(); // ✅ FIX: Use await nextTick() for DOM readiness
    initCharts();
  }
});
</script>

<template>
  <div class="rounded-lg bg-gray-50 py-4">
    <!-- Header -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Tổng quan</h1>
    </div>

    <!-- Loading Spinner -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-4 rounded-lg shadow-lg">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
        <p class="text-center mt-2 text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
      <div class="bg-red-50 border border-red-200 rounded-lg p-3">
        <p class="text-red-700 text-sm">{{ errorMessage }}</p>
      </div>
    </div>

    <!-- Stats Cards Grid -->
    <div v-if="dashboard" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Total Accounts Card -->
        <div class="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Tổng Tài Khoản</p>
              <p class="text-xl font-bold text-gray-900 mt-1">{{ dashboard.TotalAccounts.toLocaleString() }}</p>
            </div>
            <div class="p-2 rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M5.121 17.804A9 9 0 1118.879 6.196 9 9 0 015.121 17.804zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            </div>
          </div>
        </div>

        <!-- Total Groups Card -->
        <div class="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Tổng Nhóm</p>
              <p class="text-xl font-bold text-gray-900 mt-1">{{ dashboard.TotalGroups.toLocaleString() }}</p>
            </div>
            <div class="p-2 rounded-full bg-green-100">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total Classes Card -->
        <div class="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Tổng Lớp Học</p>
              <p class="text-xl font-bold text-gray-900 mt-1">{{ dashboard.TotalClasses.toLocaleString() }}</p>
            </div>
            <div class="p-2 rounded-full bg-purple-100">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Total New Accounts in Month Card -->
        <div class="bg-white rounded-xl shadow-md p-4 border border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-600">Tài Khoản Mới Tháng Này</p>
              <p class="text-xl font-bold text-gray-900 mt-1">{{ dashboard.TotalNewAccountInMonth.toLocaleString() }}
              </p>
              <!-- Percentage below -->
              <div class="mt-1 flex items-center">
                <span :class="[
                  'text-xs font-medium',
                  dashboard.PercentUpDownNewRegisterAccount >= 0 ? 'text-green-600' : 'text-red-600'
                ]">
                  {{ dashboard.PercentUpDownNewRegisterAccount >= 0 ? '+' : '' }}{{
                    dashboard.PercentUpDownNewRegisterAccount.toFixed(1) }}%
                </span>
                <svg v-if="dashboard.PercentUpDownNewRegisterAccount >= 0" class="w-3 h-3 ml-1 text-green-500"
                  fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd" />
                </svg>
                <svg v-else class="w-3 h-3 ml-1 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <div class="p-2 rounded-full bg-orange-100">
              <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div v-if="dashboard" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 flex-1">
      <!-- Hai biểu đồ trên cùng một hàng -->
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Classes with Student Counts Chart (Bar Chart) -->
        <div class="bg-white rounded-xl shadow-md p-4 border border-gray-200 overflow-hidden flex-1">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">
            Phân Bố Số Lượng Học Sinh Theo Lớp
          </h2>
          <div class="h-64">
            <canvas ref="classesChartRef" class="w-full h-full"></canvas>
          </div>
        </div>

        <!-- Groups with User Counts Chart (Doughnut Chart) -->
        <div class="bg-white rounded-xl shadow-md p-4 border border-gray-200 overflow-hidden flex-1">
          <h2 class="text-lg font-semibold text-gray-900 mb-3">
            Phân Bố Số Lượng Người Dùng Theo Nhóm
          </h2>
          <div class="h-64">
            <canvas ref="groupsChartRef" class="w-full h-full"></canvas>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Custom styles if needed */
</style>