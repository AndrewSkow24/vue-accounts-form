<template>
  <div class="account-item" :class="{ 'has-error': hasErrors }">
    <!-- Поле метки -->
    <div class="field">
      <input
        v-model="localLabel"
        :maxlength="50"
        placeholder="Метки через ;"
        @blur="updateLabel"
        class="input-field"
      />
      <div v-if="account.labels?.length > 0" class="labels-preview">
        <span
          v-for="(label, index) in account.labels"
          :key="index"
          class="label-chip"
        >
          {{ label.text }}
        </span>
      </div>
    </div>

    <!-- Тип записи -->
    <div class="field">
      <select v-model="localType" @change="updateType" class="select-field">
        <option value="ldap">LDAP</option>
        <option value="local">Локальная</option>
      </select>
    </div>

    <!-- Логин -->
    <div class="field">
      <input
        v-model="localLogin"
        :maxlength="100"
        placeholder="Логин *"
        @blur="validateAndUpdate"
        class="input-field"
        :class="{ error: account.errors?.login }"
      />
      <small v-if="account.errors?.login" class="error-message">
        {{ account.errors.login }}
      </small>
    </div>

    <!-- Пароль -->
    <div class="field">
      <div v-if="account.type === 'local'">
        <input
          v-model="localPassword"
          type="password"
          :maxlength="100"
          placeholder="Пароль *"
          @blur="validateAndUpdate"
          class="input-field"
          :class="{ error: account.errors?.password }"
        />
        <small v-if="account.errors?.password" class="error-message">
          {{ account.errors.password }}
        </small>
      </div>
      <div v-else class="password-placeholder">
        <span class="disabled-text">Не требуется</span>
      </div>
    </div>

    <!-- Кнопка удаления -->
    <div class="field actions">
      <button
        @click="$emit('remove', account.id)"
        class="delete-button"
        title="Удалить"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Account } from "@/stores/accountsStore";

interface Props {
  account: Account;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  update: [id: string, updates: Partial<Account>];
  remove: [id: string];
}>();

// Локальные реактивные переменные
const localLabel = ref(props.account.label);
const localType = ref(props.account.type);
const localLogin = ref(props.account.login);
const localPassword = ref(props.account.password || "");

const hasErrors = computed(
  () => props.account.errors && Object.keys(props.account.errors).length > 0,
);

// Обновление меток
const updateLabel = () => {
  emit("update", props.account.id, {
    label: localLabel.value,
  });
};

// Обновление типа
const updateType = () => {
  const updates: Partial<Account> = {
    type: localType.value,
  };

  // Если меняем на LDAP, очищаем пароль
  if (localType.value === "ldap") {
    updates.password = null;
    localPassword.value = "";
  }

  emit("update", props.account.id, updates);
};

// Валидация и обновление
const validateAndUpdate = () => {
  const updates: Partial<Account> = {
    login: localLogin.value,
    password: localType.value === "local" ? localPassword.value : null,
  };

  emit("update", props.account.id, updates);
};

// Следим за изменениями извне
watch(
  () => props.account,
  (newAccount) => {
    localLabel.value = newAccount.label;
    localType.value = newAccount.type;
    localLogin.value = newAccount.login;
    localPassword.value = newAccount.password || "";
  },
  { deep: true },
);
</script>

<style scoped>
.account-item {
  display: grid;
  grid-template-columns: 2fr 1.5fr 2fr 2fr 1fr;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  transition: all 0.2s;
  align-items: start;
  margin-bottom: 1rem;
}

.account-item:hover {
  border-color: #2196f3;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.1);
}

.account-item.has-error {
  border-color: #f44336;
  background: #fff5f5;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-height: 70px;
}

.input-field,
.select-field {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.2s;
}

.input-field:focus,
.select-field:focus {
  outline: none;
  border-color: #2196f3;
  box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.1);
}

.input-field.error {
  border-color: #f44336;
  background: #fff5f5;
}

.labels-preview {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.label-chip {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 12px;
  white-space: nowrap;
}

.password-placeholder {
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 6px;
  text-align: center;
}

.disabled-text {
  color: #999;
  font-size: 14px;
}

.error-message {
  color: #f44336;
  font-size: 12px;
}

.delete-button {
  background: #f44336;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.delete-button:hover {
  background: #d32f2f;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
