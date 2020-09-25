<template>
  <div>
    <el-button type="primary">添加商品</el-button>
    <br />
    <br />
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  -->
    <tree-table
      :data="goodList"
      :columns="column"
      :show-index="true"
      :expand-type="false"
      :selection-type="false"
    >
      <!-- 是否有效列 -->
      <template slot="isDelected" slot-scope="scoped">
        <span v-if="scoped.row.cat_deleted == true" class="el-icon-error">
        </span>
        <span v-if="scoped.row.cat_deleted == false" class="el-icon-success">
        </span>
      </template>
      <template slot="paixu" slot-scope="scoped">
        <el-tag type="warning" v-if="scoped.row.cat_level == 1"
          >小娟只会一奈奈</el-tag
        >
        <el-tag type="warning" v-else-if="scoped.row.cat_level == 2"
          >小娟只会二奈奈</el-tag
        >
        <el-tag type="warning" v-else>小娟只会三奈奈</el-tag>
      </template>
      <template slot="play" slot-scope="scoped">
        {{ scoped.row.cat_pid }}
        <el-button
          type="primary"
          icon="el-icon-edit"
          circle
          @click="bianji(scoped.row)"
        ></el-button>
        <el-button type="danger" icon="el-icon-delete"></el-button>
      </template>
    </tree-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 5, 10, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 编辑对话框 -->
    <el-dialog
      title="编辑"
      :visible.sync="editDialogVisible"
      width="50%"
    >
        <el-form :model="editForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="更改名称" prop="cat_name">
                <el-input v-model="editForm.cat_name"></el-input>
            </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addForm"
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
      goodList: [],

      //.TODO: table-tree 数据列表
      column: [
        { label: "分类名称", prop: "cat_name" },
        {
          label: "是否有效",
          prop: "cat_deleted",
          type: "template",
          template: "isDelected",
        },
        {
          label: "排序",
          prop: "cat_level",
          type: "template",
          template: "paixu",
        },
        {
          label: "操作",
          prop: "cat_level",
          type: "template",
          template: "play",
        },
      ],

      //商品分类的查询参数
      queryInfo: {
        type: "",
        pagenum: 1,
        pagesize: 5,
      },

      //.TODO:  分页总量
      total: 0,
    
    //.TODO:  
    editForm:{
        cat_name:''
    },

    //.TODO: 
    rules:{
        cat_name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
          ]
    },

      //.TODO:  对话框打开状态
      editDialogVisible:false
    };
  },
  methods: {
    //.TODO:  获取商品分类
    async getGoodList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      //console.log(res);
      this.goodList = res.data.result;
      //console.log(res);
      this.total = res.data.total;
      // console.log(this.total);
    },

    //.TODO:  分页
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getGoodList();
    },

    //.TODO:  分页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getGoodList();
    },

    //.TODO:  编辑
   async bianji(row) {
        //.TODO: 打开对话框状态
        this.editDialogVisible= true
        console.log(row.cat_id);
        console.log(row);
        //.TODO:'  获取名称
            const{data:res} = await this.$http.get(`categories/${row.cat_id}`,{
                cat_name:row.cat_name
                
            });
            
        this.editForm= res.data

    },

    async addForm(){
            // console.log(this.editForm.cat_id);
            // console.log(this.editForm.cat_name);
          //.TODO:'  提交修改名称
            const{data:res} = await this.$http.put(`categories/${this.editForm.cat_id}`,{
                cat_name:this.editForm.cat_name
                
            });
                console.log(res);
            //.TODO:  提示用户
            if(res.meta.status !== 200){
           
                return  this.$message.error("修改失败")
            }
            this.$message.success("修改成功")

            //.TODO:  刷新页面
            this.getGoodList();

        this.editDialogVisible = false
    }
  },

  created() {
    this.getGoodList();
  },
};
</script>

<style lang="less" scoped>
.el-icon-success {
  color: green;
  // font-size: 25px;
}
</style>