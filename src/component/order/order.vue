
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 头部搜索区 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-button type="warning" plain>添加商品</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table :data="orderList" stripe style="width: 100%">
      <el-table-column type="index"> </el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="600">
      </el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="180">
      </el-table-column>
      <el-table-column prop="pay_status" label="是否付款"> </el-table-column>
      <el-table-column prop="is_send" label="是否发货"> </el-table-column>
      <el-table-column prop="update_time" label="下单时间"> 
          {{update_time | dateFormate}}
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scoped">
          {{ scoped.row.order_id }}
          <el-tooltip
            class="item"
            effect="dark"
            content="编辑地址"
            placement="top-start"
          >
            <el-button
              type="warning"
              icon="el-icon-edit"
              circle
              @click="editBtn"
            ></el-button>
          </el-tooltip>
          <el-tooltip
            class="item"
            effect="dark"
            content="物流信息"
            placement="top-start"
          >
            <el-button
              type="success"
              icon="el-icon-add-location"
              circle
              @click="showLogistics"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>

    <!-- 編輯地址对话框 -->
    <el-dialog title="编辑地址" :visible.sync="bianjiVisible" width="50%" @close="editReset">
      <el-form :model="editForm" :rules="editRules" ref="editRuleFormRef" label-width="100px" class="demo-ruleForm"  >
           <el-form-item label="省市区/县" prop="adress">
        <el-cascader
            v-model="value"
            :options="option"
            :props="cascaderProps"
            @change="handleChange"
        ></el-cascader>
           </el-form-item>
            <!--   -->
        <el-form-item label="详细地址" prop="adressInfo">
            <el-input v-model="editForm.adressInfo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="bianjiVisible = false">取 消</el-button>
        <el-button type="primary" @click="editAdd"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 查看物流信息对话框 -->
<el-dialog
  title="查看物流信息"
  :visible.sync="showDialogVisible"
  width="50%"
 >
   <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :icon="activity.icon"
      :type="activity.type"
      :color="activity.color"
      :size="activity.size"
      :timestamp="activity.ftime">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>

  <span slot="footer" class="dialog-footer">
    <el-button @click="showDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="showDialogVisible = false">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
import option from "./citydata.js";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      orderList: [],
      total: 0,
      //.TODO:  级联绑定项
      value: [],
      //.TODO:  级联数据源
      option,
      //.TODO:  编辑地址对话框
      bianjiVisible: false,
        //.TODO:  查看物流对话框
      showDialogVisible:false,
      //.TODO: 物流信息
      activities:[],
        //.TODO:  级联选择框配置
      cascaderProps: {
        value: "value",
        label: "label",
        children: "children",
        expandTrigger: "hover",
      },
    //.TODO:  编辑修改地址的表单
    editForm:{
        adress:'',
        adressInfo:''
    },
    //.TODO:  
    editRules:{
         adress: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },     
          ],
           adressInfo: [
            { required: true, message: '请输入详细地址', trigger: 'blur' },
           
          ],
    }

    };
  },
  methods: {
    //.TODO:   表格渲染
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
     // console.log(res);
      this.orderList = res.data.goods;
     // console.log(this.orderList);
      this.total = res.data.total;
    },

    //.TODO:  分页
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      this.getOrderList();
    },

    //.TODO: 分页
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      this.getOrderList();
    },

    //.TODO:  级联变化时
    handleChange() {},

    //.TODO:  编辑对话框开启
    editBtn() {
      this.bianjiVisible = true;
    },

    //.TODO:  重置编辑地址表单
    editReset(){
        this.$refs.editRuleFormRef.resetFields();
    },

    //.TODO:  提交
    editAdd(){
        this.bianjiVisible = false
    },

    //.TODO:  查看物流信息
   async showLogistics(){
        this.showDialogVisible = true;
        const{data:res} = await this.$http.get(`/kuaidi/1106975712662`);
         console.log(res);
        this.activities = res.data
       
    }
  },
  created() {
    this.getOrderList();
  },
};
</script>

<style>
</style>