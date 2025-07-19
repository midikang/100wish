<template>
  <div class="login-view">
    <form @submit.prevent="onLogin" class="login-form">
      <h2>登录</h2>
      <input v-model="username" placeholder="用户名" required />
      <input v-model="password" type="password" placeholder="密码" required />
      <button type="submit">登录</button>
      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const username = ref('')
const password = ref('')
const error = ref('')
const router = useRouter()

const onLogin = async () => {
  error.value = ''
  try {
    const res = await axios.post('/api/login', {
      username: username.value,
      password: password.value
    })
    localStorage.setItem('token', res.data.token)
    router.push('/')
  } catch (e: any) {
    error.value = e?.response?.data?.message || '登录失败，请检查用户名和密码'
  }
}
</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}
.login-form {
  background: #fff;
  padding: 2rem 2.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  min-width: 320px;
}
.login-form h2 {
  margin-bottom: 1rem;
  text-align: center;
}
.login-form input {
  padding: 0.7rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}
.login-form button {
  background: var(--color-primary, #007bff);
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.7rem 1rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.login-form button:hover {
  background: #0056b3;
}
.error {
  color: #d32f2f;
  text-align: center;
  font-size: 0.98rem;
}
</style>
