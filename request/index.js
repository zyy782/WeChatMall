//同时发送异步代码的次数
let ajaxTimes=0;

// 异步请求 es6封装优化
export const request=(params)=>{
    ajaxTimes++;
    //加载中效果
    wx.showLoading({
        title: '加载中',
        mask: true
      });

    //定义公共的url
    //const baseUrl="https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resove,reject)=>{
        wx.request({
          ...params,
          success:(result)=>{
              resove(result);
          },
          fail:(err)=>{
              reject(err);
          },
          complete:()=>{
            ajaxTimes--;
              //关闭正在等待的图标
              if(ajaxTimes===0){
                wx.hideLoading();
              }
          }
        });

    })
}
