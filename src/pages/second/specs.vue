<template>
  <div class="specs">
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to>规格列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <div class="btn">
      <el-button type="primary" @click="open">添加</el-button>
    </div>
    <!-- 表格 -->
    <el-table :data="data" style="width: 100%" row-key="id" border lazy>
      <el-table-column prop="specsname" label="属性名称" width="150px">
        <!-- <template slot-scope="scope">
						{{ scope.row.specsname }}
          </template>
        等同于 prop="specsname"-->
        <!-- 
            表格:prop	对应列内容的字段名，也可以使用 property 属性(渲染数据)
            表单:prop	表单域 model 字段，在使用 validate、resetFields 方法的情况下，该属性是必填的(绑定验证规则)
        -->
      </el-table-column>
      <el-table-column label="属性值" width="150px">
        <template slot-scope="scope">
          <el-tag v-for="(item,index) in scope.row.attrs" :key="index" type="success">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="type" width="150px" label="状态">
        <template slot-scope="scope">
          <el-tag effect="dark" v-if="scope.row.status==1" type="success">启用</el-tag>
          <el-tag effect="dark" v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
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
      <el-form :model="form" label-width="80px" ref="form" :rules="rules">
        <el-form-item label="属性名称:" label-width="90px" prop="specsname">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>
        <el-form-item label="属性值:" label-width="90px">
          <div v-for="(item,index) in form.attrs" :key="index" class="attr-box">
            <el-input v-model="item.value" autocomplete="off"></el-input>
            <el-button dark type="primary" v-if="index==0" @click="attrAdd(index)">属性添加</el-button>
            <el-button dark type="danger" v-else @click="attrDelete(index)">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item>
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
        specsname: "",
        attrs: [{ value: "" }],
        status: 1,
      },
      status: true, //开关状态
      rules: {
        specsname: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
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
      } else {
        this.resetForm(); //关闭清除数据
      }
    },
  },
  methods: {
    //重置form
    resetForm() {
      this.form = {
        specsname: "",
        attrs: [{ value: "" }],
        status: 1,
      };
    },
    //请求数据渲染表格
    getData() {
      this.$http
        .get("/api/specslist", { params: { size: 10, page: 1 } })
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
    //点击添加打开
    open() {
      this.txt = "添加";
      // 获取渲染数据在监听
      this.show = true;
    },
    //属性添加
    attrAdd(index) {
      if (this.form.attrs[index].value) {
        this.form.attrs.unshift({ value: "" });
      } else {
        this.$message({
          type: "error",
          message: "属性值不能为空",
        });
      }
    },
    //属性删除
    attrDelete(index) {
      this.form.attrs.splice(index, 1);
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
    //确定提交,清空form,关闭对话框
    handleAdd(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          // 判断from是否有id
          let url = this.form.id ? "/api/specsedit" : "/api/specsadd";
          this.form.attrs.splice(0, 1); //清除第一个空值
          this.form.attrs = this.form.attrs.map((item) => item.value).join(",");
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
        } else {
          //验证失败
          this.$message({
            type: "error",
            message: "格式有误,请输入正确格式",
          });
          return false;
        }
      });
      //清空在监听器中操作
      this.show = false;
    },
    // 编辑
    handleEdit(val) {
      let obj={...val}
      this.txt = "修改"; //对话框文本
      let arr = obj.attrs.map((item) => {
        return { value: item };
      });
      this.form.specsname = obj.specsname;
      this.form.id = obj.id;
      this.form.status = obj.status;
      this.form.attrs = arr;
      this.form.attrs.unshift({ value: "" }); //加一项空值
      this.status = obj.status == 1 ? true : false;
      this.show = true;
    },
    // 删除
    handleDelete(val) {
      this.$http.post("/api/specsdelete", { id: val.id }).then((res) => {
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

.attr-box .el-input {
  width: 200px;
}
</style>
