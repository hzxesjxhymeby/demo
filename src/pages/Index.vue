<template>
  <div class="index">
    <el-row class="indexContent" type="flex" justify="space-between">
      <el-col :span="11" class="box">
        <h2>商品总览</h2>
        <div class="grid-content bg-purple">
          <el-row type="flex" justify="center">
            <el-col :span="6" v-for="(item,index) in table1" :key="index" align="middle" class="tablelist">
              <div class="grid-content bg-purple">{{item.num}}</div>
              <div class="grid-content bg-purple">{{item.title}}</div>
            </el-col>
          </el-row>
        </div>
      </el-col>
      <el-col :span="11" class="box">
        <h2>用户总览</h2>
        <div class="grid-content bg-purple">
          <el-row type="flex" justify="center">
            <el-col :span="6" v-for="(item,index) in table2" :key="index" align="middle" class="tablelist">
              <div class="grid-content bg-purple">{{item.num}}</div>
              <div class="grid-content bg-purple">{{item.title}}</div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>
    <div id="echbox"></div>
  </div>
</template>
<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      table1: [
        { num: 100, title: "已下架" },
        { num: 100, title: "已上架" },
        { num: 100, title: "库存紧张" },
        { num: 100, title: "全部商品" },
      ],
      table2: [
        { num: 100, title: "今日新增" },
        { num: 100, title: "昨日新增" },
        { num: 100, title: "本月新增" },
        { num: 100, title: "会员总数" },
      ],
    };
  },
  mounted(){
    //初始化图表实例
    let echbox=echarts.init(document.getElementById('echbox'));
    let option={
      toolbox:{
          feature:{
              saveAsImage:{}//下载控件
          },
          width:30,
          right:80 //控件位置
      },
      legend:{//说明
          data:["销量","退货"]
      },
      xAxis:{//x轴标题
        data:['周一','周二','周三','周四','周五','周六','周日'],
        boundaryGap:false//掐头去尾
      },
      yAxis:{//y轴标题

      },
      color:['#222','red'],//颜色
      series:[{//数据
        name:'销量',//数据标题
        type:'line',//图表类型
        data:[500,100,900,700,300,200,800]
      },{//数据
        name:'退货',//数据标题
        type:'line',//图表类型
        data:[15,30,90,69,40,100,28]
      }]

    }
    echbox.setOption(option) //图表实例使用此模板
  }
};
</script>
<style lang="stylus">
.index {
  width: 100%;
  height: 100%;
  background-color: #ccc;
  overflow hidden
}

.indexContent 
  width: 900px;
  height: auto;
  margin 10px 0 20px
  left: 50%;
  transform: translate(-50%, 0);
  .box.el-col{
    border:1px solid #000
    height:100px
  }
.tablelist div 
  height 30px
  line-height: 30px
h2{
  background-color #f2f6fc
  height 40px
  line-height: 40px
}
#echbox
 width 900px
 height: 300px
 margin 0 auto
 background-color #eee
</style>
