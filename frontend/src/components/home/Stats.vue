<template>
  <div class="stats">
    <div class="stat-icon">
      <i :class="icon" :style="style"></i>
    </div>
    <div class="stats-info">
      <span class="stat-title">{{ title }}</span>
      <span class="stat-qtde">{{ qtde }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "Stats",
  props: ["title", "qtde", "icon", "color"],
  computed: {
    style() {
      return `color: ${this.color || "#000"}`;
    },
  },
};
</script>

<style>
.stats {
  display: flex;
  align-items: center;
  justify-content: space-between;

  border: 1px solid #999;
  border-radius: 5px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);

  width: 320px;
  height: 100px;
  padding: 10px;
  margin-bottom: 20px;
}

.stats .stat-icon {
  font-size: 3.4rem;
}

.stats-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.stats-info .stat-title {
  color: #555;
  font-size: 0.8rem;
  font-weight: 700;
}

.stats-info .stat-qtde {
  font-size: 2rem;
  justify-items: flex-end;
}
</style>