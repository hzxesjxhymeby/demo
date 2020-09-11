<template>
  <div class="member">
    <!-- 菜单管理 -->
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to>会员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表格 -->
    <el-table :data="data" style="width: 100%">
      <el-table-column prop="nickname" label="昵称" width="150px"></el-table-column>
      <el-table-column prop="phone" label="手机号" width="150px"></el-table-column>
      <el-table-column prop="addtime" label="注册日期" width="150px"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope" width="150px">
          <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 对话框 -->
    <el-dialog :title="'会员'+txt" :visible.sync="show" width="50%">
      <!-- 对话框提交数据 -->
      <el-form :model="form" label-width="80px">
        <el-form-item label="昵称:">
          <el-input v-model="form.nickname" autocomplete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="手机号:">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码:">
          <el-input v-model="form.password" autocomplete="off"></el-input>
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
      data: [], //表格渲染数据
      show: false, //对话框显示隐藏
      txt: "添加", //对话框文本
      form: {
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
      status: true, //开关状态
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
        // this.getlist(); //打开获取渲染数据
      } else {
        this.resetForm(); //关闭清除数据
      }
    },
  },
  methods: {
    //重置form
    resetForm() {
      this.form = {
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      };
    },
    //请求数据渲染表格
    getData() {
      this.$http
        .get("/api/memberlist", { params: { size: 10, page: 1 } })
        .then((res) => {
          if (res.code == 200) {
            res.list.map((item) => {
              let time = new Date(Number(item.addtime));
              let Y = time.getFullYear();
              let M = time.getMonth() + 1;
              let D = time.getDate();
              let H = time.getHours();
              let min = time.getMinutes();
              let s = time.getSeconds();
              let timestr = `${Y}-${M}-${D} ${H}:${min}:${s}`;
              item.addtime = timestr;
            });
            this.data = res.list;
          } else {
            this.$message({
              type: "warn",
              message: res.msg,
            });
          }
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
    //取消清空内容
    handleCancel() {
      //清空在监听器中操作
      this.show = false;
    },
    //确定添加,清空form,关闭对话框
    handleAdd() {
      this.$http.post("/api/memberedit", this.form).then((res) => {
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
      //清空在监听器中操作
      this.show = false;
    },
    // 编辑
    handleEdit(val) {
      let obj ={...val}
      this.txt = "修改"; //对话框文本
      this.$http.get("/api/memberinfo?uid=" + obj.uid).then((res) => {
        this.form.uid = res.list.uid;
        this.form.nickname = res.list.nickname;
        this.form.phone = res.list.phone;
        this.status = res.list.status == 1 ? true : false;
      });
      this.show = true;
    },
  },
};
</script>
<style lang="stylus" scope>
.btn {
  margin: 10px 0;
}
</style>
