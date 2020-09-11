<template>
  <div class="goods">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
      <el-breadcrumb-item to>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="btn">
      <el-button type="primary" @click="open">添加</el-button>
    </div>
    <el-table :data="data" style="width:100%">
      <el-table-column prop="firstcatename" label="一级分类" width="150px"></el-table-column>
      <el-table-column prop="secondcatename" label="二级分类" width="150px"></el-table-column>
      <el-table-column prop="goodsname" label="商品名称" width="150px"></el-table-column>
      <el-table-column prop="price" label="销售价" width="150px"></el-table-column>
      <el-table-column prop="market_price" label="市场价" width="150px"></el-table-column>
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
    <el-dialog
      :title="'商品'+txt"
      :visible.sync="show"
      width="60%"
      @opened="opened"
    >
      <el-form :model="form" label-width="80px" ref="form" :rules="rules">
        <!-- 一级分类 -->
        <el-form-item label="一级分类" label-width="90px">
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
        <el-form-item label="二级分类" label-width="90px">
          <el-select v-model="form.second_cateid" placeholder="请选择二级分类">
            <el-option
              v-for="item in secondList"
              :label="item.catename"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品名称 -->
        <el-form-item label="商品名称:" label-width="90px" prop="goodsname">
          <el-input v-model="form.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 图片上传 -->
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
                <!-- 删除 -->
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
        <!-- 商品规格名 -->
        <el-form-item label="规格名" label-width="90px">
          <el-select v-model="form.specsid" placeholder="请选择规格名" @change="getSpecsattrList">
            <el-option
              v-for="item in specsIdlist"
              :label="item.specsname"
              :key="item.id"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品规格值 -->
        <el-form-item label="规格值" label-width="90px">
          <el-select v-model="form.specsattr" placeholder="请选择规格值">
            <el-option v-for="item in specsattrList" :label="item" :key="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售价:" label-width="90px" prop="price">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="市场价:" label-width="90px" prop="market_price">
          <el-input v-model="form.market_price" autocomplete="off"></el-input>
        </el-form-item>

        <!-- 新品热卖 
        :disabled="form.type!=1"禁用属性
        -->

        <el-form-item label="是否新品:" label-width="90px">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖:" label-width="90px">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="商品描述" label-width="90px">
          <!-- 富文本编译器的容器 -->
          <div id="editor" ref="editorElem" style="text-align:left"></div>
        </el-form-item>

        <el-form-item label="状态:" label-width="90px">
          <!-- <el-radio v-model="form.status" :label="1">上架</el-radio>
          <el-radio v-model="form.status" :label="2">下架</el-radio>-->
          <p>{{form.status}}</p>
          <el-radio-group v-model="form.status">
            
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="2">下架</el-radio>
          </el-radio-group>
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
// import $ from 'jquery'
import axios from "axios";
import E from "wangeditor";
export default {
  data() {
    return {
      show: false,
      txt: "添加",
      data: [],
      // 富文本编译器实例
      editor: null,
      form: {
        first_cateid: "", //一级分类编号
        second_cateid: "", //二级分类编号
        goodsname: "", //商品名称
        img: "", //商品图片（文件）
        specsid: "", //商品规格编号
        specsattr: "", //商品规格属性值
        price: "", //商品价格
        market_price: "", //市场价格
        isnew: 2, //是否新品
        ishot: 2, //是否热卖推荐
        description: "", //商品描述
        status: 1, //状态
      },
      firstList: [], //一级分类
      secondList: [], //二级分类
      fileList: [], //图片缩略图数组
      dialogImageUrl: "", //预览图片路径
      dialogVisible: false, //预览图片显示
      specsIdlist: [], //规格名
      specsattrList: [], //规格值
      total: 0, // 分页总数
      page: 1, //当前显示页数
      size: 3, //每页显示几条
      rules: {
        goodsname: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        price: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        market_price: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    show() {
      //监听对话窗
      if (this.show) {
        //打开
        this.getList();
        this.getSpecs();
      } else {
        //关闭
        this.resetForm();
        this.fileList = []; //关闭清图片缩略图数组
      }
    },
  },
  mounted() {
    this.getData(this.size, this.page);
    this.getCount();
  },
  methods: {
    //重置form
    resetForm() {
      this.form = {
        first_cateid: "", //一级分类编号
        second_cateid: "", //二级分类编号
        goodsname: "", //商品名称
        img: "", //商品图片（文件）
        specsid: "", //商品规格编号
        specsattr: "", //商品规格属性值
        price: "", //商品价格
        market_price: "", //市场价格
        isnew: 2, //是否新品
        ishot: 2, //是否热卖推荐
        description: "", //商品描述
        status: 1, //状态
      };
    },
    getData(size, page) {
      //渲染表格
      this.$http
        .get("/api/goodslist", { params: { size, page } })
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
      this.$http.get("/api/goodscount").then((res) => {
        this.total = res.list[0].total;
      });
    },
    // 页数发生变化触发
    currentChange(val) {
      this.getData(this.size, val);
      this.getCount();
    },
    //获取表单渲染数据
    getList(pid = 0) { //默认先获取一级数据,一级选择再获取二级数据
      this.$http.get("api/catelist", { params: { pid } }).then((res) => {
        if (pid == 0) {
          this.firstList = res.list; //一级分类数据
        } else {
          this.secondList = res.list; //二级分类数据
        }
      });
    },
    getSecondList(val) { //得到二级id
      this.form.second_cateid = "";
      this.secondList = []; //一级改变会自动触发查找二级,为了保险,先清一下二级数组
      this.getList(val);
    },
    getSpecs() { //获取规格列表数据
      this.$http.get("/api/specslist").then((res) => {
        this.specsIdlist = res.list;
      });
    },
    getSpecsattrList(val) { //得到规格值
      this.form.specsattr = "";
      this.$http.get("/api/specsinfo", { params: { id: val } }).then((res) => {
        this.specsattrList = res.list[0].attrs;
      });
    },
    open() { //打开
      this.show = true;
    },
    opened() { // 对话框打开渲染完毕执行,(异步)
      this.editor = new E("#editor");
      this.editor.customConfig.onchange = (html) => {
        this.form.description = html;
      };
      this.editor.create();
      this.editor.txt.html(this.form.description);
    },
    imgUpload(val) {  // 提交图片
      document.querySelector(".thumbnail ul").innerHTML = "";
      this.form.img = val.raw; //值赋给提交表单
    },
    handlePictureCardPreview(file) {  //预览图显示隐藏
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file) {  //删除上传图片
      this.fileList = []; //清空数组
      this.form.img = ""; //清空表单提交的img数据
    },
    //取消
    handleCancel() {
      this.show = false;
    },
    //确定提交
    handleAdd(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          let url = "";
          if (this.form.id) {
            url = "/api/goodsedit";
          } else {
            url = "/api/goodsadd";
          }
          let formData = new FormData();
          for (let key in this.form) {
            formData.append(key, this.form[key]);
          }
          axios({
            method: "post", //提交方式
            url, //路径
            data: formData, //提交数据(表单提交对象)
            headers: {
              Authorization: sessionStorage.getItem("token"),
              "Content-Type": "multipart/form-data", //文件上传选择该类型
            },
          }).then((res) => {
            if (res.code == 200) { //添加成功
              this.$message({
                type: "success",
                message: res.msg,
              });
              this.getData(); //重新获取数据渲染表格
            } else {
              this.$message({ //添加失败
                type: "warn",
                message: res.msg,
              });
            }
          });
        } else { //验证失败
          this.$message({
            type: "error",
            message: "格式有误,请输入正确格式",
          });
          return false;
        }
      });
      this.show = false;
    },
    //编辑
    handleEdit(val) {
      //删除多余的两项数据
      let obj={...val}//请求数据仅作为展示,不可去直接修改
      delete obj.firstcatename;
      delete obj.secondcatename;
      this.getSecondList(obj.first_cateid); //重新获取二级分类
      this.getSpecsattrList(obj.specsid); //重新获取规格值
      let url = "http://localhost:3000" + obj.img; //图片预览路径
      this.form = obj;
      if (this.form.img != "") {
        this.fileList = [{ name: "", url }];
      }
      this.show = true;
    },
    //删除
    handleDelete(val) {
      this.$http.post("/api/goodsdelete", { id: val.id }).then((res) => {
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
    // 页数发生变化触发
    currentChange(val) {
      this.getData(this.size, val);
      this.getCount();
    },
  },
};
</script>
<style lang="stylus" scope>
.btn {
  margin: 10px 0;
}
</style>
