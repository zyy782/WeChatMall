import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
  data: {
    // 左侧的菜单数据
    leftMenuList:[],
    // 右侧的商品数据
    rightContent:[],
    //被点击的左侧菜单
    currentIndex:0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop:0
  },
  // 接口的返回数据
  Cates:[],

  onLoad: function (options) {
    /**
     * web中本地存储 与小程序本地存储的区别：
     *     1代码方式不一样
     *     web: localStorage.setItem("key","value") localStorage.getItem("key")
           小程序中: wx.setStorageSync("key", "value"); wx.getStorageSync("key");
           2:存的时候 有没有做类型转换
           web: 不管存入的是什么类型的数据，最终都会先调用以下 toString(),把数据变成了字符串 再存入进去
           小程序: 不存在 类型转换的这个操作 存什么类似的数据进去，获取的时候就是什么类型
     * 1.先判断本地存储中有没有旧数据
     * {time:Date.now(),data:[...]}
     * 2.若无旧数据  直接发送新数据
     * 3.若有旧数据 且就数据未过期 就使用本地存储中的旧数据
     */
    //  1 获取本地存储中的数据  (小程序中也是存在本地存储 技术)
    const Cates = wx.getStorageSync("cates");
    // 2 判断
    if (!Cates) {
      // 不存在  发送请求获取数据
      this.getCates();
    } else {
      // 有旧的数据 定义过期时间  10s 改成 5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发送请求
        this.getCates();
      } else {
        // 可以使用旧的数据
        this.Cates = Cates.data;
        let leftMenuList = this.Cates.map(v => v.cat_name);
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    
  },
  // 获取分类数据
  async getCates() {
   
    /** 
    request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/categories"
    })
      .then(res => {
        this.Cates = res.data.message;
        
        //把接口中的数据存入到本地存储中
        wx.getStorageSync("cates",{time:Date.now(),data:this.Cates})

        // 构造左侧的大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 构造右侧的商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      })
      */


      //使用es7的async await来发送请求
      const res=await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/categories"});
      this.Cates = res.data.message;
        
      //把接口中的数据存入到本地存储中
      wx.getStorageSync("cates",{time:Date.now(),data:this.Cates})

      // 构造左侧的大菜单数据
      let leftMenuList = this.Cates.map(v => v.cat_name);
      // 构造右侧的商品数据
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent
      })
    },
    //左侧菜单的点击事件
    handleItemTap(e){
      //1获取被点击的标题的索引
      //2给data中的currentIndex赋值
      //3根据不同的索引渲染右侧商品内容
      const {index}=e.currentTarget.dataset;
      let rightContent = this.Cates[index].children;

      this.setData({
        currentIndex:index,
        rightContent,
        //重新设置  右侧内容的scroll-view标签的到顶部的距离
        scrollTop:0
      })
      
      
    }
  })