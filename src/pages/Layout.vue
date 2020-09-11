<template>
  <div class="layout">
    <el-container>
      <el-aside width="151px">
        <!-- 侧边栏模块内容 (二级导航)-->
        <side-bar />
      </el-aside>
      <el-container>
        <el-header>
          <!-- 右侧顶部内容 -->
          <div class="home-tr">
            <!-- 用户信息 -->
            <!-- 事件函数,相当于click(用于退出) -->
          <el-dropdown @command="logout">
            <span class="el-dropdown-link">
              {{username}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- 事件函数标识,确保多个时,只触发一个 -->
              <el-dropdown-item  command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
            
          </div>
        </el-header>
        <el-main>
          <!-- 内容模块 -->
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import SideBar from "@/components/SideBar.vue";
export default {
  components: {
    SideBar,
  },
  computed:{
    username(){
      return this.$store.state.user.username
    }
  },

  methods:{
//登出函数
    logout(command){
      sessionStorage.clear()//清本地存储
      this.$store.commit('clearInfo')//调用vuex清数据
      this.$router.replace('/login')//跳转登录页
    }
  }
};
</script>
<style lang="stylus">

.layout {
  // background-color rgba(0,0,0,0.5)
  width: 100%;
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: #07538c;
}

.home-tr
  height:60px;
  width:100px;
  float:right
  line-height:60px
  text-align:center
  font-size 18px

  .el-dropdown span 
    color:#eee
</style>

