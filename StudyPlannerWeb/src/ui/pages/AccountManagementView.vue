<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useAccountManagementStore } from "../../application/stores/AccountManagementStore";
import { useGroupManagementStore } from "../../application/stores/GroupManagementStore"; // ✅ thêm
import type { AccountManagementRequestDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementRequestDTO";

const accountStore = useAccountManagementStore();
const groupStore = useGroupManagementStore(); // ✅ store group

// Reactive
const searchText = ref("");
const currentPage = ref(1);
const pageSize = ref(10);

// Modal state
const isModalOpen = ref(false);
const isEditMode = ref(false);

// Success message
const successMessage = ref("");
const showSuccess = (msg: string) => {
  successMessage.value = msg;
  setTimeout(() => (successMessage.value = ""), 3000);
};

const newAccount = ref<AccountManagementRequestDTO>({
  UserName: "",
  FullName: "",
  Email: "",
  ParentEmail: "",
  Password: "",
  GroupId: "USER",
});

// Computed
const accounts = computed(() => accountStore.accounts);
const totalPages = computed(() =>
  Math.ceil(accountStore.totalAccounts / pageSize.value)
);
const isLoading = computed(() => accountStore.isLoading);
const errorMessage = computed(() => accountStore.errorMessage);

const groups = computed(() => groupStore.groups); // ✅ lấy danh sách nhóm

// Lifecycle
onMounted(() => {
  accountStore.fetchAccounts(currentPage.value, pageSize.value);
  groupStore.fetchGroups(1, 1000); // ✅ load tất cả group (hoặc dùng API riêng)
});

// Search
const handleSearch = async () => {
  currentPage.value = 1;
  if (searchText.value.trim() === "") {
    await accountStore.fetchAccounts(currentPage.value, pageSize.value);
  } else {
    await accountStore.searchAccounts(
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

// Add
const handleAdd = () => {
  isEditMode.value = false;
  newAccount.value = {
    UserName: "",
    FullName: "",
    Email: "",
    ParentEmail: "",
    Password: "",
    GroupId: groups.value.length > 0 ? groups.value[0].GroupId : "USER", // ✅ default theo group có sẵn
  };
  isModalOpen.value = true;
};

// Edit
const handleEdit = (account: any) => {
  isEditMode.value = true;
  newAccount.value = {
    UserName: account.UserName,
    FullName: account.FullName,
    Email: account.Email,
    ParentEmail: account.ParentEmail,
    Password: "",
    GroupId: account.GroupId || (groups.value[0]?.GroupId ?? "USER"),
  };
  isModalOpen.value = true;
};

// Delete
const handleDelete = async (username: string) => {
  if (confirm(`Bạn có chắc muốn xóa tài khoản ${username}?`)) {
    await accountStore.deleteAccount(username);
    await handleSearch();
    showSuccess("Xóa tài khoản thành công!");
  }
};

// Submit
const submitForm = async () => {
  if (!newAccount.value.UserName || !newAccount.value.Email) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }
  if (isEditMode.value) {
    await accountStore.updateAccount(newAccount.value);
    showSuccess("Cập nhật tài khoản thành công!");
  } else {
    await accountStore.addAccount(newAccount.value);
    showSuccess("Thêm tài khoản thành công!");
  }
  isModalOpen.value = false;
  await handleSearch();
};
</script>

<template>
  <div class="w-full h-full flex flex-col p-4 sm:p-6 bg-gray-50 rounded-xl shadow-md text-sm">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-3">
      <h2 class="text-lg font-semibold text-gray-800">Danh sách tài khoản</h2>

      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <!-- Search -->
        <div class="relative w-full sm:w-64">
          <input v-model="searchText" @keyup.enter="handleSearch" type="text" placeholder="Tìm kiếm tài khoản..."
            class="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        </div>

        <!-- Add button -->
        <button @click="handleAdd"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-200 shadow-sm w-full sm:w-auto">
          Thêm tài khoản
        </button>
      </div>
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="p-3 text-xs text-red-700 bg-red-100 border border-red-300 rounded-lg shrink-0">
      {{ errorMessage }}
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center flex-1">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Table -->
    <div v-else class="flex-1 overflow-auto bg-white rounded-xl shadow-md border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[700px] text-left text-sm text-gray-600 table-auto border border-gray-300">
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
            <tr v-for="(account, index) in accounts" :key="index"
              class="border-b last:border-b-0 hover:bg-blue-50 transition duration-200">
              <td class="px-4 py-2">{{ account.UserName }}</td>
              <td class="px-4 py-2">{{ account.FullName }}</td>
              <td class="px-4 py-2">{{ account.GroupName }}</td>
              <td class="px-4 py-2">{{ account.Email }}</td>
              <td class="px-4 py-2">{{ account.ParentEmail }}</td>
              <td class="px-4 py-2">{{ account.CreatedAt }}</td>
              <td class="px-4 py-2 text-center space-x-1 sm:space-x-2">
                <button @click="handleEdit(account)"
                  class="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-sm">
                  ✏️ Sửa
                </button>
                <button @click="handleDelete(account.UserName)"
                  class="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full hover:bg-red-700 shadow-sm">
                  🗑️ Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex flex-col sm:flex-row justify-center items-center gap-2 sm:space-x-3 mt-4 text-sm shrink-0">
      <button @click="goPrevPage"
        class="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition duration-200 shadow-sm w-full sm:w-auto"
        :disabled="currentPage === 1">
        ⬅️ Trước
      </button>
      <span class="px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium shadow-sm text-center">
        Trang {{ currentPage }} / {{ totalPages }}
      </span>
      <button @click="goNextPage"
        class="px-3 py-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition duration-200 shadow-sm w-full sm:w-auto"
        :disabled="currentPage === totalPages">
        Tiếp ➡️
      </button>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-2xl shadow-xl w-[95%] sm:w-full sm:max-w-lg p-6 relative border border-gray-200">
        <button @click="isModalOpen = false" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">✖</button>
        <h3 class="text-lg font-bold mb-4 text-gray-800">
          {{ isEditMode ? "Sửa tài khoản" : "Thêm tài khoản" }}
        </h3>

        <form @submit.prevent="submitForm" class="space-y-4">
          <!-- UserName -->
          <div>
            <label class="block text-sm font-medium mb-1">Tên đăng nhập</label>
            <input v-model="newAccount.UserName" type="text" :disabled="isEditMode"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-100" />
          </div>

          <!-- FullName -->
          <div>
            <label class="block text-sm font-medium mb-1">Tên đầy đủ</label>
            <input v-model="newAccount.FullName" type="text"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500" />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input v-model="newAccount.Email" type="email"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500" />
          </div>

          <!-- Parent Email -->
          <div>
            <label class="block text-sm font-medium mb-1">Email phụ huynh</label>
            <input v-model="newAccount.ParentEmail" type="email"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500" />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium mb-1">Mật khẩu</label>
            <input v-model="newAccount.Password" type="password" placeholder="(Để trống nếu không đổi)"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500" />
          </div>

          <!-- ✅ Combobox Group -->
          <div>
            <label class="block text-sm font-medium mb-1">Vai trò</label>
            <select v-model="newAccount.GroupId"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500">
              <option v-for="g in groups" :key="g.GroupId" :value="g.GroupId">
                {{ g.GroupName }}
              </option>
            </select>
          </div>

          <!-- Buttons -->
          <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button type="button" @click="isModalOpen = false"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 w-full sm:w-auto">
              Hủy
            </button>
            <button type="submit"
              class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow w-full sm:w-auto">
              {{ isEditMode ? "Cập nhật" : "Lưu" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
