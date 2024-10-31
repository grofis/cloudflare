
<template>
  <div class="container">
    <h1>{{ title }}</h1>
    <div class="input-section">
      <input 
        v-model="inputText" 
        placeholder="请输入文字..."
        @keyup.enter="addText"
      >
      <button @click="addText">添加文字</button>
    </div>
    <div class="text-list">
      <div v-for="(text, index) in texts" :key="index" class="text-item">
        {{ text }}
        <button class="delete-btn" @click="deleteText(index)">删除</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'App',
  setup() {
    const title = ref('文字记录器')
    const inputText = ref('')
    const texts = ref([])

    const addText = () => {
      if (inputText.value.trim()) {
        texts.value.push(inputText.value)
        inputText.value = ''
      }
    }

    const deleteText = (index) => {
      texts.value.splice(index, 1)
    }

    return {
      title,
      inputText,
      texts,
      addText,
      deleteText
    }
  }
}
</script>

<style>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  color: #2c3e50;
  text-align: center;
}

.input-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input {
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #3aa876;
}

.text-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.text-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.delete-btn {
  background-color: #dc3545;
  padding: 4px 8px;
  font-size: 0.8em;
}

.delete-btn:hover {
  background-color: #c82333;
}
</style>




