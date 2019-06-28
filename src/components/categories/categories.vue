<template>
  <el-card>
    <!-- 面包屑导航 -->
    <mybread one="商品管理" two="商品分类"></mybread>
    <!-- 添加按钮 -->
    <el-button plain type="success" class="mybtn" @click="getCate">添加分类</el-button>
    <!-- 分类表格 -->
    <el-table :data="pageList" style="width: 100%">
      <el-table-tree-column
        file-icon="icon icon-file"
        folder-icon="icon icon-folder"
        treeKey="cat_id"
        parentKey="cat_pid"
        levelKey="cat_level"
        prop="cat_name"
        label="分类名称"
        width="180"
      ></el-table-tree-column>
      <el-table-column prop="name" label="级别" width="180">
        <template
          slot-scope="scope"
        >{{scope.row.cat_level==0?'一级':scope.row.cat_level==1?'二级':'三级'}}</template>
      </el-table-column>
      <el-table-column prop="address" label="是否有效">
        <template slot-scope="scope">{{scope.row.cat_deleted?'有效':'无效'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <!-- slot-scope="scope" 指的是当前行的数据 -->
        <template>
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <el-pagination
      @size-change="sizeChange"
      @current-change="curChange"
      :page-sizes="pagesizes"
      :page-size="pagesize"
      :current-page="pagenum"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 弹出对话框 -->
    <el-dialog title="新增分类" :visible.sync="addDialog">
      <el-form>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input autocomplete="off" v-model="catename"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <!-- 级联选择器 -->
          <div class="block">
            <el-cascader v-model="selVal" :options="options" :props="propsObj" clearable></el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="success" @click="addCate">新 增</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
// 引入面包屑导航组件
import mybread from "../layout/mybread";
export default {
  // 数据
  data() {
    return {
      // 表格的数据
      CategoriesList: [],
      //   表格的数据
      pageList: [],
      //   页容量
      pagesize: 5,
      //   当前页
      pagenum: 1,
      //   选择性页容量
      pagesizes: [5, 7, 10],
      //   总数量
      total: 0,
      //   表单宽度
      formLabelWidth: "80px",
      //   级联框弹出框
      addDialog: false,
      //   级联框的数据源
      options: [],
      //   级联框绑定的value
      selVal: [],
      //   级联框的配置项
      propsObj: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        checkStrictly: true
      },
      //   新增的分类名称
      catename: ""
    };
  },
  //   组件
  components: {
    mybread
  },
  //   事件
  methods: {
    // 获取数据
    getCategories() {
      this.$http({
        method: "GET",
        url: `/categories?type=${3}`
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status == 200) {
          // 赋值给数据源
          this.CategoriesList = data;
          // 总数量
          this.total = this.CategoriesList.length;
          //   调用分页方法
          this.getPageList();
        } else {
          this.$message.error(meta.msg);
        }
      });
    },
    // 获取分页数据
    getPageList() {
      // 得到开始的下标
      let begin = this.pagesize * (this.pagenum - 1);
      //   结束的下标
      let end = this.pagesize * this.pagenum;
      // 获取开始与结束的下标
      this.pageList = this.CategoriesList.slice(begin, end);
    },
    // 当页容量发生改变
    sizeChange(schange) {
      // 赋值页容量
      this.pagesize = schange;
      // 重新调用
      this.getPageList();
    },
    // 当当前页发生改变
    curChange(pagenum) {
      // 赋值当前页
      this.pagenum = pagenum;
      // 重新调用
      this.getPageList();
    },
    // 点击添加按钮
    getCate() {
      // 打开弹框
      this.addDialog = true;
      //   渲染级联数据
      this.getTwoData();
    },
    // 得到二级的数据
    getTwoData() {
      this.$http({
        method: "GET",
        url: `/categories?type=${2}`
      }).then(res => {
        // console.log(res);
        let { meta, data } = res.data;
        if (meta.status == 200) {
          // 赋值给级联数据源
          this.options = data;
        }
      });
    },
    //点击新增分类
    addCate() {
      // 分类的父元素pid
      let pid =
        this.selVal.length == 0 ? 0 : this.selVal[this.selVal.length - 1];
      // 分类的层级
      let level = this.selVal.length;
      // 参数   分类昵称  分类的父id  分类的层级
      this.$http({
        method: "POST",
        url: "/categories",
        data: {
          cat_pid: pid,
          cat_name: this.catename,
          cat_level: level
        }
      }).then(res => {
        let { data, meta } = res.data;
        if (meta.status == 201) {
          // 添加成功提示用户并关闭
          this.$message.success(meta.msg);
          this.addDialog = false;
        } else {
          this.$message.error(meta.msg);
        }
      });
    }
  },
  mounted() {
    //   默认获取
    this.getCategories();
  }
};
</script>

<style scoped>
.mybtn {
  margin-top: 20px;
}
</style>
