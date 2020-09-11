<template>
  <div class="menu">
    <!-- 菜单管理 -->
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to>菜单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <div class="btn">
      <el-button type="primary" @click="open">添加</el-button>
    </div>
    <!-- 树状表格 -->
    <el-table
      :data="data"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="title" label="名称" width="150px"></el-table-column>
      <el-table-column prop="icon" label="图标" width="150px">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="type" width="150px" label="类型">
        <template slot-scope="scope">
          <!-- <el-tag v-else-if="scope.row.status==2" type="danger">禁用</el-tag> -->
          <el-tag v-if="scope.row.type==1">目录</el-tag>
          <el-tag v-else type="success">菜单</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="url" width="150px" label="菜单地址"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" width="150px">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :title="'菜单'+txt" :visible.sync="show" width="50%">
      <!-- 对话框提交数据 -->
      <el-form :model="form" label-width="80px" :rules="rules"  ref="form" >
        <el-form-item label="菜单类型:" label-width="90px">
          <el-select v-model="form.pid" @change="changeType">
            <el-option label="顶级菜单" :value="0"></el-option>
            <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称:" prop="title" label-width="90px">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标:" v-if="form.type==1" prop="icon" label-width="90px">
          <el-input v-model="form.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单地址:" v-else  label-width="90px">
          <el-input v-model="form.url" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型:"  label-width="90px">
          <el-radio v-model="form.type" :label="1" :disabled="form.type!=1">目录</el-radio>
          <el-radio v-model="form.type" :label="2" :disabled="form.type!=2">菜单</el-radio>
        </el-form-item>
        <el-form-item  label="状态:"  label-width="90px">
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
        <el-button type="primary" @click="handleAdd('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: [], //表格渲染数据
      show: false, //对话框显示隐藏
      txt: "添加", //对话框文本
      form: {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      },
      status: true, //开关状态
      list: [], //请求数据,按pid分类,(渲染表单下拉项)
      rules: {
        title: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
        icon: [
            { required: true, message: '请输入菜单图标', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
      },
    };
  },
  mounted() {
    // 请求数据赋给data
    this.getData();
  },
  watch: {
    show() {
      //监听对话框关闭状态,重置form
      if (this.show) {
        this.getlist(); //打开获取渲染数据
      } else {
        this.resetForm(); //关闭清除数据
        
      }
    },
  },
  methods: {
    //重置form
    resetForm() {
      this.form = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      };
      this.status= true, //开关状态
      this.$refs.form.clearValidate();
    },
    //请求数据渲染表格
    getData() {
      this.$http.get("/api/menulist", { params: { istree: 1 } }).then((res) => {
        if (res.code == 200) {
          this.data = res.list;
        } else {
          this.$message({
            type: "warn",
            message: res.msg,
          });
        }
      });
    },
    //点击添加打开
    open() {
      this.txt = "添加";
      // 获取渲染数据在监听
      this.show = true;
    },
    //获取数据渲染对话框
    getlist() {
      this.$http.get("/api/menulist?pid=0").then((res) => {
        this.list = res.list;
      });
    },
    //根据下拉选择,修改form.type类型
    changeType(val) {
      this.form.type = val === 0 ? 1 : 2;
    },
    //根据开关状态切换
    changeStatus(val) {
      if (val) {
        this.form.status = 1;
      } else {
        this.form.status = 2;
      }
    },
    //取消清空内容
    handleCancel() {
      //清空在监听器中操作
      this.show = false;
    },
    //确定添加,清空form,关闭对话框
    handleAdd(form) {
       this.$refs[form].validate((valid) => {
          if (valid) {//验证通过
      let url = "";
      // 判断from是否有id
      if (this.form.id) {//修改
        url = "/api/menuedit";
      } else {//添加
        url = "/api/menuadd";
      }
      this.$http.post(url, this.form).then((res) => {
        if (res.code == 200) {//添加成功
          this.$message({
            type: "success",
            message: res.msg,
          });
          this.getData(); //重新获取数据渲染表格
        } else {//添加失败
          this.$message({
            type: "warn",
            message: res.msg,
          });
        }
      });
          } else {//验证失败
            this.$message({
            type: "error",
            message:'格式有误,请输入正确格式',
          });
            return false;
          }
        });
      //清空在监听器中操作
      this.show = false;
    },
    // 编辑
    handleEdit(val) {
      // 获取当前行内容赋给表单
      this.txt = "修改"; //对话框文本
      this.form = val;
      this.getlist();
      this.status = this.form.status == 1 ? true : false;
      this.show = true;
    },
    // 删除
    handleDelete(val) {
      this.$http.post("/api/menudelete", { id: val.id }).then((res) => {
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