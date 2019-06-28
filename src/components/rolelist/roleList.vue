<template>
  <!-- 卡片 -->
  <el-card>
    <!-- 面包屑导航 -->
    <Mybread one="用户管理" two="角色列表"></Mybread>
    <!-- 添加按钮 -->
    <el-row class="myrow">
      <el-button @click="addRoleDialog=true">添加角色</el-button>
    </el-row>

    <!-- 表格 -->
    <el-table :data="rouleList" :border="true" style="width: 100%">
      <!-- 添加展开列表 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          {{scope.row.id}}
          <!-- 遍历第一级权限 -->
          <el-row v-for="(item1,index1) in scope.row.children" :key="index1">
            <!-- 生成一级权限 -->
            <el-col :span="3">
              {{item1.id}}
              <el-tag closable @close="getDelete(scope.row,item1.id)">{{item1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="21">
              <!-- 遍历二级权限 -->
              <el-row v-for="(item2,index2) in item1.children" :key="index2" class="roulerow">
                <el-col :span="3">
                  <!-- 生成二级权限 -->
                  {{item2.id}}
                  <el-tag
                    closable
                    type="success"
                    @close="getDelete(scope.row,item2.id)"
                  >{{item2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col :span="21">
                  <!-- 遍历三级权限并生成 -->
                  <el-tag
                    class="item3"
                    v-for="(item3,index3) in item2.children"
                    :key="index3"
                    closable
                    type="warning"
                    @close="getDelete(scope.row,item3.id)"
                  >
                    {{item3.id}}
                    {{item3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row v-if="scope.row.children.length===0">
            <el-col :span="24">没有分配权限</el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作">
        <!-- slot-scope="scope"  指的是当前行的属性 -->
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="getallotRoles(scope.row)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限按钮 -->
    <el-dialog title="权限分配" :visible.sync="rouledialog" width="30%">
      <!-- 树形结构 -->
      <el-tree
        ref="mytree"
        :data="data"
        node-key="id"
        :props="defaultProps"
        :default-expand-all="true"
        :show-checkbox="true"
        :default-checked-keys="defaultChecked"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rouledialog = false">取 消</el-button>
        <el-button type="primary" @click="setRightFn">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 新增角色 -->
    <el-dialog title="新增角色" :visible.sync="addRoleDialog">
      <el-form :model="addRoleForm">
        <el-form-item label="角色名">
          <el-input v-model="addRoleForm.roleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRoleForm.roleDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="success" @click="addRoles">新 增</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 导入面包屑组件
import Mybread from "../layout/mybread.vue";

export default {
  data() {
    return {
      // 存储的表格数据
      rouleList: [],
      rouledialog: false,
      // 分配权限数据列表
      data: [],
      // 指定要渲染的数据源
      defaultProps: {
        children: "children",
        label: "authName"
      },
      // 默认选中项
      defaultChecked: [],
      // 存储要修改的角色id
      rouleId: 0,
      // 新增角色弹框
      addRoleDialog: false,
      // 新增角色的表单数据
      addRoleForm: {
        roleName: "",
        roleDesc: ""
      }
    };
  },
  // 注册为组件
  components: {
    Mybread: Mybread
  },
  methods: {
    // 获取角色列表
    getRoleList() {
      this.$http({
        method: "GET",
        url: "/roles"
      }).then(res => {
        let { data, meta } = res.data;
        // 赋值过去
        if (meta.status == 200) {
          this.rouleList = data;
        }
      });
    },
    // 删除权限
    // 点击关闭tag时触发的事件
    getDelete(scope, rightId) {
      // 两个参数  第一个是当前行的数据  第二个是对应的权限id
      this.$http({
        method: "DELETE",
        url: `roles/${scope.id}/rights/${rightId}`
      }).then(res => {
        let { meta, data } = res.data;
        if (meta.status == 200) {
          // 删除成功后提示
          this.$message({
            message: "删除成功",
            type: "success"
          });
          // 重新赋值权限对应的角色的一级权限(实现重新渲染)
          scope.children = data;
        }
      });
    },
    // 点击分配按钮
    getallotRoles(scope) {
      // 把要分配权限的id赋值
      this.rouleId = scope.id;
      // 每次打开都清空一次
      this.defaultChecked = [];
      this.rouledialog = true;
      // 调用接口
      this.$http({
        method: "GET",
        // 获取树状数据
        url: "/rights/tree"
      }).then(res => {
        let { data, meta } = res.data;
        if (meta.status == 200) {
          // 赋值给树形控件
          this.data = data;
          // console.log(scope);

          // 将所有三级权限的标签赋值给数组
          scope.children.forEach(item1 => {
            // 所有的一级
            item1.children.forEach(item2 => {
              // 所有的一级的二级
              item2.children.forEach(item3 => {
                // 所有二级的三级
                //得到id存到数组里，（默认选中项）
                this.defaultChecked.push(item3.id);
              });
            });
          });
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    // 设置权限
    setRightFn() {
      // 通过ref来操纵元素
      // getCheckedKeys   返回所有得到全选的id
      let idsAll = this.$refs.mytree.getCheckedKeys();

      // getHalfCheckedKeys   返回所有半选状态的id
      let idsHalf = this.$refs.mytree.getHalfCheckedKeys();

      // 将全选与半选组合
      let ids = [...idsAll, ...idsHalf];
      // 将ids转换为字符串
      ids = ids.join(",");

      // 调用接口
      this.$http({
        method: "POST",
        url: `roles/${this.rouleId}/rights`,
        // 要授权的id
        data: { rids: ids }
      }).then(res => {
        // console.log(res);
        let { data, meta } = res.data;
        // 如果获取成功
        if (meta.status == 200) {
          // 重新获取数据
          this.getRoleList();
          // 提示信息
          this.$message.success(meta.msg);
          // 关闭弹出框
          this.rouledialog = false;
        }
      });
    },
    // 新增角色
    addRoles() {
      this.$http({
        method: "POST",
        url: "roles",
        data: {
          roleName: this.addRoleForm.roleName,
          roleDesc: this.addRoleForm.roleDesc
        }
      }).then(res => {
        if (res.data.meta.status == 201) {
          this.$message.success(res.data.meta.msg);
          this.getRoleList();
          this.addRoleDialog = false;
        } else {
          this.$message.error(res.data.meta.msg);
        }
      });
    }
  },
  mounted() {
    // 默认调用一次
    this.getRoleList();
  }
};
</script>

<style>
.myrow {
  margin-top: 10px;
}
.item3 {
  margin-right: 12px;
}
.roulerow {
  margin-bottom: 15px;
}
</style>
