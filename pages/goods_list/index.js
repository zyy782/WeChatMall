/**
 * -----------用户上滑页面  滚动条触底加载下一页数据-------------
 *     1.找到滚动触底事件（官方开发文档）
 *     2.判断有无下一页
 *            获取总页数与当前页码 判断当前页数是否大于总页数
 *             总页数 = Math.ceil(总条数 /  页容量  pagesize)
               总页数 = Math.ceil( 23 / 10 ) = 3 
 *     3.无则弹出提示   
       4.有则加载下一页数据
            当前页面++       
            重新发送请求       
            数据请求回来   要对data中的数组进行拼接 而不是全部替换

   ------------下拉刷新页面---------------------------------------
       1.触发下拉刷新事件
       2.重置 数据 数组
       3.重置页码为1
       4.重新发送请求
       5.s数据请求回来 手动关闭等待效果
 */

import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    // !!!!!!!!!!!!!!1goods_list
    goodsList:[]

  },
  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
//总页数
totalPages:1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsList();

  },
//获取商品列表数据
async getGoodsList(){
  const res = await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/search",data:this.QueryParams});
  //获取总条数
  const total=res.data.message.total;
  //计算总页数
  this.totalPages = Math.ceil(total/this.QueryParams.pagesize);
  this.setData({
    //!!data.message
    //拼接数组
    goodsList:[...this.data.goodsList,...res.data.message.goods]
  })
  //关闭下拉刷新的窗口
  wx.stopPullDownRefresh();

},

  //标题的点击事件
  handleTabsItemChange(e){
    //1.获取被点击的标题索引
    const {index}=e.detail;
    //2.修改原数组
    let {tabs}=this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    //3.赋值到data中
    this.setData({
      tabs
    })
  },
  //页面上滑 滚动条触发事件
  onReachBottom(){
    //判断有无下一页
    if(this.QueryParams.pagenum>=this.totalPages){
      wx.showToast({
        title: '没有下一页数据',
      });
    }else{
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  //页面下拉刷新
  onPullDownRefresh(){
       //重置数组
    this.setData({
      goodsList:[]
    })
    //重置页码
    this.QueryParams.pagenum=1;
    //重新发送请求
    this.getGoodsList();
  }

})