<template>
  <div>
    <!-- 权限列表 -->


    
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-table :data="rightsList">
      <el-table-column  stripe style="width: 100%">
        <!-- <el-table-column  type="index"></el-table-column> -->
        <el-table-column prop="authName" label="权限说明"></el-table-column>
        <el-table-column prop="path" label="对应访问路径"></el-table-column>
        <el-table-column prop="level" label="权限层级">
          <template v-slot="scoped" >
            <!-- {{scoped.row}} -->
           
            <el-tag  v-if = "scoped.row.level == 0" type="success">一级</el-tag>
            <el-tag v-else-if = "scoped.row.level == 1" type="danger">二级</el-tag>
            <el-tag v-else type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  methods: {
    //渲染
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      console.log(res);
      this.rightsList = res.data;
    },
  },
  created() {
    this.getRightsList();
  },
};
</script>

<style>
</style>