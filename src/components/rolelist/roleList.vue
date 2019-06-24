<template>
  <!-- 卡片 -->
  <el-card>
    <!-- 面包屑导航 -->
    <Mybread one="用户管理" two="角色列表"></Mybread>
    <el-row class="myrow">
      <el-button>添加角色</el-button>
    </el-row>
  </el-card>
</template>

<script>
// 导入面包屑组件
import Mybread from "../layout/mybread.vue";

export default {
  // 注册为组件
  components: {
    Mybread: Mybread
  }
};
</script>

<style>
.myrow {
  margin-top: 10px;
}
</style>
