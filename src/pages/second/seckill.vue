<template>
  <div class="seckill">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to>限时秒杀列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <div class="btn">
      <el-button type="primary" @click="open">添加</el-button>
    </div>
    <el-table :data="data" style="width:100%">
      <el-table-column prop="title" label="活动名称" width="180px"></el-table-column>
      <el-table-column prop="status" label="状态" width="180px">
        <template slot-scope="scope">
          <el-tag effect="dark" v-if="scope.row.status==1" type="success">启用</el-tag>
          <el-tag effect="dark" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 对话框 -->
    <el-dialog :title="'活动'+txt" :visible.sync="show" width="50%">
      <!-- 对话框提交数据 -->
      <el-form :model="form" label-width="80px">
        <el-form-item label="角色名称:">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
<!-- 日期选择器 -->
        <el-form-item label="活动时间:">
          <div class="block">
            <el-date-picker
              v-model="timeList"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="setTimeList"
            ></el-date-picker>
          </div>
        </el-form-item>

        <!-- 一级分类 -->
        <el-form-item label="一级分类">
          <el-select v-model="form.first_cateid" placeholder="请选择一级分类" @change="getSecondList">
            <el-option
              v-for="item in firstList"
              :label="item.catename"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 二级分类 -->
        <el-form-item label="二级分类">
          <el-select v-model="form.second_cateid" placeholder="请选择二级分类" @change="getGoodsName">
            <el-option
              v-for="item in secondList"
              :label="item.catename"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品名 -->
        <el-form-item label="商品名称">
          <el-select v-model="form.goodsid" placeholder="请选择商品名称">
            <el-option
              v-for="item in goodsName"
              :label="item.goodsname"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 开关 -->
        <el-form-item label="状态:">
          <el-switch
            v-model="status"
            active-color="#23a9f2"
            inactive-color="#ccc"
            @change="changeStatus"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [], //表格数据
      show: false, //对话框状态
      txt: "添加", //对话框左上角文本
      form: {
        title: "", //活动名称
        begintime: 0, //开始时间
        endtime: 0, //结束时间
        first_cateid: "", //一级id
        second_cateid: "", //二级id
        goodsid: "", //商品编号--
        status: 1, //状态
      },
      status: true, //开关
      timeList: [], //时间数组
      firstList: [], //一级分类数组
      secondList: [], //二级分类数组
      goodsName: [], //商品名
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    show() {
      //监听对话框关闭状态,重置form
      if (this.show) {
        this.getList(); //获取下拉列表渲染数据
      } else {
        this.resetForm();
      }
    },
  },
  methods: {
    //重置form
    resetForm() {
      this.form = {
        title: "", //活动名称
        begintime: 0, //开始时间
        endtime: 0, //结束时间
        first_cateid: "", //一级id
        second_cateid: "", //二级id
        goodsid: "", //商品编号
        status: 1, //状态
      };
      // this.timeList = []; //时间数组
      this.firstList = []; //一级分类数组
      this.secondList = []; //二级分类数组
      this.goodsName = []; //商品名
    },
    getData() {
      //获取数据渲染表格
      this.$http.get("/api/secklist").then((res) => {
        this.data = res.list;
      });
    },
    //点击添加打开对话框
    open() {
      this.txt = "添加";
      this.show = true;
    },
    setTimeList() {
      //获取事件数组
      let arr = this.timeList.map((item) => {
        return item.getTime();
      });
      this.form.begintime = arr[0];
      this.form.endtime = arr[1];
    },
    // 获取list需求数据,渲染树状结构
    getList(pid = 0) {
      this.$http.get("/api/catelist", { params: { pid } }).then((res) => {
        if (pid == 0) {
          this.firstList = res.list; //一级分类数据
        } else {
          this.secondList = res.list; //二级分类数据
        }
      });
    },
    //得到二级id
    getSecondList(val) {
      this.form.second_cateid = "";
      this.secondList = []; //二级分类数组
      this.form.goodsid = "";
      this.goodsName = []; //商品名
      this.getList(val);
    },
    getGoodsName(val) {
      //获取商品名
      this.$http.get("/api/goodslist").then((res) => {
        this.goodsName = res.list.filter((item) => {
          return item.second_cateid == val;
        });
      });
    },

    //根据开关状态切换
    changeStatus(val) {
      if (val) {
        this.form.status = 1;
      } else {
        this.form.status = 2;
      }
    },
    // 取消
    handleCancel() {
      this.show = false;
    },
    // 添加
    handleAdd() {
      let url = this.form.id ? "/api/seckedit" : "/api/seckadd";
      this.$http.post(url, this.form).then((res) => {
        if (res.code == 200) {
          //添加成功
          this.$message({
            type: "success",
            message: res.msg,
          });
          this.getData(); //重新获取数据渲染表格
        } else {
          this.$message({
            //添加失败
            type: "warn",
            message: res.msg,
          });
        }
      });
      this.show = false;
    },
    //编辑
    handleEdit(val) {
      let obj={...val}
      this.txt = "修改";
      this.timeList = [new Date(Number(obj.begintime)), new Date(Number(obj.endtime))];//直接修改数组项,vue监听不到
      this.getSecondList(obj.first_cateid);
      this.getGoodsName(obj.second_cateid);
      this.form = obj;
      //  console.log(obj,232,this.form,this.timeList)
      this.status = obj.status == 1 ? true : false;
      this.show = true;
    },
    //删除
    handleDelete(val) {
      this.$http.post("/api/seckdelete", { id: val.id }).then((res) => {
        if (res.code == 200) {
          this.$message({
            type: "success",
            message: res.msg,
          });
        } else {
          this.$message({
            type: "warn",
            message: res.msg,
          });
        }
      });
      this.getData(); //重新获取数据渲染表格
    },
  },
};
</script>

<style lang="stylus" scope>
.btn {
  margin: 10px 0;
}
</style>