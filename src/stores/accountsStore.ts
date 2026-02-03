import { defineStore } from "pinia";
import { ref, watch } from "vue";

export interface Label {
  text: string;
}

export interface Account {
  id: string;
  label: string; // Строка с метками через ";"
  labels: Label[]; // Преобразованный массив меток
  type: "ldap" | "local";
  login: string;
  password: string | null;
  errors?: {
    login?: string;
    password?: string;
  };
}

export const useAccountsStore = defineStore("accounts", () => {
  const accounts = ref<Account[]>([]);

  // Загрузка из localStorage
  const loadFromStorage = () => {
    const saved = localStorage.getItem("accounts");
    if (saved) {
      accounts.value = JSON.parse(saved);
    }
  };

  // Сохранение в localStorage
  const saveToStorage = () => {
    localStorage.setItem("accounts", JSON.stringify(accounts.value));
  };

  // Преобразование строки меток в массив объектов
  const parseLabels = (labelStr: string): Label[] => {
    if (!labelStr.trim()) return [];
    return labelStr
      .split(";")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((text) => ({ text }));
  };

  // Добавление новой учетной записи
  const addAccount = () => {
    const newAccount: Account = {
      id: Date.now().toString(),
      label: "",
      labels: [],
      type: "local",
      login: "",
      password: "",
      errors: {},
    };
    accounts.value.push(newAccount);
  };

  // Обновление учетной записи
  const updateAccount = (id: string, updates: Partial<Account>) => {
    const index = accounts.value.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      // Преобразуем метки при обновлении
      if (updates.label !== undefined) {
        updates.labels = parseLabels(updates.label);
      }

      accounts.value[index] = {
        ...accounts.value[index],
        ...updates,
      };
      saveToStorage();
    }
  };

  // Удаление учетной записи
  const removeAccount = (id: string) => {
    const index = accounts.value.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      accounts.value.splice(index, 1);
      saveToStorage();
    }
  };

  // Валидация учетной записи
  const validateAccount = (account: Account): boolean => {
    const errors: { login?: string; password?: string } = {};

    if (!account.login.trim()) {
      errors.login = "Логин обязателен";
    } else if (account.login.length > 100) {
      errors.login = "Максимум 100 символов";
    }

    if (account.type === "local") {
      if (!account.password) {
        errors.password = "Пароль обязателен для локальной записи";
      } else if (account.password.length > 100) {
        errors.password = "Максимум 100 символов";
      }
    }

    account.errors = errors;
    return Object.keys(errors).length === 0;
  };

  // Автосохранение при изменении
  watch(accounts, saveToStorage, { deep: true });

  // Инициализация
  loadFromStorage();

  return {
    accounts,
    addAccount,
    updateAccount,
    removeAccount,
    validateAccount,
  };
});
