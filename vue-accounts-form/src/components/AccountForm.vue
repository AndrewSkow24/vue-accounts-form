<template>
  <div class="accounts-form">
    <!-- Заголовок и кнопка добавления -->
    <div class="header">
      <h1>Управление учетными записями</h1>
      <button @click="addAccount" class="add-button">
        + Добавить учетную запись
      </button>
    </div>

    <!-- Подсказка для поля метки -->
    <div class="label-hint">
      <span class="hint-icon">ℹ️</span>
      Для указания нескольких меток используйте разделитель <code>;</code>
    </div>

    <!-- Лейблы полей -->
    <div class="field-labels">
      <div class="field-label">Метка (до 50 символов)</div>
      <div class="field-label">Тип записи</div>
      <div class="field-label">Логин * (до 100 символов)</div>
      <div class="field-label">Пароль</div>
      <div class="field-label">Действия</div>
    </div>

    <!-- Список учетных записей -->
    <div class="accounts-list">
      <AccountItem
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        @update="handleUpdate"
        @remove="removeAccount"
      />
    </div>

    <!-- Статистика -->
    <div class="stats">
      Всего записей: {{ accounts.length }}
      <span v-if="ldapCount > 0" class="stat-item">LDAP: {{ ldapCount }}</span>
      <span v-if="localCount > 0" class="stat-item"
        >Локальные: {{ localCount }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import AccountItem from "./AccountItem.vue";
import { useAccountsStore } from "@/stores/accountsStore";

const accountsStore = useAccountsStore();
const {
  accounts,
  addAccount: storeAddAccount,
  removeAccount: storeRemoveAccount,
} = accountsStore;

const addAccount = () => {
  storeAddAccount();
};

const removeAccount = (id: string) => {
  storeRemoveAccount(id);
};

const handleUpdate = (id: string, updates: any) => {
  accountsStore.updateAccount(id, updates);
};

// Статистика
const ldapCount = computed(
  () => accounts.filter((acc) => acc.type === "ldap").length,
);

const localCount = computed(
  () => accounts.filter((acc) => acc.type === "local").length,
);
</script>

<style scoped>
.accounts-form {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu,
    sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header h1 {
  margin: 0;
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
}

.add-button {
  background: #4caf50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
}

.add-button:hover {
  background: #45a049;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.label-hint {
  background: #e3f2fd;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  color: #1976d2;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.hint-icon {
  font-size: 1rem;
}

.label-hint code {
  background: rgba(255, 255, 255, 0.5);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-family: monospace;
  font-weight: bold;
}

.field-labels {
  display: grid;
  grid-template-columns: 2fr 1.5fr 2fr 2fr 1fr;
  gap: 1rem;
  padding: 0.75rem 0.5rem;
  border-bottom: 2px solid #eee;
  margin-bottom: 1rem;
  font-weight: 600;
  color: #555;
  background: #f8f9fa;
  border-radius: 6px;
}

.field-label {
  padding: 0 0.5rem;
  font-size: 0.9rem;
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stats {
  margin-top: 2rem;
  padding: 1rem;
  background: linear-gradient(135deg, #f5f5f5, #e8e8e8);
  border-radius: 8px;
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-item {
  background: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  border: 1px solid #ddd;
  font-weight: 500;
}

.stat-item:first-of-type {
  margin-left: 0.5rem;
}

@media (max-width: 768px) {
  .accounts-form {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .field-labels {
    display: none;
  }

  .account-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .field-label {
    font-weight: 600;
    color: #555;
    margin-bottom: 0.25rem;
    font-size: 0.85rem;
  }

  .field-label::before {
    content: attr(data-label) ": ";
    font-weight: normal;
    color: #777;
  }
}
</style>
