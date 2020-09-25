<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 警示框 -->
    <el-alert title="只允许为三级分来设置相关参数" type="warning"></el-alert>
    <br />
    <br />

    <!-- 级联选择框 -->
    <div class="block">
      <span class="demonstration">选择商品分类</span>
      <el-cascader
        v-model="selectKey"
        :options="cateList"
        :props="cascaderProps"
        @change="handleChange"
        clearable
      ></el-cascader>
    </div>

    <!-- tab栏 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <!--动态参数   -->
      <el-tab-pane label="动态参数" name="many">
        <el-button type="primary" size="mini" :disabled="isDisable" @click="addAttribute">添加参数</el-button>

        <!-- 动态参数表格 -->
        <el-table :data="manyList" stripe style="width: 100%">
          <el-table-column type="expand">
            <template v-slot="scoped">
              <!-- {{scoped.row}} -->
              <el-tag
                size="small"
                closable
                type="success"
                v-for="(item, i ) in scoped.row.attr_vals"
                :key="i"
              >{{item}}</el-tag>

              <!-- 输入框和按钮切换 -->
              <el-input
                class="input-new-tag"
                v-if="scoped.row.inputVisible"
                v-model="scoped.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scoped.row)"
                @blur="handleInputConfirm(scoped.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scoped.row)">+ New Tag</el-button>


            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scoped">
              {{scoped.row.attr_id}}
              <el-button type="primary" round  @click="editFormBtn(scoped.row)">编辑</el-button>
              <el-button type="success" round @click="delForm(scoped.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>

      <!-- 静态属性 -->
      <el-tab-pane label="静态属性" name="only">
        <el-button type="success" size="mini" :disabled="isDisable" @click="addAttribute">添加属性</el-button>

        <!-- 静态属性表格 -->
        <el-table :data="onlyList" stripe style="width: 100%">
          <el-table-column type="expand">
              <template v-slot="scoped">
              <!-- {{scoped.row}} -->
              <el-tag
                size="small"
                closable
                type="success"
                v-for="(item, i ) in scoped.row.attr_vals"
                :key="i"
              >{{item}}</el-tag>

              <!-- 输入框和按钮切换 -->
              <el-input
                class="input-new-tag"
                v-if="scoped.row.inputVisible"
                v-model="scoped.row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scoped.row)"
                @blur="handleInputConfirm(scoped.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput(scoped.row)">+ New Tag</el-button>

            </template>
          </el-table-column>
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="attr_name" label="参数名称" width="180"></el-table-column>
          <el-table-column label="操作">
            <template v-slot="scoped">
              {{scoped.row.attr_id}}
              <el-button type="primary" round size="mini"   @click="editFormBtn(scoped.row)">编辑</el-button>
              <el-button type="success" round size="mini" @click="delForm(scoped.row)">删除</el-button>
            </template>size="mini"
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加属性的对话框 -->
    <el-dialog :title="'添加' +Text " :visible.sync="addVisible" width="50%"  @close="reset">
      <el-form
        :model="addAttributeForm"
        :rules="addForm"
        ref="addAttributeFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="Text" prop="attr_name">
          <el-input v-model="addAttributeForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="tijiaobtn">确 定</el-button>
      </span>
    </el-dialog>

      <!-- 编辑对话框 -->
       
     <el-dialog :title="'修改' +Text " :visible.sync="editVisible" width="50%"  @close="del" >
      <el-form
        :model="editAttributeForm"
        :rules="editForm"
        ref="editAttributeFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="Text" prop="attr_name">
          <el-input v-model="editAttributeForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="bianjiBtn">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // 级联选择框的数据存放的数组
      selectKey: [],
      // 级联数据框数据源
      cateList: [],
      //级联配置对象
      cascaderProps: {
        // TODO  展示给用户看到的字段
        label: "cat_name",
        //.TODO: 父子节关联节点
        children: "children",
        //.TODO: 触发时机
        expandTrigger: "hover",
        //  TODO 提交的数据
        value: "cat_id",
      },
  
      //.TODO:   tag输入框内容

      //.TODO:  验证规则
      addForm: {
        attr_name: [
          { required: true, message: "请输入属性/参数名称", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
       //.TODO:  验证规则
      editForm: {
        attr_name: [
          { required: true, message: "请输入属性/参数名称", trigger: "blur" },
          {
            min: 1,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      //.TODO:  tab栏默认
      activeName: "many",
      //d动态参数列表
      manyList: [],
      //.TODO:  静态属性列表
      onlyList: [],
      //.TODO:  添加属性对话框的打开状态
      addVisible: false,
      //.TODO:  编辑属性对话框的打开状态
      editVisible:false,
      //.TODO:  添加属性对话框表单
      addAttributeForm: {
        attr_name: "",
      },
 //.TODO:  编辑属性对话框表单
      editAttributeForm: {
        attr_name: "",
      },

      id:''
    };

  },
  methods: {
    //.FIXME:  级联数据渲染
    async getCateList() {
      //获取级联数据
      const { data: res } = await this.$http.get("categories");
      console.log(res);
      //提示用户
      if (res.meta.status !== 200) {
        return this.$message.error("获取链表失败");
      }
      this.$message.success("获取列表成功");
      //.TODO:  把获取的数据给级联
      this.cateList = res.data;
    },

    //.FIXME:  级联选择框的触发事件
    handleChange() {
      //.TODO:  只允许级联选择框选三级
      if (this.selectKey.length !== 3) {
        return (this.manyList = this.onlyList = []);
      }
      //.TODO:  选择有效点击事件的时候 触发函数
      this.getParamsList();
    },

    //.FIXME:  tab栏点击事件
    handleClick() {
      console.log(this.activeName);
      //.TODO:  点击tab时调用参数列表
      this.getParamsList();
    },

    //.FIXME:  获取参数列表
    async getParamsList() {
      //.TODO:  预检验  如果级联选择框为空则不调用参数列表
      if (this.selectKey.length != 3) {
        this.manyList = this.onlyList = [];
      }

      //.TODO:  获取参数数据
      const { data: res } = await this.$http.get(
        `categories/${this.selectKey[2]}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );

      console.log(res);

      //.TODO:   遍历将数组中的attr_vals 转化为数组
      res.data.forEach((item) => {
      item.attr_vals = item.attr_vals.length? item.attr_vals.split(" ") : [],
         //.TODO:  并将input的显示状态设置为false  input的内容置空  
         //.TODO:   在循环中设置可以让每一个input都独立运行
            
               item.inputVisible= false
               item.inputValue = ''

      }),

      //.TODO:  用三元分别赋值给两个表格
      this.activeName == "many"
        ? (this.manyList = res.data)
        : (this.onlyList = res.data);
    },

      //.FIXME:   enter触发 和  输入框失去焦点时
      handleInputConfirm(row){
            //  .TODO:   非空校验
              //console.log(row.inputValue);
              if(!row.inputValue.trim()) {
                 row.inputVisible = false;
                  row.inputValue = '';
                  return
              }

              
              row.attr_vals.push(row.inputValue); 

             this.saveTag(row) ;

              row.inputVisible = false;
              row.inputValue = '';

      },

    //.FIXME:  点击newTag 时

    showInput(row){
      console.log(row.attr_id);
      //console.log(row.attr_id);
      //.TODO:   点击时 input 输入框显示
            row.inputVisible = true;
            //.TODO:  点击 input获取焦点
             this.$nextTick(_ => {
              this.$refs.saveTagInput.$refs.input.focus();
            });

    },

    //.FIXME:   提交添加的tag标签  (将添加的数据同步到数据库)
   async saveTag (row) {
        // console.log(row.attr_id);
        // console.log(row.attr_vals);

        //.TODO:  申请 提交修改的参数 到数据库
        const {data:res} = await this.$http.put(`categories/${this.selectKey[2]}/attributes/${row.attr_id}`,{
          attr_name: row.attr_name,
          attr_sel:this.activeName,
          attr_vals:row.attr_vals.join(' ')
        });
         // console.log(res);
          //console.log(row.attr_name);
        if(res.meta.status !=200) return this.$message.error('事务')

          //.TODO:  提示用户
        this.$message.success("修改参数成功");

      
    },

    //.FIXME:   弹出框点击事件
    addAttribute() {
      //.TODO:   将输入框 显示
      this.addVisible = true;
    },

    //.FIXME:  提交添加属性
    tijiaobtn() {
       //.TODO:  优化  校验表单
      this.$refs.addAttributeFormRef.validate(async (boo) => {
       // console.log(boo);
        if (!boo) {
          return this.$message.error("添加属性失败");
        }
        //console.log(this.activeName);
       // console.log(this.addAttributeForm.attr_name);

       //.TODO:   提交
        const { data: res } = await this.$http.post(
          `categories/${this.selectKey[2]}/attributes`,
          {
            attr_name: this.addAttributeForm.attr_name,
            attr_sel: this.activeName,
          
          }
        );
        console.log(res);

        this.getParamsList();
      });
      this.addVisible = false;
    },

    //.FIXME:   编辑打开对话框  并获取数据
    async editFormBtn(row){
      //console.log(row);
      //console.log(row.attr_id);
          this.editVisible = true
          //.TODO:  获取该id的查询参数  获取数据
          const {data:res} = await this.$http.get(`categories/${this.selectKey[2]}/attributes/${row.attr_id}`,{
            attr_sel:this.activeName,
          });
           console.log(res);
          if(res.meta.status !== 200){
            return this.$message.error('获取参数失败');
          }
          //.TODO:  将获取的数据赋值给表单
          this.editAttributeForm = res.data
    },

    //.FIXME:   编辑提交属性 同步数据到数据库
    bianjiBtn(){
      //.TODO:   将表单的id值拿出来提交属性用
      const id = this.editAttributeForm.attr_id;
     //console.log(this.editAttributeForm.attr_id);//获取到了
          //.TODO:  预校验
          this.$refs.editAttributeFormRef.validate(async boo => {
              if(!boo) {
                // console.log(boo);
                return this.$message.error("请提交正确的参数格式")
              }
            //.TODO:   提交属性
            const {data:res} = await this.$http.put(`categories/${this.selectKey[2]}/attributes/${id}}`,{
              attr_name:this.editAttributeForm.attr_name,
               attr_sel: this.activeName,
            })
               //.TODO:   提示用户
          if(res.meta.status !== 200) return this.$message.error('提交属性失败')

          this.$message.success('提交属性成功');
          });

          //.TODO:   关闭对话框
          this.editVisible=false

       
    },
    
    //.FIXME:  编辑对话框重置
    del(){
       this.$refs.editAttributeFormRef.resetFields();
    } ,

    //.FIXME:  提交对话框表单重置
    reset(){
       this.$refs.addAttributeFormRef.resetFields();

    },

//.FIXME:  删除 参数
   async delForm(row){
     console.log(row.attr_id);
        const {data:res} = await this.$http.delete(`categories/${this.selectKey[2]}/attributes/${row.attr_id}`);

        // console.log(res);
        if(res.meta.status !== 200) return this.$message.error("删除参数失败");
        this.$message.success("删除参数成功");
      this.getParamsList();

    } 

  },

  computed: {
    //.FIXME:  监听级联选择框长度  长度为不为3则禁用添加按钮属性
    isDisable() {
      return this.selectKey.length == 3 ? false : true;
    },

    //.FIXME:  监听对话框弹出的title
    Text() {
      return this.activeName == "many" ? "动态参数" : "静态属性";
    },
  },
  created() {
    this.getCateList();
  },
};
</script>

<style  style="less" scoped> 
.el-input{
  width: 200px;
}
</style>