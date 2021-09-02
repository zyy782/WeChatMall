/**
 * 1.发送请求 获取数据
 * 2.点击轮播图 预览大图
 *       1.给轮播图绑定点击事件
 *       2.调用小程序的api  previewImage
 * 3.加入购物车
 *       1.绑定点击事件
 *       2.获取缓存中的购物车数据   数组格式
 *       3.先判断   当前产品是否已经在购物车
 *       4.已存在，则修改商品数据  执行购物车数量++  重新把购物车数组填充回缓存中
 *       5.不存在与购物车数组中  直接给购物车数组添加一个新元素（带有购买数量属性 num）重新把购物车数组填充回缓存中
 *       6.弹出提示
 * 4.商品收藏
 *       1.页面onShow()的时候  加载缓存中的商品收藏数据
 *       2.判断当前商品是否被收藏
 *           1.是   改变页面图标
 *           2.不是
 *       3.点击商品收藏按钮
 *           1.判断该商品是否存在与缓存数组中
 *           2.已存在把该商品删除
 *           3.没有存在 把商品加入到收藏数组中  存入缓存即可
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    // 商品是否被收藏
    isCollect:false

  },
//商品对象
GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages= getCurrentPages();
    let currentPage=pages[pages.length-1];
    let options=currentPage.options;

    const {goods_id}=options;
    this.getGoodsDetail(goods_id);
  },
  //获取商品的详情数据
  async getGoodsDetail(goods_id){
    const goodsObj = await request({url:"https://api-hmugo-web.itheima.net/api/public/v1/goods/detail?goods_id=43986",data:{goods_id}});
    this.GoodsInfo=goodsObj.data.message;  
    // 1.获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    //2.判断当前商品是否被收藏
    let isCollect = collect.some(v=>v.goods_id === this.GoodsInfo.goods_id);

    this.setData({
      goodsObj:goodsObj.data.message,
      isCollect
    })
    // this.setData({
    //   goodsObj: {
    //     goods_name: goodsObj.goods_name,
    //     goods_price: goodsObj.goods_price,
    //     // iphone部分手机 不识别 webp图片格式 
    //     // 最好找到后台 让他进行修改 
    //     // 临时自己改 确保后台存在 1.webp => 1.jpg 
    //     goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
    //     pics: goodsObj.pics
    //   },
    //   isCollect
    // })
  },
  //点击轮播图 放大预览
  handlepreviewImage(e){
    //构造要预览的图片数组
    const urls =this.GoodsInfo.pics.map(v=>v.pics_mid);
    //接受传递过来的图片url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },
  //加入购物车
  handleCartAdd(){
    //1.huoqu缓存中的购物车数组
    let cart=wx.getStorageSync("cart")||[];
    //2.判断商品对象是否已存在与购物车中
    let index=cart.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    if(index===-1){//3.不存在 第一次添加
      this.GoodsInfo.num=1;

    //  this.GoodsInfo.checked = true;

      cart.push(this.GoodsInfo);
    }else{//4.已存在  num++
      cart[index].num++;
    } 
    //5.把购物车添加回缓存中
    wx.setStorageSync("cart",cart);
    //6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      //true防止用户手抖  疯狂点击按钮
      mask: true,
    });
  },
  //点击 商品收藏数组
  handleCollect(){
    let isCollect = false;
    //获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collect") || [];
    //判断该商品你是否被收藏
    let index =collect.findIndex(v=>v.goods_id===this.GoodsInfo.goods_id);
    //当index!=-1 表示已被收藏
    if(index!==-1){
      //删除该商品
      collect.splice(index,1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true,
      });
    }else{
      //添加
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true,
      });
    }
    //把数组存入到缓存中
    wx.setStorageSync("collect", collect);
    //修改data中的属性 isCollect
    this.setData({
      isCollect
    })


  }

})
