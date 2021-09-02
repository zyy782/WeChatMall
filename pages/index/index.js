//引入用来发送请求的方法  一定要把路径补全
import{request} from "../../request/index.js"

wx-Page({

  data: {
    //轮播图数组
    swiperList:[],
    //导航数组
    cateList:[],
    //楼层数组
    floorList:[]
    
  },

  /**
   * 生命周期函数--监听页面加载
   * 页面加载时触发
   */
  onLoad: function (options) {
    //发送异步请求 获取轮播图数据wx.rewuest
    //优化手段可通过es6的promise来解决
   /** 
    var reqTask = wx.request({
      url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
      success: (result)=>{
        this.setData({
          swiperList:result.data.message
        })
        
      },
     
    });
    */
   this.getSwiperList();
   this.getcateList();
   this.getfloorList();
  },
//获取轮播图数据
getSwiperList(){
  request({url:"https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata"})
  .then(result=>{
   this.setData({
     swiperList:result.data.message
   })
  })
},
//获取分类导航数据
getcateList(){
  request({url:"https://api-hmugo-web.itheima.net/api/public/v1/home/catitems"})
  .then(result=>{
   this.setData({
    cateList:result.data.message
   })
  })
},
//获取楼层数据
getfloorList(){
  request({url:"https://api-hmugo-web.itheima.net/api/public/v1/home/floordata"})
  .then(result=>{
   this.setData({
    floorList:result.data.message
   })
  })
},
}) 