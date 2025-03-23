<template>
  <div class="container">
    <h2>Design to Code (Vue + GPT-4 Vision)</h2>

    <input type="file" @change="onFileChange" />
    <select v-model="platform">
      <option>HTML and CSS</option>
      <option>HTML with Tailwind CSS</option>
      <option>React (JSX)</option>
      <option>Vue.js</option>
      <option>Flutter (Dart)</option>
    </select>
    <button @click="generateCode">Generate</button>

    <pre v-if="code"><code>{{ code }}</code></pre>
  </div>
</template>

<script setup>
import { ref } from "vue";

const file = ref(null);
const platform = ref("HTML and CSS");
const code = ref("");

const onFileChange = (e) => {
  file.value = e.target.files[0];
};

const generateCode = async () => {
  if (!file.value) return alert("Upload a design image.");

  const reader = new FileReader();
  reader.onloadend = async () => {
    const base64 = reader.result.split(",")[1];

    const res = await fetch("http://localhost:3001/generate-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: base64, platform: platform.value }),
    });

    const data = await res.json();
    code.value = data.code || "No code returned.";
  };

  reader.readAsDataURL(file.value);
};
</script>

<style scoped>
.container {
  padding: 2rem;
}
pre {
  background: #f5f5f5;
  padding: 1rem;
  margin-top: 1rem;
  overflow-x: auto;
}
</style>
