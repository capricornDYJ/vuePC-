<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 警示框 -->
    <el-alert title="消息提示的文案" type="info" show-icon center></el-alert>

    <!-- 步骤条 -->
    <el-steps :space="200" :active="+activeName" finish-status="success">
      <el-step title="基本信息"> </el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!--tabs标签  -->
    <el-form
      :model="addForm"
      :rules="addrules"
      ref="addFormRef"
      label-width="100px"
      label-position="top"
    >
      <el-tabs
        :tab-position="(tabPosition = `left`)"
        style="height: 200px"
        v-model="activeName"
        @tab-click="handleClick"
        :before-leave="beforeLeave"
      >
        <el-tab-pane label="基本信息" name="0">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="addForm.goods_name"></el-input>
          </el-form-item>

          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="addForm.goods_price"></el-input>
          </el-form-item>

          <el-form-item label="商品重量" prop="goods_weight">
            <el-input v-model="addForm.goods_weight"></el-input>
          </el-form-item>

          <el-form-item label="商品数量" prop="goods_number">
            <el-input v-model="addForm.goods_number"></el-input>
          </el-form-item>

          <el-form-item label="商品分类">
            <el-cascader
              v-model="addForm.goods_cat"
              :options="cateList"
              :props="cascaderProps"
              @change="cascaderClick"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品参数" name="1">
          <el-form-item
            :label="item.attr_name"
            prop="attr_name"
            v-for="(item, i) in manyList"
            :key="i"
          >
            <el-checkbox-group v-model="item.attr_vals">
              <el-checkbox
                :label="item1"
                v-for="(item1, i1) in item.attr_vals"
                :key="i1"
              ></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品属性" name="2">
          <el-form-item
            :label="item.attr_name"
            prop="name"
            v-for="(item, i) in onlyList"
            :key="i"
          >
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>

        <el-tab-pane label="商品图片" name="3">
          <el-upload
            class="upload-demo"
            action="http://127.0.0.1:8888/api/private/v1/upload"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            list-type="picture"
            :headers="headersObj"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-tab-pane>

        <el-tab-pane label="商品内容" name="4">
            <quill-editor  ref="myTextEditor" v-model="content">


            </quill-editor>
            <br>  
              <el-button type="success" class="tianjiabtn" @click="addBtn">添加商品</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <!-- 预览图片对话框 -->
    <el-dialog
      title="预览图片"
      :visible.sync="picsVisible"
      width="50%"
    
    >
      <img :src="previewUrl" width="100%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="picsVisible = false">取 消</el-button>
        <el-button type="primary" @click="picsVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 面板激活状态
      activeName: "0",

      //.TODO:  表单接收数据
      addForm: {
        goods_name: "aaa",
        goods_price: 100,
        goods_weight: 100,
        goods_number: 11,
        //.TODO:  级联的绑定值
        goods_cat: [],
        //.TODO:  上传图片的暂存路径
        pics: [],
        //.TODO:  提交文件时的新参数
        attrs:[]
      },
      //.TODO:  可选项数据源
      cateList: [],

      //.TODO:  商品参数列表
      manyList: [],

      //.TODO:  商品属性列表
      onlyList: [],

      //.TODO:  图片预览路径
      previewUrl:[],

      //.TODO:  富文本编辑器内容
      content:'',
      //.TODO:  级联配置项
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },

      //.TODO:  配置请求头
      headersObj: {
        Authorization: sessionStorage.getItem("token"),
      },

    picsVisible:false,
      //.TODO:  表单校验规则
      addrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },

      //.TODO: 级联选择框
    };
  },

  methods: {
    //.FIXME:  基本参数..基本属性数据渲染
    async handleClick() {
      //.TODO:   判断点击的的状态 点击name值为1 的tabs栏时
      if (this.activeName === "1") {
        const {
          data: res,
        } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          { params: { sel: "many" } }
        );


        this.manyList = res.data;
        // console.log(this.manyList);

        //.TODO:  將manyList的属性转换为数组  用复选框的模式渲染
        this.manyList.forEach((item) => {
          item.attr_vals = item.attr_vals.split(" ");
        });
      }

      //.TODO:  点击name为2 时
      if (this.activeName === "2") {
        const {
          data: res,
        } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          { params: { sel: "only" } }
        );

        this.onlyList = res.data;
        //console.log(this.onlyList);
      }
    },

    //.FIXME:  获取级联数据源
    async getCateList() {
      //.TODO:   发送请求
      const { data: res } = await this.$http.get("categories");
      // console.log(res);
      this.cateList = res.data;
    },

    //.FIXME: 级联选择框发生变化时
    handleChange() {
      //.TODO:  规定只能选择三级分类
      if (this.addForm.goods_cat.length !== 3) {
        return (this.addForm.goods_cat = []);
      }
    },

    //.FIXME:  切换标签之前的钩子
    beforeLeave(activeName, oldActiveName) {
      //.TODO:  如果旧页面是name为0 的页面  且  级联选择框的长度不为3 则不进行跳转
      if (oldActiveName == "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请选择商品分类");
        return false;
      }
    },

    //.FIXME:   利用tabs 标签的点击事件获取商品参数和商品属性的数据
    cascaderClick() {
      //
      if (this.addForm.goods_cat.length != 3) {
        return (this.addForm.goods_cat = []);
      }
    },

    //.FIXME:  文件上传成功
    handleSuccess(file) {
    //  console.log(file);
      //1.TODO:  文件上传成功需要配置请求头 解决跨域问题
      //2.TODO:   配置action上传的地址 加上图片上传的接口
      //3.TODO:  将tem_path中的暂存路径以对象形式存储在pics中
      this.addForm.pics.push({
        pic: file.data.tem_path,

      });

    },

    //.FIXME:   文件预览
    handlePreview(file) {
    //  console.log(file);
         //.TODO:  打开对话框
      this.picsVisible = true
      //.TODO:  获取点击该图片时的路径 并赋值
      this.previewUrl = file.response.data.url
      console.log(this.previewUrl);
    },

    //.FIXME:  文件删除
    handleRemove(file) {
      console.log(file);
     // this.

    },

    //.FIXME:  提交商品
     addBtn(){
      // console.log(666);
        //.TODO:  预校验
        this.$refs.addFormRef.validate(async boo => {
              //console.log(boo);
            if(!boo){
              return this.$massage.error('请填写完整信息')
            }
  
          //.TODO:  遍历forEach 属性列表  将
          console.log(this.manyList);
           //console.log(this.manyList.attr_value);
          this.manyList.forEach(item => {
              //.TODO:   vals转化为字符串
            let obj ={
              
              attr_id:item.attr_id,
              
              attr_value:item.attr_vals.join('')

            }
            this.addForm.attrs.push(obj)

          })

          //.TODO:  遍历onlyList 
          this.onlyList.forEach(item => {

              let obj = {
                  
              attr_id:item.attr_id,
              
              attr_value:item.attr_vals

              }
            this.addForm.attrs.push(obj);

          })

          //.TODO:  添加商品

          //.TODO:  将adFrom 深拷贝一份
       var newform = JSON.parse(JSON.stringify(this.addForm));

       //.TODO:  goods_cat 级联关联的是数组  所以需要转换
       newform.goods_cat =  newform.goods_cat.join(',');

          const {data:res} = await this.$http.post("goods",newform);
          console.log(res);

        //.TODO:  提示用户
        this.$message.success('添加商品成功');

        //.TODO:  路由跳转
        this.$router.push('/goods')
        })


     }
  },

  created() {
    this.getCateList();
  },
};
</script>

<style type="less" scoped>
.quill-editor{
  height: 200px;
}
.tianjiabtn{
  margin-top: 42px;
}
</style>