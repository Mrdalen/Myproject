<template>
  <el-card class="mycard">
    <!-- 面包屑导航 -->
    <mybread one="商品管理" two="商品列表"></mybread>
    <!-- 提示文案 -->
    <el-alert title="消息提示的文案" type="info" class="myalert" center show-icon></el-alert>

    <!-- 步骤条 -->
    <el-steps :active="active" align-center finish-status="success">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>

    <!-- tabs选项 -->
    {{activeName}}
    <el-tabs :tab-position="tabPosition" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="基本信息" name="?">
        <el-form label-width="100px" class="demo-ruleForm" label-position="top">
          <el-form-item label="商品名称">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            {{catVal}}
            <el-cascader v-model="catVal" :options="catList" :props="propsObj"></el-cascader>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品参数">
        <div v-for="item in goodsPar" :key="item.attr_id">
          <!-- 渲染商品参数 -->
          <div class="mybox">{{item.attr_name}}</div>
          <el-checkbox
            :v-model="true"
            border
            v-for="(val,index) in item.attr_vals.split(',')"
            :key="index"
          >{{val}}</el-checkbox>
        </div>
      </el-tab-pane>
      <el-tab-pane label="商品属性">
        <el-form label-width="100px" class="demo-ruleForm" label-position="top">
          <el-form-item v-for="(item,index) in goodsAttr" :key="index" :label="item.attr_name">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片">
        <!-- on:-preview 钩子函数  点击图片后执行的逻辑代码 -->
        <el-upload
          class="upload-demo"
          :on-preview="handlePreview"
          :on-success="uploadSuccess"
          :on-remove="uploadRemove"
          action="http://localhost:8888/api/private/v1/upload"
          list-type="picture"
          :headers="token"
        >
          {{filerList}}
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="商品内容">商品内容</el-tab-pane>
    </el-tabs>

    <!-- 对话框 -->
    <el-dialog title="图片预览" :visible.sync="imgDialog">
      <img src ref="myimg" alt>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="imgDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import mybread from "../layout/mybread.vue";
export default {
  data() {
    return {
      // 步骤条对应的下标
      active: 0,
      //   tab选项的对其方式
      tabPosition: "left",
      //   tab选项的选中项
      activeName: "?",
      //   级联框对应的数据源
      catList: [],
      //   级联框对应的
      propsObj: { expandTrigger: "hover", label: "cat_name", value: "cat_id" },
      //   级联框对应的值
      catVal: [],
      //   商品参数数据源
      goodsPar: [],
      //   多选框对应的数据
      checked: true,
      // 商品属性对应的数据源
      goodsAttr: [],
      // 设置上传图片的请求头
      token: { Authorization: window.localStorage.getItem("token") },
      // 上传的图片集合
      filerList: [],
      // 图片详情对话框
      imgDialog: false
    };
  },
  components: {
    mybread
  },
  methods: {
    // 得到商品参数&商品属性
    getGodds(par) {
      // 判断级联框是否选中商品
      if (this.catVal.length != 0) {
        this.$http({
          // 传过来的请求方式
          url: `categories/${
            this.catVal[this.catVal.length - 1]
          }/attributes?sel=${par}`
        }).then(res => {
          // 解构
          let { data, meta } = res.data;
          if (meta.status == 200) {
            if (par == "many") {
              // 赋值给商品参数的数据源
              this.goodsPar = data;
            } else {
              // 赋值给商品属性的数据源
              this.goodsAttr = data;
            }
          }
        });
      } else {
        // 如果有选中就提示
        this.$message.error("请选择商品分类");
      }
    },
    //   点击tab选项
    tabClick(tab) {
      // 把对应的下标赋值给步骤条
      this.active = +tab.index;
      //   商品参数
      if (tab.index === "1") {
        // 获取选中的id
        this.getGodds("many");
      }
      // 商品属性
      if (tab.index === "2") {
        // 调用接口
        this.getGodds("only");
      }
    },
    // 得到级联框中的数据
    getCateList() {
      this.$http({
        url: "categories"
      }).then(res => {
        let { data, meta } = res.data;

        if (meta.status == 200) {
          // 赋值过去
          this.catList = data;
        }
      });
    },
    // 点击图片详情
    handlePreview(file) {
      //  获取图片地址
      let img = file.url;
      // 打开弹出框
      this.imgDialog = true;

      // 在页面更新之后执行的回调函数
      this.$nextTick(() => {
        this.$refs.myimg.src = img;
      });
      // setTimeout(() => {
      //   this.$refs.myimg.src = img;
      // }, 0);
    },
    // 图片上传成功
    uploadSuccess(response, file, fileList) {
      // 存储对应的事件
      this.filerList.push(response.data.tmp_path);
    },
    // 文件移除
    uploadRemove(file, fileList) {
      let img = file.response.data.tmp_path;
      // console.log(file);
      this.filerList.forEach((item, index) => {
        if (item === img) {
          // 移除对应的图片
          this.filerList.splice(index, 1);
        }
      });
    }
  },
  mounted() {
    // 默认获取数据
    this.getCateList();
  }
};
</script>

<style>
.myalert {
  margin-top: 20px;
  margin-bottom: 20px;
}
.el-step__title {
  font-size: 12px;
}
.mybox {
  margin: 20px 0;
}
label.el-checkbox.is-bordered.is-checked {
  margin-right: 10px;
}
</style>
