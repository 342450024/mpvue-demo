<template>
  <div class="container">
    <div class="userinfo">
       <img :src="userinfo.avatarUrl" alt="">
       <p>{{userinfo.nickName}}</p>
    </div>
    <YearProgress></YearProgress>
    <button v-if='userinfo.openId' class="btn" @click='scanBook'>添加图书</button>
    <button @getuserinfo="bindGetUserInfo"
open-type="getUserInfo" type="primary">用户授权</button>



  </div>
</template>

<script>
import {get,showSuccess,post,showModal} from '@/util'
import qcloud from 'wafer2-client-sdk'
import config from '@/config'
import YearProgress from '@/components/YearProgress.vue'
export default {


  data () {
    return {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      userinfo: {
        avatarUrl:'../../../static/img/unlogin.png',
        nickName:'哈哈'
      }
    }
  },
  components:{
  YearProgress
  },
  mounted(){
    // 一进来看看用户是否授权过
    // this.getSetting()
  },
  methods:{
    //   getSetting(){
    //   wx.getSetting({
    //     success: function(res){
    //       if (res.authSetting['scope.userInfo']) {
    //         wx.getUserInfo({
    //           success: function(res) {
    //             console.log(res.userInfo)
    //             //用户已经授权过
    //             console.log('用户已经授权过')
    //           }
    //         })
    //       }else{
    //         console.log('用户还未授权过')
    //       }
    //     }
    //   })

    // },
    bindGetUserInfo(e) {
      // console.log(e.mp.detail.rawData)
      if (e.mp.detail.rawData){
        //用户按了允许授权按钮
        this.login();
      } else {
        //用户按了拒绝按钮
        console.log('用户按了拒绝按钮')
      }
    },
    login(){
     let user = wx.getStorageSync('userinfo')
     const _this = this;
    if(!user){
    qcloud.setLoginUrl(config.loginUrl);
    qcloud.login({
            success:(res)=>{

                // wx.setStorageSync('userinfo',res);
                // this.userinfo = res;
                qcloud.request({
                  url:config.userUrl,
                  login:true,
                  success(userRes){
                  showSuccess('登录成功');
                  wx.setStorageSync('userinfo',userRes.data.data);
                  _this.userinfo = userRes.data.data;
                  },
                  fail(err){

                  }
                })
            },
            fail:(err)=>{
                console.log('失败',err)

            }
        })
        }
    },
    async addBook(isbn){
       const res = await post('/weapp/addbook',{
        isbn,
        openid:this.userinfo.openId
       })
        showModal('添加成功',`${res.title}添加成功`)

    },
  scanBook(){
    // 允许从相机和相册扫码
  wx.scanCode({
  success: (res) => {
    if(res.result){

      this.addBook(res.result)
    }
  }
})
  }
  },
  created () {
    let userinfo = wx.getStorageSync('userinfo')
    if(userinfo){
  this.userinfo = wx.getStorageSync('userinfo')
    }

  }
}
</script>

<style>
.userinfo{
  text-align:center;
  margin-top:50rpx;
}
.userinfo img{
  width:150rpx;
  height:150rpx;
  margin:10rpx;
  border-radius:100%;
}
</style>
