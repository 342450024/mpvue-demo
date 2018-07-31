<template>
<div>
  <BookInfo :info='info'></BookInfo>
  <CommentList :comments="comments"></CommentList>
  <div class="comment" v-if='showAdd'>
    <textarea v-model='comment'
              class='textarea'
              :maxlength='100'
              placeholder='请输入图书短评'></textarea>
    <div class='location'>
      地理位置：
      <switch color='#EA5A49' :checked='location' @change='getGeo'></switch>
      <span class='text-primary'>{{location}}</span>
    </div>
    <div class='phone'>
      手机型号：
      <switch color='#EA5A49' :checked='phone' @change='getPhone'></switch>
      <span class='text-primary'>{{phone}}</span>
    </div>
    <button class="btn" @click='addComment'>
      评论
    </button>
  </div>
  <div v-else class='text-footer'>
    未登录或者已经评论过啦
  </div>
  <button open-type='share' class="btn">转发给好友</button>
</div>
</template>
<script>
import {get,post,showModal} from '@/util'
import BookInfo from '@/components/BookInfo'
import CommentList from '@/components/CommentList'
	export default{
		components:{
			BookInfo,
			CommentList
		},
		data(){
             return{
             	id:'',
             	info:{},
             	comment:'',
             	comments:[],
             	location:'',
             	phone:'',
             	userinfo:{}
             }
		},
		computed:{
           showAdd(){
            //没有登录
            if(!this.userinfo.openId){
               return false
            }
            //评论页面里查到有自己的openid
            if(this.comments.filter(v=>v.openid == this.userinfo.openId).length){
            	return false
            }
            return true
           }
		},
		methods:{
			async getComments(){
             const comments = await get('/weapp/commentlist',{bookid:this.id})
             this.comments = comments.list

			},
            async addComment(){
            if(!this.comment){
               return
            	}
             const data = {
             	openid:this.userinfo.openId,
             	bookid:this.id,
             	comment:this.comment,
             	phone:this.phone,
             	location:this.location
             }
             try{
               await post('/weapp/addcomment',data)
               this.comment = ''
               this.getComments()
             }catch(e){
               showModal('失败',e.msg)
             }

            },
			getGeo(e){
			const url = 'http://api.map.baidu.com/geocoder/v2/'
			const ak = 'D7wiUYuHGoz2h7s6bLiA9ECwp4grHq3Z'
			let _this = this;
             if(e.target.value){
               wx.getLocation({
				  success: function(res) {
				    let latitude = res.latitude
				    let longitude = res.longitude
				    wx.request({
				    	url,
				    	data:{
				    		ak,
				    		location:`${latitude},${longitude}`,
				    		output:'json'
				    	},
				    	success:res=>{

				    		if(res.data.status == 0){
                             _this.location = res.data.result.addressComponent.city
				    		}else{
				    		_this.location = '未知地点'
				    		}
				    	}
				    })
				  }
				})
              }else{
              	this.location = ''
              }
			},
			getPhone(e){
              if(e.target.value){
               const phone = wx.getSystemInfoSync().model
               this.phone = phone
              }else{
              	this.phone = ''
              }
			},
        async getDetail(){
        	const info = await get('/weapp/bookdetail',{id:this.id})
        	this.info = info
        	wx.setNavigationBarTitle({
        		title:info.title
        	})
        }
		},
		mounted(){
      this.id = this.$root.$mp.query.id
      this.getDetail()
      this.getComments()
      const userinfo = wx.getStorageSync('userinfo')
      if(userinfo){
      	this.userinfo = userinfo
      }
		}
	}
</script>
<style lang='scss'>
.comment{
  margin-top:10px;
  .textarea{
    width:730rpx;
    height:200rpx;
    background:#eee;
    padding:10rpx;
  }
  .location{
    margin-top:10px;
    padding:5px 10px;
  }
  .phone{
    margin-top:10px;
    padding:5px 10px;

  }
}

</style>