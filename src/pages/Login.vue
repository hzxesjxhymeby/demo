<template>
  <div class="login">
    <div class="login-from">
      <h2>登录</h2>
      <!-- 

      -->
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="0"
        class="demo-ruleForm"
      >
        <el-form-item prop="username">
          <el-input v-model="ruleForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="ruleForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="u-primary" type="primary" @click="submitForm('ruleForm')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex"; //引入状态管理方法
export default {
  data() {
    return {
      ruleForm: {
        username: "",
        password: "",
      },
      rules: {
        //表单验证规则
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 8, message: "长度在 3 到8 个字符", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    ...mapMutations(["setInfo"]), //展开状态管理方法
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //验证成功则进行后续操作
          this.$http.post("/api/userlogin", this.ruleForm).then((res) => {
            if (res.code == 200) {
              //本地存储登录信息数据
              sessionStorage.setItem("token", JSON.stringify(res.list.token));
              sessionStorage.setItem("user", JSON.stringify(res.list));
              this.setInfo(); //调用状态管理函数
              this.$router.replace("/"); //跳转至首页
            } else {
              // 登录失败
              this.$message.error(res.msg);
            }
          });
        } else {
          this.$message.error("请输入正确格式账号及密码");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
  },
};
</script>

<style lang="stylus">
.login {
  width: 100%;
  height: 100%;
  background: -webkit-linear-gradient(bottom, #63a537, #44c1a3, #51c3f9);

  h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #fff;
  }

  .login-from {
    width: 300px;
    height: 300px;
    // background-color: #eee;
    position: absolute;
    left: 50%;
    top: 50%;
    margin-left: -150px;
    margin-top: -150px;
  }

  .u-primary {
    width: 300px;
  }
}
</style>
