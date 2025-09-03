<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAccountManagementStore } from "../../application/stores/AccountManagementStore";
import type { AccountManagementRequestDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";

const store = useAccountManagementStore();

// Reactive
const searchText = ref("");
const currentPage = ref(1);
const pageSize = ref(10);

// Modal state
const isModalOpen = ref(false);
const isEditMode = ref(false);
const newAccount = ref<AccountManagementRequestDTO>({
  UserName: "",
  FullName: "",
  Email: "",
  ParentEmail: "",
  Password: "",
  GroupId: "USER",
});

// Computed từ store
const accounts = computed(() => store.accounts);
const totalPages = computed(() =>
  Math.ceil(store.totalAccounts / pageSize.value)
);
const isLoading = computed(() => store.isLoading);
const errorMessage = computed(() => store.errorMessage);

// Load dữ liệu ban đầu
onMounted(() => {
  store.fetchAccounts(currentPage.value, pageSize.value);
});

// Search
const handleSearch = async () => {
  currentPage.value = 1;
  if (searchText.value.trim() === "") {
    await store.fetchAccounts(currentPage.value, pageSize.value);
  } else {
    await store.searchAccounts(
      searchText.value,
      currentPage.value,
      pageSize.value
    );
  }
};

// Pagination
const goPrevPage = async () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    await handleSearch();
  }
};
const goNextPage = async () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    await handleSearch();
  }
};

// Thêm account
const handleAdd = () => {
  isEditMode.value = false;
  newAccount.value = {
    UserName: "",
    FullName: "",
    Email: "",
    ParentEmail: "",
    Password: "",
    GroupId: "USER",
  };
  isModalOpen.value = true;
};

// Sửa account
const handleEdit = (account: any) => {
  isEditMode.value = true;
  newAccount.value = {
    UserName: account.UserName,
    FullName: account.FullName,
    Email: account.Email,
    ParentEmail: account.ParentEmail,
    Password: "", // để trống khi sửa
    GroupId: account.GroupId || "USER",
  };
  isModalOpen.value = true;
};

// Xóa account
const handleDelete = async (username: string) => {
  if (confirm(`Bạn có chắc muốn xóa tài khoản ${username}?`)) {
    await store.deleteAccount(username);
    await handleSearch();
  }
};

// Submit (add hoặc update)
const submitForm = async () => {
  if (!newAccount.value.UserName || !newAccount.value.Email) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }
  if (isEditMode.value) {
    await store.updateAccount(newAccount.value);
  } else {
    await store.addAccount(newAccount.value);
  }
  isModalOpen.value = false;
  await handleSearch();
};
</script>

<template>
  <div class="w-full h-full flex flex-col p-6 bg-gray-50 rounded-xl shadow-md text-sm">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4 shrink-0">
      <h2 class="text-lg font-semibold text-gray-800">Danh sách tài khoản</h2>
      <div class="flex items-center space-x-3">
        <!-- Search -->
        <div class="relative">
          <input
            v-model="searchText"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Tìm kiếm tài khoản..."
            class="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
          />
          <span
            class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
            >🔍</span
          >
        </div>
        <!-- Add button -->
        <button
          @click="handleAdd"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-200 shadow-sm"
        >
          Thêm tài khoản
        </button>
      </div>
    </div>

    <!-- Error -->
    <div
      v-if="errorMessage"
      class="p-3 text-xs text-red-700 bg-red-100 border border-red-300 rounded-lg shrink-0"
    >
      {{ errorMessage }}
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center flex-1">
      <div
        class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
      ></div>
    </div>

    <!-- Table -->
    <div
      v-else
      class="flex-1 overflow-auto bg-white rounded-xl shadow-md border border-gray-200"
    >
      <table
        class="w-full text-left text-sm text-gray-600 table-auto border border-gray-300"
      >
        <thead
          class="bg-gray-100 text-gray-700 uppercase text-xs font-medium sticky top-0"
        >
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
            <td class="px-4 py-2">{{ account.UserName }}</td>
            <td class="px-4 py-2">{{ account.FullName }}</td>
            <td class="px-4 py-2">{{ account.GroupName }}</td>
            <td class="px-4 py-2">{{ account.Email }}</td>
            <td class="px-4 py-2">{{ account.ParentEmail }}</td>
            <td class="px-4 py-2">{{ account.CreatedAt }}</td>
            <td class="px-4 py-2 text-center space-x-2">
              <button
                @click="handleEdit(account)"
                class="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-sm"
              >
                ✏️ Sửa
              </button>
              <button
                @click="handleDelete(account.UserName)"
                class="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full hover:bg-red-700 shadow-sm"
              >
                🗑️ Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div
      class="flex justify-center items-center space-x-3 mt-4 text-sm shrink-0"
    >
      <button
        @click="goPrevPage"
        class="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition duration-200 shadow-sm"
        :disabled="currentPage === 1"
      >
        ⬅️ Trước
      </button>
      <span
        class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium shadow-sm"
      >
        Trang {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        @click="goNextPage"
        class="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition duration-200 shadow-sm"
        :disabled="currentPage === totalPages"
      >
        Tiếp ➡️
      </button>
    </div>

    <!-- Modal thêm/sửa tài khoản -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
    >
      <div
        class="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative border border-gray-200"
      >
        <button
          @click="isModalOpen = false"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          ✖
        </button>
        <h3 class="text-lg font-bold mb-4 text-gray-800">
          {{ isEditMode ? "Sửa tài khoản" : "Thêm tài khoản" }}
        </h3>

        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Tên đăng nhập</label>
            <input
              v-model="newAccount.UserName"
              type="text"
              :disabled="isEditMode"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-100"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Tên đầy đủ</label>
            <input
              v-model="newAccount.FullName"
              type="text"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="newAccount.Email"
              type="email"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Email phụ huynh</label>
            <input
              v-model="newAccount.ParentEmail"
              type="email"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Mật khẩu</label>
            <input
              v-model="newAccount.Password"
              type="password"
              placeholder="(Để trống nếu không đổi)"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Vai trò</label>
            <select
              v-model="newAccount.GroupId"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="USER">USER</option>
            </select>
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Hủy
            </button>
            <button
              type="submit"
              class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow"
            >
              {{ isEditMode ? "Cập nhật" : "Lưu" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
