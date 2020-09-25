<template>
  <el-container class="container">
    <el-header>
      <div class="left">
        <img src="../assets/heima.png" alt />
        <span>电商后台系统</span>
      </div>
      <el-button type="info" @click="goout">退出</el-button>
    </el-header>
    <el-container>
      <!-- element.ui 复制侧栏结构 -->
      <!--  unique-opened="true"  保证只有一个菜单栏打开 -->
      <!--  router  开启路由模式 -->
      <!-- :default-active="activePath"  设置默认的菜单 -->
      <!-- 折叠功能如果开启宽度就变成64px  否则就为200px -->
      <el-aside :width="isCollapse? '64px' : '200px'">
        <div class="toggle" @click="isCollapse=!isCollapse">|||</div>
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="skyblue"
          :default-active="activePath"
          unique-opened
          router
          :collapse='isCollapse'
          :collapse-transition="false"
        >
          <el-submenu :index="item.id + ''"  v-for="item in menulist" :key ="item.id">
            <template slot="title" >
              <i class="el-icon-location" :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="savePath('/'+subItem.path)">{{subItem.authName}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
         <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      //定义icon对象  id:icon图标
      iconObj:{
        "125":"iconfont icon-user",
        "103":"iconfont icon-3702mima",
        "101":"iconfont icon-shangpin",
        "102":"iconfont icon-danju",
        "145":"iconfont icon-lock_fill"
      },
      //设置默认的菜单
      activePath:'',
      //设置折叠默认的布尔值
      isCollapse:false
    };
  },
  created() {
    this.getMenuList();
    //将本地的路径给默认的菜单  效果是: 点击某页面再刷新的时候仍保持该页面
    this.activePath = sessionStorage.getItem('path')
  },
  methods: {
    //1  退出功能
    goout() {
      //1--跳转到登录页面
      this.$router.push("/login");
      //  清楚token
      sessionStorage.clear();
      //弹出提示框
      this.$message.success("退出成功");
      //登录退出功能完成
    },

    //设置左侧菜单栏列表数据
    async getMenuList() {
      //左侧菜单权限接口 -->获取左侧菜单栏接口
      const { data: res } = await this.$http("menus");
      if (res.meta.status !== 200)
        return this.$message.error("获取数据失败,稍后重试");
      //console.log(res);
      this.menulist = res.data;
    },
      //修改激活路径
  savePath(path) {
   // console.log(path);//打印出路径
    this.activePath = path//将点击的路径给给默认的路径
    sessionStorage.setItem('path',path)
  }
  },


};
</script>

<style lang="less" scope>
.container {
  height: 100%;
  .el-header {
    width: 100%;
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left {
      display: flex;
      align-items: center;
      font-size: 20px;
      span {
        color: #fff;
        margin-left: 20px;
      }
    }
  }
}
.el-aside {
  height: 100%;
  background-color: #333744;
  .toggle{
    letter-spacing: 5px;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
  .el-menu{
    border-right:0
  }
}

</style>