<template>
  <div class="user">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <div class="btn">
      <el-button type="primary" @click="open">添加</el-button>
    </div>
    <el-table :data="data" style="width:100%">
      <el-table-column prop="uid" label="用户编号" width="180px"></el-table-column>
      <el-table-column prop="rolename" label="角色" width="180px"></el-table-column>
      <el-table-column prop="username" label="名称" width="180px"></el-table-column>
      <el-table-column prop="status" label="状态" width="180px">
        <template slot-scope="scope">
          <el-tag effect="dark" v-if="scope.row.status==1" type="success">启用</el-tag>
          <el-tag effect="dark" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 
      :total="total"绑定总条数
        :page-size="size"每页几条
        @current-change="currentChange"页码切换事件
    -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="page"
        :page-size="size"
        @current-change="currentChange"
      ></el-pagination>
    </div>
    <!-- 对话框 -->
    <el-dialog :title="'管理员'+txt" :visible.sync="show" width="50%">
      <!-- 对话框提交数据 -->
      <el-form :model="form" label-width="80px" :rules="rules" ref="form">
        <el-form-item label="菜单类型:" label-width="90px">
          <el-select v-model="form.roleid" @change="changeRoleid" placeholder="请选择">
            <el-option v-for="item in list" :key="item.id" :label="item.rolename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名:" prop="username" label-width="90px">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password" label-width="90px">
          <el-input v-model="form.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态:" label-width="90px">
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
      // value: "",
      form: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
      status: true, //开关状态
      list: [], //请求数据,按pid分类,(渲染表单下拉项)
      total: 0, // 分页总数
      page: 1, //当前显示页数
      size: 2, //每页显示几条
      rules: {//验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password:[
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    // 请求数据赋给data
    this.getData(this.size, this.page);
    this.getCount();
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
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    //请求数据渲染表格
    getData(size, page) {
      this.$http
        .get("/api/userlist", { params: { size, page } })
        .then((res) => {
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
    // 计算总条数
    getCount() {
      this.$http.get("/api/usercount").then((res) => {
        this.total = res.list[0].total;
      });
    },
    // 页数发生变化触发
    currentChange(val) {
      this.getData(this.size, val);
      this.getCount();
    },
    //点击添加打开
    open() {
      this.txt = "添加";
      // 获取渲染数据在监听
      this.show = true;
    },
    //获取数据渲染对话框
    getlist() {
      this.$http.get("/api/rolelist").then((res) => {
        this.list = res.list;
      });
    },
    //根据下拉选择,修改form.roleid
    changeRoleid(val) {
      this.form.roleid = val;
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
        if (valid) {
      let url = "";
      // 判断from是否有id
      if (this.form.id) {
        //修改
        url = "/api/useredit";
      } else {
        //添加
        url = "/api/useradd";
      }
      this.$http.post(url, this.form).then((res) => {
        if (res.code == 200) {
          //添加成功
          this.$message({
            type: "success",
            message: res.msg,
          });

          this.$http.get("/api/usercount").then((res) => {
            // console.log(res.list)
            this.total = res.list[0].total;
            if ( res.list[0].total % this.size != 0) {
              this.page = Math.ceil( res.list[0].total/ this.size);
            }
            this.getData(this.size, this.page); //重新获取数据渲染表格
          });
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
    // 编辑
    handleEdit(val) {
      let obj={...val};
      // 获取当前行内容赋给表单
      this.txt = "修改"; //对话框文本
      obj.password = "";
      // 获取渲染数据在监听
      this.form = obj;
      this.status = obj.status == 1 ? true : false;
      this.show = true;
    },
    // 删除
    handleDelete(val) {
      this.$http.post("/api/userdelete", { id: val.id }).then((res) => {
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
       this.$http.get("/api/usercount").then((res) => {
            this.total = res.list[0].total;
              this.page =Math.ceil(res.list[0].total/ this.size)
            // }
            this.getData(this.size, this.page); //重新获取数据渲染表格
          });
      // this.getData(this.size, this.page); //重新获取数据渲染表格
      // this.getCount(); //重新获取列表渲染
    },
  },
};
</script>

<style lang="stylus" scope>
.btn {
  margin: 10px 0;
}

.pagination {
  position: absolute;
  right: 10px;
  bottom: 20px;
}
</style>