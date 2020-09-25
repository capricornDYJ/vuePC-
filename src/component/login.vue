<template>
<!-- 页面布局
    1-- html结构
    2-- css样式
    3-- 表单校验
    4-- 登录验证 

 -->

<!-- 登录页面 -->
  <div class="login">
    <div class="login_box">

      <!-- TODO logo头像区域 -->
      <div class="logo">
        <!-- logo -->
        <img src="../assets/logo.png" alt />
      </div>

      <!--表单区域 --> 
      <!-- :model="formmsg"  给表单提供数据绑定 -->
      <!--:rules="loginRules"  給表单绑定验证规则  子组件用props接收需校验的字段(element.ui 提供)  input输入框是双向绑定的可以得到输入的用户名-->
      <!-- ref="loginformRef" ref引用的值 就是 表单的实例对象  可以通过他调用resetFields重置表单内容并移除校验规则 -->
      <el-form class="form" :model="formmsg" :rules="loginRules" ref="loginformRef">
        <!-- 账号 -->
        <!-- 利用props(官方文档提供)接收表单验证规则 -->
        <el-form-item prop="username">
          <!--  v-model="formmsg.username"  双向绑定data数据 -->
          <!--  prefix-icon="el-icon-user"  icon图标 -->
          <el-input prefix-icon="el-icon-user" v-model="formmsg.username"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-unlock" v-model="formmsg.password"></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <!-- type="primary"  element.ui 按钮样式 -->
          <el-button type="primary"   @click="login">登录 e盘</el-button>
          <el-button type="info"  @click="resetLogin">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>

</template>

<script>
export default {
  data() {
    return {
      //定义表单验证数据
      formmsg: {
        username: "admin",
        password: "123456",
      },

      //定义表单验证数据
      // 规则里面的  username 和 password 必须和上面 formmsg里面的属性一样
      loginRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  //定义按钮触发函数
  methods: {
  //   重置按钮
    resetLogin() {
      //console.log(this);//$refs: {loginformRef: VueComponent}  打印出this(此时的this指向的就是登陆组件login的实例)而这个实例有一个属性$refs可以直接访问到loginformRef组件
      // resetFields()重置表单内容并移除校验规则
      //即: this.$refs的身上有一个属性loginformRef  而loginformRef这个属性身上有一个方法resetFields(element.ui 提供)可以重置 表单 
      this.$refs.loginformRef.resetFields();
    },
    // 登录按钮
    login() {
      // 发送请求之前先对表单进行预校验

      //通过this.$refs.loginformRef 获取表单的引用对象  调用validate函数接收回调函数接收验证成果 
      // 这个函数语法:Function(callback: Function(boolean, object))  --element.ui文档
      //validate对整个表单进行校验的方法 
      //valid 作为形参接收表格   --->element.ui 文档

      this.$refs.loginformRef.validate(async valid => {
        //  console.log(valid);
        // valid 是一个布尔值true表示表单预校验通过,可以发送请求,false表示没有通过表单验证,不允许发送请求
        
        //发送请求  前提:发送请求前需要axios包 
                  //1--在main.js(入口js)中配置
                  //2--
        if (!valid) return;//不符合规定则发送请求失败
        console.log(this); // vue实例

        //发送请求成果并返回数据
        //步骤: 连接api接口(app.js文档) 
        //      this.$http.post("login", this.formmsg)调用接口文档的login路径(登录验证接口)并传入永固输入的数据(账号,密码) -->返回的是promise对象
        //      用async  和 await 可以直接得到想要的数据  用promise 的语法是.then  或者.catch

        //const  str  = await this.$http.post("login", this.formmsg);
        //console.log(str);//{data: {…}, status: 200, statusText: "OK", headers: {…}, config: {…}, …} ----> 得到的是所有响应对象  但我们只需要data里的真实数据-->可以使用解构赋值方法直接将data里的数据获取

        //解构赋值  ，只要等号两边模式相同，那么左边变量可以被赋予对应的值。
        //  {被解构的值: 新赋值的值}
        // $http 是axios被挂载在vue全局后的名字
        const{data:res} = await this.$http.post("login",this.formmsg)// 原理:  只会将this.formmsg 中符合data名的值赋值给res
        console.log(res);
        
        // 设置弹框
        if(res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')

        // 1.2 token 只应在当前网站打开期间生效，所以将 token 保存在 sessionStorage 中
        
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转到home页面 编程式导航 
         this.$router.push('/home')

      });
    }
  },
};
</script>

<style lang="less" scope>
.login {
  width: 100%;
  height: 100%;
  background-color: #2b4b6b;

  .login_box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 2px 3px 3px rgba(255, 255, 255, 0.6);
    .logo {
      position: absolute;
      left: 50%;
      top: -75px;
      transform: translate(-50%);
      width: 130px;
      height: 130px;
      background-color: #fff;
      border-radius: 50%;
      overflow: hidden;
      padding: 10px;
      img {
        width: 100%;
        border-radius: 50%;
      }
    }
  }

  .form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
    .btns {
      float: right;
    }
  }
}
</style>