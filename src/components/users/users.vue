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
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            plain
            size="mini"
            @click="getEdit(scope.row.id)"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click.prevent="deleteUsers(scope.row.id)"
            v-loading.fullscreen.lock="fullscreenLoading"
            plain
            size="mini"
          ></el-button>
          <!-- 分配按钮 -->
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="getAlloat(scope.row)"
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

    <!-- 新增弹出框 -->
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

    <!-- 修改弹出框 -->
    <el-dialog title="修改用户" :visible.sync="editDialog">
      <el-form :model="editForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input autocomplete="off" type="email" v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog=false">取 消</el-button>
        <el-button type="primary" @click.prevent="editUsers(editForm)">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 角色分配弹出框 -->
    <el-dialog title="角色分配" :visible.sync="allotDialog">
      <el-form :model="allot">
        <el-form-item label="当前用户" :label-width="formLabelWidth">
          <!-- <el-input autocomplete="off"></el-input> -->
          {{allot.username}}
        </el-form-item>
        <el-form-item label="请选择角色" :label-width="formLabelWidth">
          <!-- 角色选项 -->
          <el-select v-model="allot.role" placeholder>
            <el-option label="请选择角色" value="-1" disabled></el-option>
            <el-option label="主管" value="30"></el-option>
            <el-option label="测试角色" value="31"></el-option>
            <el-option label="测试角色2" value="34"></el-option>
            <el-option label="超级管理员" value="39"></el-option>
            <el-option label="test" value="40"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allotDialog = false">取 消</el-button>
        <el-button @click="Alloat(allot.id)" type="primary">确 定</el-button>
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
      // 控制新增框的显示和隐藏
      addDialog: false,
      // 控制修改框的显示和隐藏
      editDialog: false,
      // 控制角色分配框的显示和隐藏
      allotDialog: false,
      // 设置表头宽度
      formLabelWidth: "100px",
      // 新增弹框内容数据
      form: {
        // 用户名
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      // 修改弹框内容数据
      editForm: {
        // 用户名
        username: "",
        email: "",
        mobile: "",
        id: ""
      },
      // 角色分配弹框内容数据
      allot: {
        username: "",
        role: "请选择角色",
        id: 0
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
          // 如果清空后获取到空的数据就让当前页减一重新获取一次数据
          if (data.users.length === 0 && this.pagenum != 1) {
            this.pagenum--;
            this.getUsers();
          }
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
    // 打开修改弹框
    getEdit(id) {
      // 获取token值
      let token = window.localStorage.getItem("token");
      // 弹框出来并获取数据
      this.editDialog = true;
      this.$http({
        method: "GET",
        url: `http://localhost:8888/api/private/v1/users/${id}`,
        headers: { Authorization: token }
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status == 200) {
          // 把数据渲染到修改弹框上
          for (const key in this.editForm) {
            this.editForm[key] = data[key];
          }
        }
      });
    },
    // 修改用户
    editUsers(form) {
      // 获取token值
      let token = window.localStorage.getItem("token");
      // 调用接口
      this.$http({
        method: "PUT",
        url: `http://localhost:8888/api/private/v1/users/${form.id}`,
        // 修改后的数据
        data: {
          email: form.email,
          mobile: form.mobile
        },
        // 请求头中放入token值
        headers: { Authorization: token }
      }).then(res => {
        // console.log(res);
        if (res.data.meta.status == 200) {
          // 如果修改成功提示，并重新获取渲染页面
          this.editDialog = false;
          this.$message({
            message: "修改成功",
            type: "success"
          });
          this.getUsers();
        }
      });
    },
    // 删除用户
    deleteUsers(id) {
      // 提示用户
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
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
        this.$message({
          message: "修改状态成功",
          type: "success"
        });
        // console.log(res);
      });
    },
    // 点击分配角色
    getAlloat(alloatObj) {
      // 弹出分配角色框
      this.allotDialog = true;
      // 获取token值
      let token = window.localStorage.getItem("token");
      // 根据id获取数据
      this.$http({
        method: "GET",
        url: `http://localhost:8888/api/private/v1/users/${alloatObj.id}`,
        // 请求头发送token值
        headers: { Authorization: token }
      }).then(res => {
        // 把用户名和角色还有id赋值过去
        let { data } = res.data;
        this.allot.id = data.id;
        this.allot.username = data.username;
        switch (data.rid) {
          case -1:
            this.allot.role = "请选择角色";
            break;
          case 30:
            this.allot.role = "主管";
            break;
          case 31:
            this.allot.role = "测试角色";
            break;
          case 34:
            this.allot.role = "测试角色2";
            break;
          case 39:
            this.allot.role = "超级管理员";
            break;
          case 40:
            this.allot.role = "test";
            break;
          default:
            this.allot.role = "请选择角色";
        }
      });
    },
    // 点击确定分配
    Alloat(id) {
      // 获取token值
      let token = window.localStorage.getItem("token");
      // 如果用户没有修改
      if (
        this.allot.role == "请选择角色" ||
        this.allot.role == "主管" ||
        this.allot.role == "测试角色" ||
        this.allot.role == "测试角色2" ||
        this.allot.role == "超级管理员" ||
        this.allot.role == "test"
      ) {
        // 提示没有选择修改
        // this.allotDialog = false;
        this.$message({
          message: "您没有修改角色哦"
        });
      } else {
        // 调用接口
        this.$http({
          method: "PUT",
          url: `http://localhost:8888/api/private/v1/users/${id}/role`,
          data: { rid: this.allot.role },
          // 请求头发送token
          headers: { Authorization: token }
        }).then(res => {
          // console.log(res);
          this.allotDialog = false;
          this.$message({
            message: res.data.meta.msg,
            type: "success"
          });
        });
      }
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
