<template>
  <div class="role">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <div class="btn">
      <el-button type="primary" @click="open">添加</el-button>
    </div>
    <el-table :data="data" style="width:100%">
      <el-table-column prop="rolename" label="名称" width="180px"></el-table-column>
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
    <el-dialog :title="'菜单'+txt" :visible.sync="show" width="50%">
      <!-- 对话框提交数据 -->
      <el-form :model="form" label-width="80px" :rules="rules" ref="form">
        <el-form-item label="角色名称:" prop="rolename" label-width="90px">
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 树状结构 -->
        <el-form-item label="角色权限" label-width="90px">
          <el-tree
            ref="m"
            :data="list"
            :default-checked-keys="menus"
            :props="{children:'children',label:'title'}"
            show-checkbox
            node-key="id"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态:" label-width="90px">
          <el-switch
            active-color="#23a9f2"
            inactive-color="#ccc"
            v-model="status"
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
      data: [], //表格数据
      show: false, //对话框状态
      txt: "添加", //对话框左上角文本
      form: {
        //对话框提交数据
        status: 1,
        rolename: "",
      },
      status: true, //开关
      list: [], //树形列表数据
      menus: [], //权限数组
      rules: {
        rolename: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    show() {
      //监听对话框关闭状态,重置form
      if (this.show) {
        this.getList();
      } else {
        this.resetForm();
        this.resetMenus();
      }
    },
  },
  methods: {
    //重置form
    resetForm() {
      this.form = {
        rolename: "",
        status: 1,
      };
      this.status=true//开关
    },
    //重置权限列表
    resetMenus() {
      this.menus = [];
    },
    getData() {
      //获取数据渲染表格
      this.$http.get("/api/rolelist").then((res) => {
        this.data = res.list;
      });
    },
    //点击添加打开对话框
    open() {
      (this.txt = "添加"), (this.show = true);
    },
    // 获取list需求数据,渲染树状结构
    getList() {
      this.$http.get("/api/menulist?istree=1").then((res) => {
        this.list = res.list;
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
    handleAdd(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let m = this.$refs.m.getCheckedKeys().join(",");
          this.form.menus = m;
          let url = this.form.id ? "/api/roleedit" : "/api/roleadd";
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
    //编辑
    handleEdit(val) {
      let obj={...val}
      this.txt = "修改";
      let a = [];
      obj.menus.split(",").map((item) => {
        a.push(Number(item));
      });
      this.menus = a;
      this.form = obj;
      this.status = obj.status == 1 ? true : false;
      this.show = true;
    },
    //删除
    handleDelete(val) {
      this.$http.post("/api/roledelete", { id: val.id }).then((res) => {
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