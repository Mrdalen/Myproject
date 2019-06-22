<template>
  <div class="login">
    <div class="content">
      <el-form
        label-position="top"
        :model="userObj"
        status-icon
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        :rules="rules"
      >
        <h2>用户登陆</h2>
        <el-form-item label="用户名" prop="username">
          <el-input type="text" v-model="userObj.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userObj.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="myloginbtn"
            round
            @click.prevent="login"
            v-loading.fullscreen.lock="fullscreenLoading"
          >登陆</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userObj: {
        password: "",
        username: ""
      },
      // 判断的条件
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "请输入正确用户名", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 16, message: "请输入正确密码", trigger: "blur" }
        ]
      },
      fullscreenLoading: false
    };
  },
  methods: {
    // 点击登陆/判断表单输入
    login() {
      // 绑定需要判断的表单
      this.$refs.ruleForm.validate(valid => {
        // 判断没有出错
        if (valid) {
          // 调用接口
          this.$http({
            url: "http://localhost:8888/api/private/v1/login",
            method: "post",
            data: this.userObj
          }).then(res => {
            // 结构
            let { data, meta } = res.data;
            // 如果登陆成功
            if (meta.status === 200) {
              // Loding加载
              this.fullscreenLoading = true;
              // Lodin加载后执行的回调函数
              setTimeout(() => {
                this.fullscreenLoading = false;
                // 提示信息
                this.$message({
                  message: meta.msg,
                  type: "success"
                });
                // 跳转路由
                this.$router.push("/");
                // 把token存到浏览器中
                window.localStorage.setItem("token", data.token);
              }, 500);
              // 登陆失败
            } else {
              // Lodin加载
              this.fullscreenLoading = true;
              // Lodin加载后执行的回调函数
              setTimeout(() => {
                this.fullscreenLoading = false;
                // 提示信息
                this.$message({
                  message: meta.msg,
                  type: "warning"
                });
              }, 400);
            }
          });
        }
      });
    }
  }
};
</script>

<style>
.login {
  width: 100%;
  height: 100%;
  background-color: rgb(20, 112, 20);
  position: relative;
}
.content {
  position: absolute;
  top: 50%;
  left: 50%;
  padding: 40px;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 740px;
  height: 500px;
}
.myloginbtn {
  width: 100%;
}
</style>
