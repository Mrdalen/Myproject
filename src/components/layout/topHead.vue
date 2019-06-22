<template>
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
        <a
          href="#"
          class="myout"
          v-loading.fullscreen.lock="fullscreenLoading"
          @click.prevent="logout"
        >退出</a>
      </div>
    </el-col>
  </el-col>
</template>

<script>
export default {
  data() {
    return {
      fullscreenLoading: false
    };
  },
  methods: {
    // 点击退出按钮
    logout() {
      this.$confirm("是否要退出登陆?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 调用加载Login
          this.fullscreenLoading = true;
          setTimeout(() => {
            // 两秒后关闭
            this.fullscreenLoading = false;
            // 把存在浏览器上的登陆状态删除
            window.localStorage.removeItem("token");
            // 跳转到登陆页面
            this.$router.push({ name: "login" });
          }, 500);
          this.$message({
            type: "success",
            message: "登出成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    }
  }
};
</script>

<style>
</style>
