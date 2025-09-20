<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useClassStore } from "../../application/stores/ClassStore";
import { useStudentClassStore } from "../../application/stores/StudentClassStore";
import { useTeacherClassStore } from "../../application/stores/TeacherClassStore";
import { useAccountManagementStore } from "../../application/stores/AccountManagementStore";
import type { ClassRequestDTO } from "../../domain/entities/ClassDTO/ClassRequestDTO";
import type { StudentClassRequestDTO } from "../../domain/entities/StudentClassDTO/StudentClassRequestDTO";
import type { TeacherClassRequestDTO } from "../../domain/entities/TeacherClassDTO/TeacherClassRequestDTO";
import type { AccountManagementResponseDTO } from "../../domain/entities/AccountManagementDTO/AccountManagementResponseDTO";

const classStore = useClassStore();
const studentClassStore = useStudentClassStore();
const teacherClassStore = useTeacherClassStore();
const accountStore = useAccountManagementStore();

// Reactive state
const searchText = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const selectedClassId = ref<string | null>(null);
const selectedTab = ref<"classes" | "studentClasses" | "teacherClasses">("classes");
const isClassModalOpen = ref(false);
const isEditMode = ref(false);
const successMessage = ref("");
const selectedSubTab = ref<"general" | "students" | "teachers">("general");

// New data models
const newClass = ref<ClassRequestDTO>({ ClassId: "", ClassName: "" });
const newStudentClass = ref<StudentClassRequestDTO>({ ClassId: "", StudentId: "", StudyStatus: 1 });
const newTeacherClass = ref<TeacherClassRequestDTO>({ ClassId: "", TeacherId: "", Subject: "" });

// Edit states for student/teacher
const isEditingStudent = ref(false);
const isEditingTeacher = ref(false);

// Accounts data
const studentAccounts = ref<AccountManagementResponseDTO[]>([]);
const teacherAccounts = ref<AccountManagementResponseDTO[]>([]);
const selectedStudentAccount = ref<AccountManagementResponseDTO | null>(null);
const selectedTeacherAccount = ref<AccountManagementResponseDTO | null>(null);

// Name getters
const getStudentName = (studentId: string) => {
  const acc = studentAccounts.value.find((a) => a.UserName === studentId);
  return acc?.FullName || studentId;
};
const getTeacherName = (teacherId: string) => {
  const acc = teacherAccounts.value.find((a) => a.UserName === teacherId);
  return acc?.FullName || teacherId;
};

// Watchers để đồng bộ ID khi chọn account
watch(selectedStudentAccount, (acc) => {
  newStudentClass.value.StudentId = acc?.UserName || "";
});
watch(selectedTeacherAccount, (acc) => {
  newTeacherClass.value.TeacherId = acc?.UserName || "";
});

// Study status mapping
const studyStatusOptions = [
  { value: 0, label: "Nghỉ học" },
  { value: 1, label: "Đang học" }
];

// Show success message
const showSuccess = (msg: string) => {
  successMessage.value = msg;
  setTimeout(() => (successMessage.value = ""), 3000);
};

// Computed properties
const classes = computed(() => classStore.classes);
const studentClasses = computed(() => studentClassStore.studentClasses);
const teacherClasses = computed(() => teacherClassStore.teacherClasses);
const isLoading = computed(
  () =>
    classStore.isLoading ||
    studentClassStore.isLoading ||
    teacherClassStore.isLoading ||
    accountStore.isLoading
);
const errorMessage = computed(
  () =>
    classStore.errorMessage ||
    studentClassStore.errorMessage ||
    teacherClassStore.errorMessage ||
    accountStore.errorMessage
);
const totalPages = computed(() => {
  if (selectedTab.value === "classes") {
    return Math.ceil(classStore.totalClasses / pageSize.value);
  } else if (selectedTab.value === "studentClasses") {
    return Math.ceil(studentClassStore.totalStudentClasses / pageSize.value);
  } else {
    return Math.ceil(teacherClassStore.totalTeacherClasses / pageSize.value);
  }
});

// Get study status display text
const getStudyStatusText = (status: number) =>
  studyStatusOptions.find((opt) => opt.value === status)?.label || status.toString();

// Lifecycle
onMounted(async () => {
  console.log('🚀 onMounted: Fetching accounts...');
  await accountStore.fetchAccounts(1, 1000);
  console.log('📊 All accounts loaded:', accountStore.accounts.length);
  
  // Filter với startsWith để match HS_2025, GV_... nếu có
  studentAccounts.value = accountStore.accounts.filter((acc) => acc.GroupId.startsWith("HS"));
  teacherAccounts.value = accountStore.accounts.filter((acc) => acc.GroupId.startsWith("GV"));
  
  console.log('👥 Students:', studentAccounts.value.length, 'Teachers:', teacherAccounts.value.length);
  console.log('📋 Teacher accounts details:', teacherAccounts.value); // Debug: Chi tiết teacher accounts
  
  await classStore.fetchClasses(currentPage.value, pageSize.value);
});

// Search
const handleSearch = async () => {
  if (selectedTab.value !== "classes" && !selectedClassId.value) {
    alert("Vui lòng chọn một lớp học trước khi tìm kiếm.");
    return;
  }
  currentPage.value = 1;
  if (selectedTab.value === "classes") {
    if (searchText.value.trim() === "") {
      await classStore.fetchClasses(currentPage.value, pageSize.value);
    } else {
      await classStore.searchClasses(searchText.value, currentPage.value, pageSize.value);
    }
  } else if (selectedTab.value === "studentClasses" && selectedClassId.value) {
    if (searchText.value.trim() === "") {
      await studentClassStore.fetchStudentClasses(selectedClassId.value, currentPage.value, pageSize.value);
    } else {
      await studentClassStore.searchStudentClasses(selectedClassId.value, searchText.value, currentPage.value, pageSize.value);
    }
  } else if (selectedTab.value === "teacherClasses" && selectedClassId.value) {
    if (searchText.value.trim() === "") {
      await teacherClassStore.fetchTeacherClasses(selectedClassId.value, currentPage.value, pageSize.value);
    } else {
      await teacherClassStore.searchTeacherClasses(selectedClassId.value, searchText.value, currentPage.value, pageSize.value);
    }
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

// Select class
const selectClass = (classId: string) => {
  selectedClassId.value = classId;
  if (selectedTab.value !== "classes") {
    handleSearch();
  }
};

// Open class modal for add/edit, and handle assignments
const openClassModal = async (classItem?: ClassRequestDTO) => {
  if (classItem) {
    isEditMode.value = true;
    newClass.value = { ...classItem };
    await studentClassStore.fetchStudentClasses(classItem.ClassId, 1, 100);
    await teacherClassStore.fetchTeacherClasses(classItem.ClassId, 1, 100);
  } else {
    isEditMode.value = false;
    newClass.value = { ClassId: "", ClassName: "" };
  }
  // Reset edit states for student/teacher
  isEditingStudent.value = false;
  isEditingTeacher.value = false;
  newStudentClass.value = { ClassId: classItem?.ClassId || "", StudentId: "", StudyStatus: 1 };
  newTeacherClass.value = { ClassId: classItem?.ClassId || "", TeacherId: "", Subject: "" };
  selectedStudentAccount.value = null;
  selectedTeacherAccount.value = null;
  selectedSubTab.value = "general";
  isClassModalOpen.value = true;
};

// Add/Edit Class
const handleAddClass = () => {
  openClassModal();
};
const handleEditClass = (classItem: ClassRequestDTO) => {
  openClassModal(classItem);
};

// Submit class form
const submitClassForm = async () => {
  if (!newClass.value.ClassId || !newClass.value.ClassName) {
    alert("Vui lòng nhập đầy đủ thông tin lớp học");
    return;
  }
  if (isEditMode.value) {
    await classStore.updateClass(newClass.value);
    showSuccess("Cập nhật lớp học thành công!");
  } else {
    await classStore.addClass(newClass.value);
    showSuccess("Thêm lớp học thành công!");
    selectedClassId.value = newClass.value.ClassId;
  }
  isClassModalOpen.value = false;
  await handleSearch();
};

// Handle student/teacher add buttons
const handleAddStudentClass = () => {
  if (!selectedClassId.value) {
    openClassModal();
  } else {
    const classItem = classes.value.find(c => c.ClassId === selectedClassId.value);
    if (classItem) {
      openClassModal(classItem);
    }
  }
  selectedSubTab.value = "students";
  isEditingStudent.value = false; // Mode add
};

const handleAddTeacherClass = () => {
  if (!selectedClassId.value) {
    openClassModal();
  } else {
    const classItem = classes.value.find(c => c.ClassId === selectedClassId.value);
    if (classItem) {
      openClassModal(classItem);
    }
  }
  selectedSubTab.value = "teachers";
  isEditingTeacher.value = false; // Mode add
};

// Student Class Operations in Modal
const startEditStudent = (studentClass: StudentClassRequestDTO) => {
  console.log('🔍 Start edit student:', studentClass); // Debug: Log data gốc
  newStudentClass.value = { ...studentClass };
  selectedStudentAccount.value = studentAccounts.value.find(acc => acc.UserName === studentClass.StudentId) || null;
  console.log('📝 Set StudyStatus for edit:', newStudentClass.value.StudyStatus); // Debug: Status ban đầu
  isEditingStudent.value = true;
};

const submitStudentForm = async () => {
  if (!newClass.value.ClassId || !newStudentClass.value.StudentId || newStudentClass.value.StudyStatus === undefined) {
    alert("Vui lòng chọn đầy đủ thông tin phân công sinh viên");
    return;
  }
  newStudentClass.value.ClassId = newClass.value.ClassId;
  console.log('📤 Submit student update/add:', newStudentClass.value); // Debug: Data gửi đi (kiểm tra StudyStatus)
  
  try {
    if (isEditingStudent.value) {
      await studentClassStore.updateStudentClass(newStudentClass.value);
      showSuccess("Cập nhật phân công sinh viên thành công!");
      console.log('✅ Update success, refetching...'); // Debug success
    } else {
      await studentClassStore.addStudentClass(newStudentClass.value);
      showSuccess("Thêm phân công sinh viên thành công!");
    }
    await studentClassStore.fetchStudentClasses(newClass.value.ClassId, 1, 100);
    console.log('🔄 Refetched studentClasses:', studentClassStore.studentClasses); // Debug: Data sau refetch
  } catch (error) {
    console.error('❌ Update error:', error); // Catch lỗi nếu có
    alert("Lỗi cập nhật: " + (error as Error).message);
  }
  
  // Reset form
  isEditingStudent.value = false;
  newStudentClass.value = { ClassId: newClass.value.ClassId, StudentId: "", StudyStatus: 1 };
  selectedStudentAccount.value = null;
};

const deleteStudentInModal = async (classId: string, studentId: string) => {
  if (confirm(`Bạn có chắc muốn xóa phân công cho ${getStudentName(studentId)} (${studentId})?`)) {
    await studentClassStore.deleteStudentClass(classId, studentId);
    await studentClassStore.fetchStudentClasses(newClass.value.ClassId, 1, 100);
  }
};

// Teacher Class Operations in Modal
const startEditTeacher = (teacherClass: TeacherClassRequestDTO) => {
  console.log('🔍 Start edit teacher:', teacherClass); // Debug: Log data gốc
  newTeacherClass.value = { ...teacherClass };
  selectedTeacherAccount.value = teacherAccounts.value.find(acc => acc.UserName === teacherClass.TeacherId) || null;
  console.log('📝 Set Subject for edit:', newTeacherClass.value.Subject); // Debug: Subject ban đầu
  console.log('👤 Selected teacher account:', selectedTeacherAccount.value); // Debug: Account match
  isEditingTeacher.value = true;
};

const submitTeacherForm = async () => {
  if (!newClass.value.ClassId || !newTeacherClass.value.TeacherId || !newTeacherClass.value.Subject) {
    alert("Vui lòng nhập đầy đủ thông tin phân công giáo viên");
    return;
  }
  newTeacherClass.value.ClassId = newClass.value.ClassId;
  console.log('📤 Submit teacher update/add:', newTeacherClass.value); // Debug: Data gửi đi
  
  try {
    if (isEditingTeacher.value) {
      await teacherClassStore.updateTeacherClass(newTeacherClass.value);
      showSuccess("Cập nhật phân công giáo viên thành công!");
      console.log('✅ Teacher update success, refetching...');
    } else {
      await teacherClassStore.addTeacherClass(newTeacherClass.value);
      showSuccess("Thêm phân công giáo viên thành công!");
    }
    await teacherClassStore.fetchTeacherClasses(newClass.value.ClassId, 1, 100);
    console.log('🔄 Refetched teacherClasses:', teacherClassStore.teacherClasses); // Debug: Data sau refetch
  } catch (error) {
    console.error('❌ Teacher update error:', error); // Catch lỗi nếu có
    alert("Lỗi cập nhật: " + (error as Error).message);
  }
  
  // Reset form
  isEditingTeacher.value = false;
  newTeacherClass.value = { ClassId: newClass.value.ClassId, TeacherId: "", Subject: "" };
  selectedTeacherAccount.value = null;
};

const deleteTeacherInModal = async (classId: string, teacherId: string) => {
  if (confirm(`Bạn có chắc muốn xóa phân công cho ${getTeacherName(teacherId)} (${teacherId})?`)) {
    await teacherClassStore.deleteTeacherClass(classId, teacherId);
    await teacherClassStore.fetchTeacherClasses(newClass.value.ClassId, 1, 100);
  }
};

// Delete class
const handleDeleteClass = async (classId: string) => {
  if (confirm(`Bạn có chắc muốn xóa lớp ${classId}?`)) {
    await classStore.deleteClass(classId);
    if (selectedClassId.value === classId) {
      selectedClassId.value = null;
    }
    await handleSearch();
  }
};
</script>

<template>
  <div class="w-full h-full flex flex-col p-4 sm:p-6 bg-gray-50 rounded-xl shadow-md text-sm">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between mb-4 gap-3">
      <h2 class="text-lg font-semibold text-gray-800">Quản lý lớp học</h2>
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <!-- Search -->
        <div class="relative w-full sm:w-64">
          <input v-model="searchText" @keyup.enter="handleSearch" type="text" placeholder="Tìm kiếm..."
            class="pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        </div>
        <!-- Add button -->
        <button v-if="selectedTab === 'classes'" @click="handleAddClass"
          class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 transition duration-200 shadow-sm w-full sm:w-auto">
          Thêm lớp
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center items-center flex-1">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>

    <!-- Table -->
    <div v-else class="flex-1 overflow-auto bg-white rounded-xl shadow-md border border-gray-200">
      <div v-if="selectedTab === 'classes'" class="overflow-x-auto">
        <table class="w-full min-w-[600px] text-left text-sm text-gray-600 table-auto border border-gray-300">
          <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-medium sticky top-0">
            <tr>
              <th class="px-4 py-2 border-b">Mã lớp</th>
              <th class="px-4 py-2 border-b">Tên lớp</th>
              <th class="px-4 py-2 border-b text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="classItem in classes" :key="classItem.ClassId"
              class="border-b last:border-b-0 hover:bg-blue-50 transition duration-200 cursor-pointer"
              :class="{ 'bg-blue-100': classItem.ClassId === selectedClassId }" @click="selectClass(classItem.ClassId)">
              <td class="px-4 py-2">{{ classItem.ClassId }}</td>
              <td class="px-4 py-2">{{ classItem.ClassName }}</td>
              <td class="px-4 py-2 text-center space-x-1 sm:space-x-2">
                <button @click.stop="handleEditClass(classItem)"
                  class="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-sm">
                  ✏️ Sửa
                </button>
                <button @click.stop="handleDeleteClass(classItem.ClassId)"
                  class="px-2 py-1 text-xs font-medium text-white bg-red-600 rounded-full hover:bg-red-700 shadow-sm">
                  🗑️ Xóa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Student Classes Table -->
      <div v-else-if="selectedTab === 'studentClasses'">
        <div v-if="!selectedClassId" class="p-4 text-center text-gray-500 text-sm">
          Vui lòng chọn một lớp học từ tab "Lớp học" để xem phân công sinh viên.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[600px] text-left text-sm text-gray-600 table-auto border border-gray-300">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-medium sticky top-0">
              <tr>
                <th class="px-4 py-2 border-b">Mã lớp</th>
                <th class="px-4 py-2 border-b">Mã sinh viên</th>
                <th class="px-4 py-2 border-b">Tên sinh viên</th>
                <th class="px-4 py-2 border-b">Trạng thái học</th>
                <th class="px-4 py-2 border-b text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="studentClass in studentClasses" :key="`${studentClass.ClassId}-${studentClass.StudentId}`"
                class="border-b last:border-b-0 hover:bg-blue-50 transition duration-200">
                <td class="px-4 py-2">{{ studentClass.ClassId }}</td>
                <td class="px-4 py-2">{{ studentClass.StudentId }}</td>
                <td class="px-4 py-2">{{ getStudentName(studentClass.StudentId) }}</td>
                <td class="px-4 py-2">{{ getStudyStatusText(studentClass.StudyStatus) }}</td>
                <td class="px-4 py-2 text-center space-x-1 sm:space-x-2">
                  <button @click="handleAddStudentClass"
                    class="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-sm">
                    Quản lý
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Teacher Classes Table -->
      <div v-else-if="selectedTab === 'teacherClasses'">
        <div v-if="!selectedClassId" class="p-4 text-center text-gray-500 text-sm">
          Vui lòng chọn một lớp học từ tab "Lớp học" để xem phân công giáo viên.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[600px] text-left text-sm text-gray-600 table-auto border border-gray-300">
            <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-medium sticky top-0">
              <tr>
                <th class="px-4 py-2 border-b">Mã lớp</th>
                <th class="px-4 py-2 border-b">Mã giáo viên</th>
                <th class="px-4 py-2 border-b">Tên giáo viên</th>
                <th class="px-4 py-2 border-b">Môn học</th>
                <th class="px-4 py-2 border-b text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="teacherClass in teacherClasses" :key="`${teacherClass.ClassId}-${teacherClass.TeacherId}`"
                class="border-b last:border-b-0 hover:bg-blue-50 transition duration-200">
                <td class="px-4 py-2">{{ teacherClass.ClassId }}</td>
                <td class="px-4 py-2">{{ teacherClass.TeacherId }}</td>
                <td class="px-4 py-2">{{ getTeacherName(teacherClass.TeacherId) }}</td>
                <td class="px-4 py-2">{{ teacherClass.Subject }}</td>
                <td class="px-4 py-2 text-center space-x-1 sm:space-x-2">
                  <button @click="handleAddTeacherClass"
                    class="px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 shadow-sm">
                    Quản lý
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-if="errorMessage" class="p-3 text-xs text-red-700 bg-red-100 border border-red-300 rounded-lg shrink-0">
      {{ errorMessage }}
    </div>

    <!-- Success -->
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

    <!-- Modal -->
    <div v-if="isClassModalOpen" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div
        class="bg-white rounded-2xl shadow-xl w-[95%] sm:w-full sm:max-w-4xl h-[90vh] p-6 relative border border-gray-200 overflow-y-auto">
        <button @click="isClassModalOpen = false"
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600">✖</button>
        <h3 class="text-lg font-bold mb-4 text-gray-800">
          {{ isEditMode ? "Sửa lớp" : "Thêm lớp" }}
        </h3>

        <!-- Sub-tabs -->
        <div class="flex space-x-2 mb-4">
          <button @click="selectedSubTab = 'general'" :class="[
            'px-4 py-2 rounded-full text-sm font-medium',
            selectedSubTab === 'general' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          ]">
            Thông tin chung
          </button>
          <button @click="selectedSubTab = 'students'" :class="[
            'px-4 py-2 rounded-full text-sm font-medium',
            selectedSubTab === 'students' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          ]">
            Phân công sinh viên
          </button>
          <button @click="selectedSubTab = 'teachers'" :class="[
            'px-4 py-2 rounded-full text-sm font-medium',
            selectedSubTab === 'teachers' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          ]">
            Phân công giáo viên
          </button>
        </div>

        <!-- General Tab -->
        <div v-if="selectedSubTab === 'general'">
          <form @submit.prevent="submitClassForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Mã lớp</label>
              <input v-model="newClass.ClassId" type="text" :disabled="isEditMode"
                class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-100" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Tên lớp</label>
              <input v-model="newClass.ClassName" type="text"
                class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500" />
            </div>
            <div class="flex flex-col sm:flex-row justify-end gap-3 pt-4">
              <button type="button" @click="isClassModalOpen = false"
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

        <!-- Students Tab -->
        <div v-if="selectedSubTab === 'students'" class="space-y-4">
          <!-- Form to add/edit student -->
          <div class="border rounded-lg p-3 bg-gray-50">
            <h5 class="font-medium mb-2">{{ isEditingStudent ? 'Sửa' : 'Thêm' }} phân công sinh viên</h5>
            <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
              <!-- Student dropdown -->
              <div>
                <label class="block text-xs font-medium mb-1">Chọn sinh viên</label>
                <select v-model="selectedStudentAccount" :disabled="isEditingStudent"
                  class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500">
                  <option :value="null">-- Chọn sinh viên --</option>
                  <option v-for="account in studentAccounts" :key="account.UserName" :value="account">
                    {{ account.UserName }} - {{ account.FullName }}
                  </option>
                </select>
              </div>
              <!-- Study status -->
              <div>
                <label class="block text-xs font-medium mb-1">Trạng thái học</label>
                <select v-model="newStudentClass.StudyStatus"
                  class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500">
                  <option v-for="option in studyStatusOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div class="flex items-end">
                <button @click="submitStudentForm" type="button" :disabled="!selectedStudentAccount"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {{ isEditingStudent ? 'Cập nhật' : 'Thêm' }}
                </button>
              </div>
            </div>
            <!-- Display selected info -->
            <div v-if="selectedStudentAccount" class="mt-2 text-xs text-gray-600">
              Đã chọn: {{ selectedStudentAccount.FullName }} ({{ selectedStudentAccount.UserName }})
            </div>
          </div>

          <!-- Students table -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-600">
              <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-medium">
                <tr>
                  <th class="px-4 py-2">Mã sinh viên</th>
                  <th class="px-4 py-2">Tên sinh viên</th>
                  <th class="px-4 py-2">Trạng thái học</th>
                  <th class="px-4 py-2 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="studentClass in studentClasses" :key="`${studentClass.ClassId}-${studentClass.StudentId}`"
                  class="border-b hover:bg-blue-50">
                  <td class="px-4 py-2">{{ studentClass.StudentId }}</td>
                  <td class="px-4 py-2">
                    {{ getStudentName(studentClass.StudentId) }}
                  </td>
                  <td class="px-4 py-2">{{ getStudyStatusText(studentClass.StudyStatus) }}</td>
                  <td class="px-4 py-2 text-center space-x-1">
                    <button @click="startEditStudent(studentClass)"
                      class="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700">Sửa</button>
                    <button @click="deleteStudentInModal(newClass.ClassId, studentClass.StudentId)"
                      class="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700">Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-end pt-4">
            <button @click="isClassModalOpen = false"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">
              Đóng
            </button>
          </div>
        </div>

        <!-- Teachers Tab -->
        <div v-if="selectedSubTab === 'teachers'" class="space-y-4">
          <!-- Form to add/edit teacher -->
          <div class="border rounded-lg p-3 bg-gray-50">
            <h5 class="font-medium mb-2">{{ isEditingTeacher ? 'Sửa' : 'Thêm' }} phân công giáo viên</h5>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <!-- Teacher dropdown -->
              <div>
                <label class="block text-xs font-medium mb-1">Chọn giáo viên</label>
                <select v-model="selectedTeacherAccount" :disabled="isEditingTeacher"
                  class="w-full border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500">
                  <option :value="null">-- Chọn giáo viên --</option>
                  <option v-for="account in teacherAccounts" :key="account.UserName" :value="account">
                    {{ account.UserName }} - {{ account.FullName }}
                  </option>
                </select>
              </div>
              <!-- Subject -->
              <input v-model="newTeacherClass.Subject" type="text" placeholder="Môn học"
                class="border rounded-lg px-3 py-2 text-sm focus:ring focus:ring-indigo-200 focus:border-indigo-500" />
              <div class="flex items-end">
                <button @click="submitTeacherForm" type="button" :disabled="!selectedTeacherAccount"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                  {{ isEditingTeacher ? 'Cập nhật' : 'Thêm' }}
                </button>
              </div>
            </div>
            <!-- Display selected info -->
            <div v-if="selectedTeacherAccount" class="mt-2 text-xs text-gray-600">
              Đã chọn: {{ selectedTeacherAccount.FullName }} ({{ selectedTeacherAccount.UserName }})
            </div>
            <div v-else-if="isEditingTeacher" class="mt-2 text-xs text-gray-600 italic">
              (Tên giáo viên không tìm thấy trong danh sách tài khoản - kiểm tra GroupId "GV*")
            </div>
          </div>

          <!-- Teachers table -->
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-gray-600">
              <thead class="bg-gray-100 text-gray-700 uppercase text-xs font-medium">
                <tr>
                  <th class="px-4 py-2">Mã giáo viên</th>
                  <th class="px-4 py-2">Tên giáo viên</th>
                  <th class="px-4 py-2">Môn học</th>
                  <th class="px-4 py-2 text-center">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="teacherClass in teacherClasses" :key="`${teacherClass.ClassId}-${teacherClass.TeacherId}`"
                  class="border-b hover:bg-blue-50">
                  <td class="px-4 py-2">{{ teacherClass.TeacherId }}</td>
                  <td class="px-4 py-2">
                    {{ getTeacherName(teacherClass.TeacherId) }}
                  </td>
                  <td class="px-4 py-2">{{ teacherClass.Subject }}</td>
                  <td class="px-4 py-2 text-center space-x-1">
                    <button @click="startEditTeacher(teacherClass)"
                      class="px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700">Sửa</button>
                    <button @click="deleteTeacherInModal(newClass.ClassId, teacherClass.TeacherId)"
                      class="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700">Xóa</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="flex justify-end pt-4">
            <button @click="isClassModalOpen = false"
              class="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100">
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>