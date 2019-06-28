<template>
  <!-- 卡片 -->
  <el-card>
    <!-- 面包屑导航 -->
    <mybread one="商品管理" two="商品列表"></mybread>

    <!-- 头部区域 -->
    <el-row class="myrow">
      <!-- 行占6  -->
      <el-col :span="6">
        <!-- 搜索框 -->
        <el-input placeholder="请输入内容" class="input-with-select" v-model="query">
          <el-button icon="el-icon-search" @click.prevent="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <!-- 新增按钮 -->
        <el-button type="success" plain @click.prevent="$router.push('/goodsAdd')">add</el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" prop="goods_id"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="500"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="180"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column prop="add_time" label="创建时间"></el-table-column>

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
  </el-card>
</template>

<script>
// 引入面包屑导航
import mybread from "../layout/mybread.vue";
export default {
  data() {
    return {
      // 搜索框绑定的数据
      query: "",
      //   表格绑定的数据源
      tableData: [],
      //   当前页
      pagenum: 1,
      // 页容量
      pagesize: 5,
      // 选择页容量
      pagesizes: [10, 15, 20],
      //   总条数
      total: 100
    };
  },
  components: {
    mybread
  },
  methods: {
    //   获取商品列表数据
    getGoodsList() {
      this.$http({
        method: "GET",
        url: `/goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}&total=${
          this.total
        }`
      }).then(res => {
        let { meta, data } = res.data;

        if (meta.status == 200) {
          // 赋值总条数
          this.total = data.total;
          //   赋值数据源
          this.tableData = data.goods;
        }
      });
    },
    //   点击搜索
    search() {
      this.getGoodsList();
    },
    // 当页容量发生改变
    sizeChange(pagesize) {
      this.pagesize = pagesize;
      this.getGoodsList();
    },
    // 当前页数发生改变
    curChange(pagenum) {
      this.pagenum = pagenum;
      this.getGoodsList();
    }
  },
  mounted() {
    //   默认获取数据
    this.getGoodsList();
  }
};
</script>

<style>
.myrow {
  margin-top: 20px;
}
</style>
