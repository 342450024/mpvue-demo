<template>
  <div class="counter-warp">
    <TopSwiper :tops='tops'></TopSwiper>
    <Card :key='book.id' v-for='book in books' :book='book'></Card>
    <p class="foot" v-show='!more'>到底了</p>
  </div>
</template>

<script>

import {get} from '@/util'
import Card from '@/components/Card'
import TopSwiper from '@/components/TopSwiper'
export default {
  data(){
     return{
      books:[],
      page:0,
      more:true,
      tops:[]
     }
  },
  components: {
    Card,
    TopSwiper
  },
  created(){
  this.getList(true)
  this.getTop()
  },
  onPullDownRefresh(){
  this.getList(true)
  this.getTop()
  },
  onReachBottom(){
   if(!this.more){
    return false;
   }
   this.page = this.page + 1
   this.getList();
  },
  methods: {
    async getTop(){
     const tops = await get('/weapp/top')
     this.tops = tops.list
    },
    async getList(init){
      if(init){
        this.page = 0
        this.more = true
      }
      wx.showNavigationBarLoading()
      const books = await get('/weapp/booklist',{page:this.page})
      if(books.list.length < 10 && this.page > 0){
        this.more = false;
      }
      if(init){
       this.books = books.list
       wx.stopPullDownRefresh()
      }else{
       this.books = this.books.concat(books.list)
      }
      wx.hideNavigationBarLoading()

    }
  }
}
</script>

<style>
.foot{
  text-align:center;
  padding:5px 0;
  font-size:14px;
}
</style>
