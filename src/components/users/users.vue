<template>
  <!-- 卡片 -->
  <el-card>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 头部区域 -->
    <el-row class="myrow">
      <!-- 行占6  -->
      <el-col :span="6">
        <!-- 搜索框 -->
        <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <!-- 新增按钮 -->
        <el-button type="success" plain @click="getAdd">add</el-button>
      </el-col>
    </el-row>
    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" prop="id"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- lot-scope="scope"  获取的是当前行的数据 -->
        <template slot-scope="scope">
          <!-- 当前用户状态 -->
          <el-switch
            v-model="scope.row.mg_state"
            @change="putStatus(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <!-- 操作面板 -->
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click.prevent="deleteUsers(scope.row.id)"
            v-loading.fullscreen.lock="fullscreenLoading"
            plain
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <!-- :current-page  指的是当前页 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="curChange"
      :current-page="pagenum"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 弹出框 -->
    <el-dialog title="添加用户" :visible.sync="addDialog">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input autocomplete="off" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input autocomplete="off" type="email" v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="form.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addcancle">取 消</el-button>
        <el-button type="primary" @click.prevent="addusers">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      // 表格的内容
      tableData: [],
      // 查询参数
      query: "",
      // 当前页数
      pagenum: 1,
      // 每页显示的条数
      pagesize: 3,
      // 选择每页显示的条数
      pagesizes: [3, 5, 10],
      // 总条数
      total: 0,
      // 控制弹出框的显示和隐藏
      addDialog: false,
      // 设置表头宽度
      formLabelWidth: "80px",
      form: {
        // 用户名
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // Lodin加载
      fullscreenLoading: false
    };
  },
  methods: {
    // 获取数据
    getUsers() {
      // 取到token值
      let token = window.localStorage.getItem("token");
      // 调用接口
      this.$http({
        method: "GET",
        url: `http://localhost:8888/api/private/v1/users?query=${
          this.query
        }&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
        // 请求头token
        headers: { Authorization: token }
      }).then(res => {
        // console.log(res);
        let { data, meta } = res.data;
        if (meta.status == 200) {
          // 把总条数赋值
          this.total = data.total;
          // 把数据赋值给tableData
          this.tableData = data.users;
          // console.log(this.tableData);
        }
      });
    },
    // 当前页改变时触发
    curChange(currentPage) {
      // 参数是当前页数
      // console.log(currentPage);
      // 赋值给pagenum
      this.pagenum = currentPage;
      // 获取一次数据
      this.getUsers();
    },
    // 当选择页容量改变时触发
    sizeChange(pagesizes) {
      // console.log(pagesizes);
      // 把选择的页容量赋值
      this.pagesize = pagesizes;
      // 获取一次数据
      this.getUsers();
    },
    // 点击搜索时触发
    search() {
      // 调用一次
      this.getUsers();
    },
    // 关闭新增弹框
    addcancle() {
      this.addDialog = false;
      // 清空表单内数据
      for (const key in this.form) {
        this.form[key] = "";
      }
    },
    // 打开新增弹框
    getAdd() {
      this.addDialog = true;
    },
    // 新增用户
    addusers() {
      // 获取浏览器上的token值
      let token = window.localStorage.getItem("token");
      this.$http({
        method: "POST",
        url: "http://localhost:8888/api/private/v1/users",
        data: this.form,
        // 请求头
        headers: { Authorization: token }
      }).then(res => {
        // console.log(res);
        // 如果新增成功
        if (res.data.meta.status === 201) {
          // 弹出提示信息
          this.$message({
            message: res.data.meta.msg,
            type: "success"
          });
          // 清空表单内数据
          for (const key in this.form) {
            this.form[key] = "";
          }
          // 关闭新增弹框
          this.addcancle();
          // 重新调用数据
          this.getUsers();
          // 如果新增失败
        } else {
          // 弹出提示框
          this.$message({
            message: res.data.meta.msg
          });
        }
      });
    },
    // 删除用户
    deleteUsers(id) {
      // 获取token值
      let token = window.localStorage.getItem("token");
      // 调用接口
      this.$http({
        method: "DELETE",
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        // 请求头中发送token
        headers: {
          Authorization: token
        }
      }).then(res => {
        if (res.data.meta.status == 200) {
          // Lodin加载
          this.fullscreenLoading = true;
          // Lodin加载后执行的回调函数
          setTimeout(() => {
            this.fullscreenLoading = false;
            // 删除成功提示
            this.$message({
              message: res.data.meta.msg,
              type: "success"
            });
            // 重新获取数据
            this.getUsers();
          }, 400);
        } else {
          this.$message({
            message: "删除错误"
          });
        }
      });
    },
    // 当状态发生变化
    putStatus(stobj) {
      // 获取存到浏览器上的token值
      let token = window.localStorage.getItem("token");
      // 调用接口设置用户状态
      this.$http({
        method: "PUT",
        url: `http://localhost:8888/api/private/v1/users/${stobj.id}/state/${
          stobj.mg_state
        }`,
        headers: { Authorization: token }
      }).then(res => {
        // console.log(res);
      });
    }
  },
  mounted() {
    // 默认调用
    this.getUsers();
  }
};
</script>

<style>
.myrow {
  margin-top: 40px;
}
</style>
