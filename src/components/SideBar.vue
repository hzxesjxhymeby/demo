<template>
  <div class="SideBar">
    <!-- unique-opened只允许一个导航标签打开
     :default-active ="$route.path" 默认活跃状态
    -->
    <el-menu
      class="el-menu-vertical-demo"
      background-color="#222222"
      text-color="#eee"
      active-text-color="#ffd04b"
      :default-active="$route.path"
      unique-opened
    >
      <!-- div -->
      <el-menu-item>后台管理系统</el-menu-item>
      <el-menu-item index="/index">
        <router-link to="/index">
          <!-- 字体图标 -->
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </router-link>
      </el-menu-item>

      <!-- 一级菜单 ul-->
      <el-submenu v-for="item in user" :index="item.id.toString()" :key="item.id">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{item.title}}</span>
        </template>
        <!-- 二级菜单 ul-li-ul-->
        <el-menu-item-group>
          <el-menu-item v-for="i in item.children" :index="i.url" :key="i.id">
            <router-link :to="i.url">
              <span>{{i.title}}</span>
            </router-link>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
  
  },
  computed: {
    user() {
      return this.$store.state.user.menus;
    },
  },
};
</script>
<style lang="stylus" scope>
.SideBar
  height 100%
.el-menu {
  width: 150px;
  height 100%
  // border-color:#000
}

.el-submenu .el-menu-item {
  min-width: 149px;
}
.el-menu i 
  position relative
  top -1px

/* 导航栏的颜色 */
.el-menu a {
  width:100%
  height 100%
  display block
  text-decoration: none;
  color: #fff;
}

/* 活跃样式 */
.el-menu .is-active a.router-link-active, .is-opened .is-active a.router-link-active {
  color: #048be9;
}
</style>

