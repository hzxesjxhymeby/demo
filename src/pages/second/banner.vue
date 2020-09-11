<template>
  <div class="banner">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to>轮播图管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <div class="btn">
      <el-button type="primary" @click="open">添加</el-button>
    </div>
    <el-table :data="data" style="width:100%">
      <el-table-column prop="title" label="名称" width="180px"></el-table-column>
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
      <el-form :model="form" label-width="80px">
        <el-form-item label="轮播标题:">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="轮播图片:">
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

                <!-- 删除 -->
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
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

        <el-form-item label="状态:">
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
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      data: [], //表格数据
      show: false, //对话框状态
      txt: "添加", //对话框左上角文本
      form: {
        title: "",
        img: "",
        status: 1,
      },
      status: true, //开关
      fileList: [],
      //预览图片路径
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
    };
  },
  mounted() {
    this.getData();
  },
  watch: {
    show() {
      //监听对话框关闭状态,重置form
      if (this.show) {
      } else {
        this.resetForm();
        this.fileList = [];
      }
    },
  },
  methods: {
    //重置form
    resetForm() {
      this.form = {
        title: "",
        img: "",
        status: 1,
      };
    },
    //获取数据渲染表格
    getData() {
      this.$http.get("/api/bannerlist").then((res) => {
        this.data = res.list;
      });
    },
    //点击添加打开对话框
    open() {
      this.txt = "添加";
      this.show = true;
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
      this.fileList = [];
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
    // 取消
    handleCancel() {
      this.show = false;
    },
    // 确认提交
    handleAdd() {
      // 判断from是否有id
      let url = "";
      if (this.form.id) {
        url = "/api/banneredit";
      } else {
        url = "/api/banneradd";
      }
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
    //删除
    handleDelete(val) {
      this.$http.post("/api/bannerdelete", { id: val.id }).then((res) => {
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