<template>
  <!-- 卡片 -->
  <el-card>
    <!-- 面包屑导航 -->
    <Mybread one="用户管理" two="权限列表"></Mybread>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="level" label="层级">
        <template slot-scope="scope">
          <!-- {{scope.row.level=="0"?"一级":scope.row.level=="1"?"二级":"三级"}} -->
          <span v-if="scope.row.level==0">一级</span>
          <span v-if="scope.row.level==1">二级</span>
          <span v-if="scope.row.level==2">三级</span>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
// 引入面包屑组件
import Mybread from "../layout/mybread";
export default {
  data() {
    return {
      tableData: []
    };
  },
  methods: {
    // 获取权限列表
    getRightList() {
      // 调用接口
      this.$http({
        method: "GET",
        url: "rights/list"
      }).then(res => {
        // 结构
        let { data, meta } = res.data;
        if (meta.status == 200) {
          // 赋值给data
          this.tableData = data;
        }
        console.log(res);
      });
    }
  },
  mounted() {
    // 默认获取数据
    this.getRightList();
  },
  // 注册为组件
  components: {
    Mybread: Mybread
  }
};
</script>

<style>
</style>
