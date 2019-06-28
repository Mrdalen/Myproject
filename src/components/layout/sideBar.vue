<template>
  <!-- 菜单栏 -->
  <el-menu :router="true" :unique-opened="true" class="el-menu-vertical-demo mymenu">
    <el-submenu v-for="item in rightsList" :key="item.id" :index="item.path">
      <template slot="title">
        <i class="el-icon-location"></i>
        <span>{{item.authName}}</span>
      </template>
      <el-menu-item v-for="son in item.children" :key="son.id" :index="son.path">
        <template>
          <i class="el-icon-menu"></i>
          {{son.authName}}
        </template>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>


<script>
export default {
  data() {
    return {
      rightsList: []
    };
  },
  methods: {
    // 获取侧边栏权限
    getmenu() {
      this.$http({
        url: "http://localhost:8888/api/private/v1/menus"
      }).then(res => {
        // console.log(res);
        let { data, meta } = res.data;
        if (meta.status == 200) {
          this.rightsList = data;
        }
      });
    }
  },
  mounted() {
    this.getmenu();
  }
};
</script>

<style>
.mymenu {
  height: 100%;
}
</style>
