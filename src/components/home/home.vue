<template>
  <!-- 页面容器 -->
  <el-container>
    <!-- 头部 -->
    <el-header>
      <TopHead></TopHead>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <SideBar></SideBar>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
// 引入头部组件
import TopHead from "../layout/topHead";
// 引入侧边栏组件
import SideBar from "../layout/sideBar";
export default {
  components: {
    SideBar: SideBar,
    TopHead: TopHead
  },
  mounted() {
    // console.log();
    // 判断是否登陆
    // let token = window.localStorage.getItem("token");
    // if (!token) {
    //   // 弹出警告信息
    //   this.$message({
    //     message: "您还没有登陆哦！",
    //     type: "warning"
    //   });
    //   // 并跳回登陆页面
    //   this.$router.push({ name: "login" });
    // }
  }
};
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
  /* text-align: center; */
  height: 100%;
  line-height: 200px;
}
.mymenu {
  height: 100%;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  /* text-align: center; */
  height: 100%;
  /* line-height: 160px; */
}
.myout {
  text-decoration: none;
}
</style>
