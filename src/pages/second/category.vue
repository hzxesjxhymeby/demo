<template>
  <div class="category">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to>分类列表</el-breadcrumb-item>
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
      <el-table-column prop="catename" label="分类名称" width="150px"></el-table-column>
      <el-table-column prop="status" label="状态" width="150px">
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
    <!-- @close=""element对话框关闭回调 -->
    <el-dialog :title="'菜单'+txt" :visible.sync="show" width="50%">
      <!-- 对话框提交数据 -->
      <el-form :model="form" label-width="80px" ref="form" :rules="rules">
        <el-form-item label="上级分类:" label-width="90px">
          <el-select v-model="form.pid" @change="changePid" placeholder="请选择">
            <el-option label="顶级菜单" :value="0" label-width="90px"></el-option>
            <el-option v-for="item in data" :key="item.id" :label="item.catename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称:" label-width="90px" prop="catename">
          <el-input v-model="form.catename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="分类图片:" label-width="90px">
          <!-- action提交地址, auto-upload是否自动提交 limit:1/:on-exceed="exceed"-->
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
            :on-change="imgUpload"
            :file-list="fileList"
            class="thumbnail"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <!-- 缩略图 -->
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
              <span class="el-upload-list__item-actions">
                <!-- 放大 -->
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <!-- 删除 v-if="!disabled"-->
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
          <!-- 放大显示遮罩和图片 -->
          <!-- append-to-body多重遮罩解决方法 -->
          <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
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
import axios from "axios";
export default {
  data() {
    return {
      data: [], //表格渲染数据
      show: false, //对话框显示隐藏
      txt: "添加", //对话框文本
      form: {
        pid: "",
        catename: "",
        img: "",
        status: 1,
      },
      status: true, //开关状态
      fileList: [],
      dialogImageUrl: "", //预览图片路径
      dialogVisible: false, //预览图片显示
      rules: {
        catename: [
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
        // this.getlist(); //打开获取渲染数据
      } else {
        setTimeout(() => {
          this.getData(); //重新获取表格数据
          this.resetForm(); //关闭清除数据
          this.fileList = [];
        });
      }
    },
  },
  methods: {
    //重置form
    resetForm() {
      this.form = {
        pid: "",
        catename: "",
        img: "",
        status: 1,
      };
    },
    //请求数据渲染表格
    getData() {
      this.$http.get("/api/catelist", { params: { istree: 1 } }).then((res) => {
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
      this.show = true; // 获取渲染数据在监听
    },
    //根据下拉选择,修改form.pid
    changePid(val) {
      this.form.pid = val;
    },
    // 提交图片
    imgUpload(val) {
      document.querySelector(".thumbnail ul").innerHTML = "";
      this.form.img = val.raw; //值赋给提交表单
    },
    //预览图显示隐藏
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //删除上传图片
    handleRemove(file) {
      this.fileList = []; //清空数组
      this.form.img = ""; //清空表单提交的img数据
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
      this.show = false; //清空在监听器中操作
    },
    //确定添加,清空form,关闭对话框
    handleAdd(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
      // 判断from是否有id
      let url = this.form.id ? "/api/cateedit" : "/api/cateadd";
      // 创建表单数据提交对象
      let formData = new FormData();
      // 遍历form将数据append到表单提交对象内
      for (let key in this.form) {
        formData.append(key, this.form[key]);
      }
      // 原生上传添加
      // formDate.append("img",this.$refs.upload.files[0])
      //上传图片,改写axios提交方式,(注意,要引入)
      axios({
        method: "post", //提交方式
        url, //路径
        data: formData, //提交数据(表单提交对象)
        headers: {
          Authorization: sessionStorage.getItem("token"),
          "Content-Type": "multipart/form-data", //文件上传选择该类型
        },
      }).then((res) => {
        if (res.code == 200) {
          //添加成功
          this.$message({
            type: "success",
            message: res.msg,
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
      //清空在监听器中操作//重新获取数据渲染表格()
      this.show = false;
    },
    // 编辑
    handleEdit(val) {
      let obj={...val}
      // 获取当前行内容赋给表单
      this.txt = "修改"; //对话框文本
      let url = "http://localhost:3000" + obj.img; //图片预览路径
      this.form = obj;
      this.status = obj.status == 1 ? true : false;
 // 返回值不为空才创建
      if (this.form.img != "") {
        this.fileList = [{ name: "", url }];
      }
      this.show = true;
    },
    // 删除
    handleDelete(val) {
      this.$http.post("/api/catedelete", { id: val.id }).then((res) => {
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
