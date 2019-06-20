<template>
  <!-- 页面容器 -->
  <el-container>
    <!-- 头部 -->
    <el-header>
      <el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">？啊啊啊</div>
        </el-col>
        <el-col :span="18">
          <div class="grid-content bg-purple-light">
            <h1>电商后台管理系统</h1>
          </div>
        </el-col>
        <el-col :span="3">
          <div class="grid-content bg-purple">
            <a href="#" class="myout">退出</a>
          </div>
        </el-col>
      </el-col>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">Aside</el-aside>
      <!-- 主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {};
</script>

<style>
h1 {
  margin: 0;
  padding: 0;
}
.el-container {
  height: 100%;
}
.el-header {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  height: 100%;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  height: 100%;
  line-height: 160px;
}
.myout {
  text-decoration: none;
}
</style>
