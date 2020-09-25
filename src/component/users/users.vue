<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 渲染页面 -->
    <!-- 头部搜索栏 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <!-- 头部输入框 -->
        <el-input placeholder="请输入内容" class="input-with-select" clearable v-model="queryInfo.query">
          <!-- 搜索 -->
          <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
        </el-input>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <!-- 提交按钮 -->
          <el-button type="primary" @click="adddialogVisible = true">添加用户</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- table表格 -->
    <el-table :data="userList" stripe style="width: 100%">
      <el-table-column prop="username" label="用户名" width="180"></el-table-column>
      <el-table-column prop="mobile" label="手机" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <template v-slot="scoped">
          {{scoped.row.id}}
          <el-switch active-color="#13ce66" inactive-color="#ff4949" v-model="scoped.row.mg_state"   @change="change(scoped.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scoped">
          {{scoped.row.id}}
          <!-- 编辑按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="getUserInfoById(scoped.row.id)"></el-button>
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="deletebtn(scoped.row.id)"></el-button>
          <!-- 设置按钮 -->
          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>

    <!-- 提交按钮弹出框 -->
    <el-dialog title="提示" :visible.sync="adddialogVisible" width="50%"  @close="addFormClose">
      <!-- 验证表单 -->
      <el-form :model="addForm" :rules="addRules" label-width="100px" ref="addFormUsers">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <!-- 手机 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="addFormbtn">确 定</el-button>
      </span>
    </el-dialog>




   <!-- 编辑按钮弹出框 -->
    <el-dialog title="提示" :visible.sync="editdialogVisible" width="50%"  >
      <!-- 验证表单 -->
      <el-form :model="editForm" ref="editFormRef" :rules="editRules" label-width="100px" > 
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" ></el-input>
        </el-form-item>
         <el-form-item label="用户名" prop="email">
          <el-input v-model="editForm.email" ></el-input>
        </el-form-item>
         <el-form-item label="用户名" prop="mobile">
          <el-input v-model="editForm.mobile" ></el-input>
        </el-form-item>
       <!-- 密码不能修改 -->
        <!-- 邮箱 -->
        <!-- <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary"  @click="editUserForm">确 定2221</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {

      var checkEmail = (rule, value, callback) => {
      return /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/.test(value)
        ? callback()
        : callback(new Error("输入正确的邮箱"));
    };
    var checkMobile = (rule, value, callback) => {
      return /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(
        value
      )
        ? callback()
        : callback(new Error("请输入合法的手机号"));
    };
    return {
      //
      queryInfo: {
        query: "",
        pagenum: 1,
        // 渲染的初始值  一页显示多少条数据
        pagesize: 4,
      },
      userList: [],

      //设置总量
      total: 0,

      //设置提交弹出框的布尔值
      adddialogVisible: false,


      editdialogVisible:false,

      //添加用户对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },

      //设置编辑对象  
      editForm: {
       username: "",
       email: "",
      mobile: "",
            },

      // 校验规则
      addRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
        ],
         password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
        ],
          email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: 'blur' }
        ],
          mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: 'blur' }

        ],
      },

      // 修改规则
       editRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 15, message: "长度在 3 到 15 个字符", trigger: "blur" },
        ],
          email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: 'blur' }
        ],
          mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: 'blur' }

        ],
      },



    };
  },

  methods:{
    //渲染页面
    async getUserList() {
      //思路:  获取数据后赋值给空数组userList  在将uerList 单向绑定表格中用element的props接收数据
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      // console.log(res);
      //2--提示用户
      if (res.meta.status !== 200) {
        return this.$message.error("获取页面数据失败");
      }
      this.$message.success("获取页面数据成功");
      //3-将获取到的数据赋值给表格
      this.userList = res.data.users;
      this.total = res.data.total;

    //  console.log(this.userList);
    },

    //页码变化
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getUserList();
    },

    // 默认当前页面
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getUserList();
    },

    //提交表单
   async addFormbtn(){
    
    //      console.log(this);
    //提交表单时候的数据
    const {data:res} = await this.$http.post("users" , this.addForm );
    // console.log(res);
      //关闭弹出框
      this.adddialogVisible = false
    },

  //重置表单
  addFormClose(){
        this.$refs.addFormUsers.resetFields()
  },

  //修改用户的状态
   async change(info){
   // console.log(info);
      const {data:res} = await this.$http.put(`users/${info.id}/state/${info.mg_state}`);
      // console.log(res);
     if(res.meta.status !== 200){
       return this.$messages.error("更改状态失败")
     }
      this.$message.success("更改状态成功")
    },




  // 根据id去查询用户信息  编辑用户  获取数据
    async getUserInfoById(id) {
      //  打开对话框
      this.editdialogVisible = true
      // console.log(id);
      const { data: res } = await this.$http.get(`users/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.editForm = res.data
      console.log(this.editForm);
    },

     

 

     // 提交修改用户信息  编辑用户信息 同步到数据库
    editUserForm() {
         // 1. 预校验
      this.$refs.editFormRef.validate(async boo => {
        console.log(boo);
        // 后面的不走了
     if(!boo) return this.$message.error('请输入合法的信息')
        // 2. 发送请求
        // console.log(this.editForm.id);
        const { data: res } = await this.$http.put(
          `users/${this.editForm.id}`,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile
          }
        )
       
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败')
        }
        this.$message.success('更新用户信息成功')
        // 3. 关闭对话框
        this.editdialogVisible = false
        // 4. 重新渲染页面
         this.getUserList()
      })
   },

    // 

    //删除功能
   async deletebtn(id){

      //1- 弹出提示框
      const result = await  this.$msgbox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        console.log(result);
        //2-判断用户是否删除成功
        if(result !== "confirm") {
          return this.$message.error("删除用户失败");
        }
        this.$message.success("删除用户成功");
        //3-删除功能
      const {data:res} = await this.$http.delete(`users/${id}`);
        console.log(res);

        //4-重新渲染
         this.getUserList();
    }

  },

  // 勾子函数
  created() {
    this.getUserList();
  }
  }
</script>

<style>
</style>