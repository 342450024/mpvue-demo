<template>
  <div class="container" >

      <CommentList v-if='userinfo.openId' type='user' :comments="comments"></CommentList>
      <div v-if='userinfo.openId'>
         <div class="page-title">我的图书</div>
         <Card v-for='book in books' :key='book.id' :book='book'></Card>
        <div v-if='!books.length'>暂未添加图书</div>
      </div>
  </div>
</template>

<script>
import {get} from '@/util'
import CommentList from '@/components/CommentList'
import Card from '@/components/Card'
export default {
  data () {
    return {
      comments: [],
      userinfo:{},
      books:[]
    }
  },

  components: {
CommentList,
Card
  },

  methods: {
    init(){
      wx.showNavigationBarLoading()
      this.getComments()
      this.getBooks()
      wx.hideNavigationBarLoading()
    },
      async getComments(){
        const comments = await get('/weapp/commentlist',{
         openid:this.userinfo.openId
        })
        this.comments = comments.list

      },
      async getBooks(){
        const books = await get('/weapp/booklist',{
         openid:this.userinfo.openId
        })
        this.books = books.list

      }
  },
  onPullDownRefresh(){
   this.init()
   wx.stopPullDownRefresh()
  },
  onShow() {
    if(!this.userinfo.openId){
      let userinfo = wx.getStorageSync('userinfo')
      if(userinfo){
         this.userinfo = userinfo
         this.init()
      }
    }

  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

.counter {
  display: inline-block;
  margin: 10px auto;
  padding: 5px 10px;
  color: blue;
  border: 1px solid blue;
}
</style>
