<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 头部搜索区 -->
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="grid-content bg-purple">
          <el-input placeholder="请输入内容" v-model="input" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          <el-button type="warning" plain  @click="$router.push('/goods/add')">添加商品</el-button>
        </div>
      </el-col>
    </el-row>

    <!-- table表格区域 -->
    <el-table :data="goodList" stripe style="width: 100%">
      <el-table-column prop="goods_name" label="商品名称" width="700"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格(元)" width="150"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="150"></el-table-column>
      <el-table-column prop="add_time" label="创建时间" width="150">
          
      <template v-slot='scoped'>
            {{scoped.row.add_time | dateFormate}}

      </template>
      </el-table-column>
      <el-table-column label="操作">
            <template v-slot="scoped">
                {{scoped.row.goods_id}}
                  <el-button type="success" icon="el-icon-edit" circle></el-button>
               <el-button type="danger" icon="el-icon-delete" circle></el-button>
            </template>
      </el-table-column>
    </el-table>

    <!-- 分页区域 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page=queryInfo.pagenum
      :page-sizes="[10, 20, 30, 40]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total=total>
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
    //.TODO: 获取 列表参数
      queryInfo: {
          query:'',
          pagenum:1,
          pagesize:10
      },  
      goodList:[],
    //.TODO:  总量
     total:0,

    }
  },

  methods:{
      //.FIXME:  获取数据列表
      async  getGoodsList(){
            const {data:res} = await this.$http.get("goods",{params:this.queryInfo});
             console.log(res);
            this.goodList = res.data.goods;
            //.TODO:   赋值总量
            this.total = res.data.total
        },

        //.FIXME:  每页条数
        handleSizeChange(val){
            this.queryInfo.pagesize = val

            this.getGoodsList()
        },

        //.FIXME:  当前多少页
        handleCurrentChange(val){
            this.queryInfo.pagenum = val

            this.getGoodsList()
        }
  },

  created(){
      this.getGoodsList();
  }
};
</script>

<style style="less" scoped>

</style>