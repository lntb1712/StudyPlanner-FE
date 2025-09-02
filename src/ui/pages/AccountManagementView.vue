<script setup lang="ts">
import { ref, onMounted } from "vue";
import { AccountManagementRepository } from "../../infrastucture/repositories/AccountManagementRepository/AccountManagementRepository";
import type { AccountManagementResponseDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";
import type { PagedResponse } from "../../domain/value-objects/PagedResponse";

const repository = new AccountManagementRepository();

const accounts = ref<AccountManagementResponseDTO[]>([]);
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(1);
const searchText = ref("");

const isLoading = ref(false);
const errorMessage = ref("");

const fetchAccounts = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    const response: PagedResponse<AccountManagementResponseDTO> =
      await repository.getAllAccounts(currentPage.value, pageSize.value);

    accounts.value = response.data;
    totalPages.value = response.totalPages;
  } catch (err: any) {
    errorMessage.value = err.message || "Không thể tải danh sách tài khoản";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchAccounts);

const handleSearch = () => {
  // sau này gọi API search
  console.log("Search:", searchText.value);
};

</script>
<template>
  <div class="space-y-6 p-6 bg-gray-50 rounded-xl shadow-md text-sm"> <!-- thêm text-sm cho toàn bộ -->
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-800">Quản lý tài khoản</h2> <!-- text-lg vừa phải -->
      <div class="relative">
        <input
          v-model="searchText"
          @keyup.enter="handleSearch"
          type="text"
          placeholder="Tìm kiếm tài khoản..."
          class="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
        />
        <span class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">🔍</span>
      </div>
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="p-3 text-xs text-red-700 bg-red-100 border border-red-300 rounded-lg">
      {{ errorMessage }}
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
      <table class="w-full text-left border-collapse text-sm text-gray-600"> <!-- text-sm cho table -->
        <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-medium sticky top-0">
          <tr>
            <th class="px-4 py-2 border-b">Tên tài khoản</th>
            <th class="px-4 py-2 border-b">Tên đầy đủ</th>
            <th class="px-4 py-2 border-b">Vai trò</th>
            <th class="px-4 py-2 border-b">Email</th>
            <th class="px-4 py-2 border-b">Email phụ huynh</th>
            <th class="px-4 py-2 border-b">Ngày tạo</th>
            <th class="px-4 py-2 border-b text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(account, index) in accounts"
            :key="index"
            class="border-b last:border-b-0 hover:bg-blue-50 transition duration-200"
          >
            <td class="px-4 py-2">{{ account.Username }}</td>
            <td class="px-4 py-2">{{ account.FullName }}</td>
            <td class="px-4 py-2">{{ account.GroupName }}</td>
            <td class="px-4 py-2">{{ account.Email }}</td>
            <td class="px-4 py-2">{{ account.ParentEmail }}</td>
            <td class="px-4 py-2">{{ account.CreatedAt }}</td>
            <td class="px-4 py-2 text-center space-x-2">
              <button class="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 transition duration-200 shadow-sm">
                ✏️ Sửa
              </button>
              <button class="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition duration-200 shadow-sm">
                🗑️ Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-center items-center space-x-3 mt-4 text-sm">
      <button
        @click="currentPage > 1 && (currentPage--, fetchAccounts())"
        class="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition duration-200 shadow-sm"
        :disabled="currentPage === 1"
      >
        ⬅️ Trước
      </button>
      <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium shadow-sm">
        Trang {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        @click="currentPage < totalPages && (currentPage++, fetchAccounts())"
        class="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition duration-200 shadow-sm"
        :disabled="currentPage === totalPages"
      >
        Tiếp ➡️
      </button>
    </div>
  </div>
</template>
