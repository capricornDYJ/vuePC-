<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 主要按钮放在table外 占据一行 -->
    <el-row>
      <el-col>
        <el-button type="primary" @click="addRolesbtn">添加角色</el-button>
      </el-col>
    </el-row>
    <!-- 表格 -->
    <el-table :data="rolesList" style="width: 100%">
      <!-- 分列放在expend中 -->
      <el-table-column type="expand">
        <template v-slot="scoped">
          <!-- {{scoped.row}} -->
          <!-- 给子标签 一行占位  遍历渲染数据-->
          <!-- 类名绑定  :class -->
          <el-row
            :class="['bb', index1==0? 'bt' : '']"
            v-for="(item1, index1) in scoped.row.children"
            :key="index1"
          >
            <!-- 分成两列  用:span 布局-->

            <!-- 一级标签 -->
            <el-col :span="8">
              <el-tag closable @close="closeTag(scoped.row, item1.id)">{{item1.authName}}</el-tag>
              <span class="el-icon-caret-right"></span>
            </el-col>

            <!-- 二三级标签  :span 布局  v-for遍历循环  :class 绑定border边框 -->
            <el-col :span="16">
              <el-row
                v-for="(item2 , index2) in item1.children"
                :key="index2"
                :class="[index2 == 0? '' : 'bt']"
              >
                <!-- 二级标签 -->
                <el-col :span="8">
                  <el-tag
                    type="danger"
                    closable
                    @close="closeTag(scoped.row, item2.id)"
                  >{{item2.authName}}</el-tag>
                  <span class="el-icon-caret-right"></span>
                </el-col>

                <!-- 三级标签 -->
                <!-- closable 添加删除标签 -->
                <el-col :span="16">
                  <el-row>
                    <el-tag
                      closable
                      type="success"
                      v-for="(item3 , index3) in item2.children"
                      :key="index3"
                      @close="closeTag(scoped.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                    <span class="el-icon-caret-right"></span>
                  </el-row>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column prop="roleName" label="主管"></el-table-column>
      <el-table-column prop="roleDesc" label="技术负责人"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scoped">
          <!-- {{scoped.row.id}} -->
          <el-button type="primary">编辑</el-button>
          <el-button type="success">删除</el-button>
          <el-button type="info" @click="showTree(scoped.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加角色弹框 -->
    <el-dialog title="提示" :visible.sync="adddialogVisible" width="50%">
      <el-form label-width="80px" ref="addRulesRef" :model="addRules">
        <el-form-item label="输入角色名称" prop="roleName">
          <el-input v-model="addRules.roleName"></el-input>
        </el-form-item>
        <el-form-item label="输入角色描述" prop="roleDesc">
          <el-input v-model="addRules.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色 的树形结构 -->

    <el-dialog :visible.sync="treedialogVisible" width="50%">
      <el-tree :props="props" show-checkbox :data="roleList"  default-expand-all :default-checked-keys=keys  node-key="id"  ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="treedialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
    
  </div>
</template>

<script>
export default {
  data() {
    return {
      //定义一个空的table数组
      rolesList: [],

      //添加角色 定义数组
      addRules: {
        roleName: "",
        roleDesc: "",
      },

      //分配角色树形控件
      props: {
        label: "authName",
        children: "children",
      },

      //   控制添加角色对话框打开状态
      adddialogVisible: false,

      //树形结构的对话框状态
      treedialogVisible: false,

      //定义树形权限列表数据
      roleList: [],

      //定义一个空的数组存放已选中的分配角色权限的id值
      keys:[],

      //定义树形结构被选中的角色权限中的id值
      id:''
    };
  },


  methods: {

    //渲染表格数据
    async getRolesList() {
      //1-- 利用async获取数据  并结构得到数据
      const { data: res } = await this.$http.get("roles");
    //  console.log(res);
      //2--将得道的数据赋值给空数组  roleList后表格单向绑定此数组 渲染都页面中
      this.rolesList = res.data;
    },

    //点击标签删除权限
    async closeTag(role, rightId) {
      console.log(role.id);
      console.log(rightId);
      //用户确定是否删除  --element 文档 用error 捕获错误信息
      const result = await this.$msgbox
        .confirm("此操作将永久删除该权限, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .catch((err) => err);
      //  console.log(result);

      if (result != "confirm")  return  this.$message.success("取消刪除成功");

      // this.$message.error("删除失败");
      this.$message.success('刪除')
        //console.log(666);

      //点击时传参角色id --文档
      // console.log(roledId,rightId);//获取角色id

      //2-- 删除 (携带id值)
       const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
        console.log(res);
      //3- 删除完成后赋值
       role.children = res.data
    },

    //     //打开添加角色的btn
    addRolesbtn() {
      //打开弹框
      this.adddialogVisible = true;
    },

    //提交添加角色操作
    async addRolesForm() {
      //接收数据
      const res = await this.$http.post("roles", this.addRules);
    //  console.log(res);
      // console.log(res.config.data);
      //将字符串转变为对象
      //  const res1 =JSON.parse(res.config.data)
      //console.log(res1);
      this.addRules = res.data.data;

      // 关闭对话框
      this.adddialogVisible = false;

      // 提示添加角色成功
      this.$message.success("添加成功");

      this.getRolesList();
    },

    //树形结构渲染
    async  showTree(role){
        //开启messageBox弹框
        this.treedialogVisible = true
        //1- h获取数据
        const {data:res} = await this.$http.get("rights/tree");
        //console.log(res);
        //判断获取权限状态
         if(res.meta.status !== 200) {
             return this.$message.error("获取权限失败");
        }
      this.id = role.id
       this.roleList= res.data
       
       //把角色的值以及定义的存放选中的角色权限的空数组传给getTreeid
       //console.log(role);
       this.getTreeid(role,this.keys);
    },

    //树形结构的默认选中状态
    getTreeid(role,arr){
        //.TODO: 如果该角色没有子级权限就直接把该权限的id值push给arr数组中
        if(!role.children) return arr.push(role.id);
        //如果还有子节点就继续遍历自己
        role.children.forEach(item =>{
        return   this.getTreeid(item,arr);
        })

  },

  //提交分配权限
  async addRole(){
    //.TODO:   1-- 获取到角色id
        console.log(this.id);     

      //.TODO:  获取到被选中的半节点和节点  --方法  element.ui 的tree树形结构方法
      const result = this.$refs.treeRef.getCheckedKeys().concat(this.$refs.treeRef.getHalfCheckedKeys()).join(',');

      console.log(result);

      //.TODO:  提交选取的角色权限
      const {data:res} =  await this.$http.post(`roles/${this.id}/rights`,{
        rids:result
      });
      console.log(res);

      //
       this.getRolesList()
       // this.getRolesList()
      //.TODO: 关闭对话框
      this.treedialogVisible = false
   }

  },

    created() {
    //dom树加载后调用函数
    this.getRolesList();

    //  console.log(this.roleList);
  }
}
</script>

<style lang="less" scope>
.el-tag {
  margin: 10px;
}
// 子标签的下边框
.bb {
  border-bottom: 1px solid #ccc;
}
// 子标签的上边框
.bt {
  border-top: 1px solid #ccc;
}
</style>