<template>
  <!-- 卡片 -->
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="myrow">
      <el-button>添加角色</el-button>
    </el-row>
  </el-card>
</template>

<script>
export default {};
</script>

<style>
.myrow {
  margin-top: 10px;
}
</style>
