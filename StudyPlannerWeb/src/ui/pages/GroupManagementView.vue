<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useGroupManagementStore } from "../../application/stores/GroupManagementStore";
import type { GroupManagementRequestDTO } from "../../domain/entities/GroupManagementDTO/GroupManagementRequestDTO";

const store = useGroupManagementStore();

// Reactive state
const searchText = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const selectedGroupId = ref<string | null>(null);

const isModalOpen = ref(false);
const isEditMode = ref(false);
const isPermissionModalOpen = ref(false);
// ✅ success message
const successMessage = ref("");

// Hàm show message xanh
const showSuccess = (msg: string) => {
  successMessage.value = msg;
  setTimeout(() => {
    successMessage.value = "";
  }, 3000); // auto clear sau 3s
};

const newGroup = ref<GroupManagementRequestDTO>({
  GroupId: "",
  GroupName: "",
  GroupDescription: "",
  GroupFunctions: [],
});

// Computed
const groups = computed(() => store.groups);
const totalPages = computed(() => Math.ceil(store.totalGroups / pageSize.value));
const groupFunctions = computed(() => store.groupFunctions);
const isLoading = computed(() => store.isLoading);
const errorMessage = computed(() => store.errorMessage);

// Lifecycle
onMounted(() => {
  store.fetchGroups(currentPage.value, pageSize.value);
});

// Search
const handleSearch = async () => {
  currentPage.value = 1;
  if (searchText.value.trim() === "") {
    await store.fetchGroups(currentPage.value, pageSize.value);
  } else {
    await store.searchGroups(searchText.value, currentPage.value, pageSize.value);
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

// Add group
const handleAdd = () => {
  isEditMode.value = false;
  newGroup.value = {
    GroupId: "",
    GroupName: "",
    GroupDescription: "",
    GroupFunctions: [],
  };
  isModalOpen.value = true;
};

// Edit group
const handleEdit = (group: GroupManagementRequestDTO) => {
  isEditMode.value = true;
  newGroup.value = { ...group, GroupFunctions: [] };
  isModalOpen.value = true;
};

// Delete group
const handleDelete = async (groupId: string) => {
  if (confirm(`Bạn có chắc muốn xóa nhóm ${groupId}?`)) {
    await store.deleteGroup(groupId);
    await handleSearch();
  }
};

// Submit (add or update)
const submitForm = async () => {
  if (!newGroup.value.GroupId || !newGroup.value.GroupName) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }
  if (isEditMode.value) {
    await store.updateGroup(newGroup.value);
    showSuccess("Cập nhật nhóm thành công!");
  } else {
    await store.addGroup(newGroup.value);
    showSuccess("Thêm nhóm thành công!");
  }
  isModalOpen.value = false;
  await handleSearch();
};

// Permission modal
const handleSelectGroup = async (groupId: string) => {
  selectedGroupId.value = groupId;
  await store.fetchGroupFunctions(groupId);
  isPermissionModalOpen.value = true;
};

// Save functions
const handleSaveFunctions = async () => {
  if (!selectedGroupId.value) return;
  const updatedGroup: GroupManagementRequestDTO = {
    GroupId: selectedGroupId.value,
    GroupName: groups.value.find((g) => g.GroupId === selectedGroupId.value)?.GroupName || "",
    GroupDescription: groups.value.find((g) => g.GroupId === selectedGroupId.value)?.GroupDescription || "",
    GroupFunctions: store.groupFunctions.map((f) => ({
      FunctionId: f.FunctionId,
      FunctionName: f.FunctionName,
      IsEnable: f.IsEnable,
      IsReadOnly: f.IsReadOnly,
      GroupId: selectedGroupId.value!,
    })),
  };
  await store.updateGroup(updatedGroup);
  isPermissionModalOpen.value = false;
  showSuccess("Lưu phân quyền thành công!");
};
</script>

<template>
  <div class="w-full h-full flex flex-col p-4 sm:p-6 bg-gray-50 rounded-xl shadow-md text-sm">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-3">
      <h2 class="text-lg font-semibold text-gray-800">Quản lý nhóm người dùng</h2>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <!-- Search -->
        <div class="relative w-full sm:w-64">
          <input v-model="searchText" @keyup.enter="handleSearch" type="text" placeholder="Tìm kiếm nhóm..."
            class="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        </div>
        <!-- Add button -->
        <button @click="handleAdd"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-200 shadow-sm w-full sm:w-auto">
          Thêm nhóm
        </button>
      </div>
    </div>




    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center flex-1">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Table -->
    <div v-else class="flex-1 overflow-auto bg-white rounded-xl shadow-md border border-gray-200">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[600px] text-left text-sm text-gray-600 table-auto border border-gray-300">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-medium sticky top-0">
            <tr>
              <th class="px-4 py-2 border-b">Mã nhóm</th>
              <th class="px-4 py-2 border-b">Tên nhóm</th>
              <th class="px-4 py-2 border-b">Mô tả</th>
              <th class="px-4 py-2 border-b text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="group in groups" :key="group.GroupId"
              class="border-b last:border-b-0 hover:bg-blue-50 transition duration-200">
              <td class="px-4 py-2">{{ group.GroupId }}</td>
              <td class="px-4 py-2">{{ group.GroupName }}</td>
              <td class="px-4 py-2">{{ group.GroupDescription }}</td>
              <td class="px-4 py-2 text-center space-x-1 sm:space-x-2">
                <button @click="handleSelectGroup(group.GroupId)"
                  class="px-2 py-1 text-xs font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 shadow-sm">
                  ⚙️ Phân quyền
                </button>
                <button @click="handleEdit({ ...group, GroupFunctions: [] })"
                  class="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-sm">
                  ✏️ Sửa
                </button>
                <button @click="handleDelete(group.GroupId)"
                  class="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full hover:bg-red-700 shadow-sm">
                  🗑️ Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="p-3 text-xs text-red-700 bg-red-100 border border-red-300 rounded-lg shrink-0">
      {{ errorMessage }}
    </div>

    <!-- ✅ Success -->
    <div v-if="successMessage"
      class="p-3 text-xs text-green-700 bg-green-100 border border-green-300 rounded-lg shrink-0">
      {{ successMessage }}
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

    <!-- Modal thêm/sửa nhóm -->
    <div v-if="isModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-2xl shadow-xl w-[95%] sm:w-full sm:max-w-lg p-6 relative border border-gray-200">
        <button @click="isModalOpen = false" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">✖</button>
        <h3 class="text-lg font-bold mb-4 text-gray-800">
          {{ isEditMode ? "Sửa nhóm" : "Thêm nhóm" }}
        </h3>
        <form @submit.prevent="submitForm" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Mã nhóm</label>
            <input v-model="newGroup.GroupId" type="text" :disabled="isEditMode"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-100" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Tên nhóm</label>
            <input v-model="newGroup.GroupName" type="text"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Mô tả</label>
            <textarea v-model="newGroup.GroupDescription"
              class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500"
              rows="4"></textarea>
          </div>
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

    <!-- Modal phân quyền -->
    <div v-if="isPermissionModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div class="bg-white rounded-2xl shadow-xl w-[95%] sm:w-full sm:max-w-2xl p-6 relative border border-gray-200">
        <button @click="isPermissionModalOpen = false"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">✖</button>
        <h3 class="text-lg font-bold mb-4 text-gray-800">Phân quyền chức năng</h3>
        <div class="max-h-96 overflow-y-auto border rounded-lg p-3">
          <table class="w-full text-sm text-gray-600">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-medium sticky top-0">
              <tr>
                <th class="px-4 py-2 border-b">Mã chức năng</th>
                <th class="px-4 py-2 border-b">Tên chức năng</th>
                <th class="px-4 py-2 border-b">Bật/Tắt</th>
                <th class="px-4 py-2 border-b">Chỉ đọc</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="func in groupFunctions" :key="func.FunctionId"
                class="border-b last:border-b-0 hover:bg-blue-50 sticky transition duration-200">
                <td class="px-4 py-2">{{ func.FunctionId }}</td>
                <td class="px-4 py-2">{{ func.FunctionName }}</td>
                <td class="px-4 py-2 text-center">
                  <input type="checkbox" v-model="func.IsEnable" :disabled="func.IsReadOnly"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </td>
                <td class="px-4 py-2 text-center">
                  <input type="checkbox" v-model="func.IsReadOnly"
                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button type="button" @click="isPermissionModalOpen = false"
            class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">
            Hủy
          </button>
          <button type="button" @click="handleSaveFunctions"
            class="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow">
            Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
