<template>
  <div class="Progress">

   <progress :percent="percent" color="pink" activeColor='#ea5a49' />
   <p>{{year}}已经过去了{{days}}天,{{percent}}%</p>

  </div>
</template>

<script>
export default {
  methods:{
  	isLeapYear(){
  		const year = new Date().getFullYear()
  		if(year % 400 === 0){
          return true
  		}else if(year%4 === 0 && year%100!==0){
        return true
  		}else{
  			return false
  		}

  	},
  	getDayOfYead(){
     return this.isLeapYear()?366:365;
  	}
  },
  computed:{
   year(){
   	return new Date().getFullYear()
   },
   days(){
   	let start = new Date()
   	start.setMonth(0)
   	start.setDate(1)

	let offset = new Date().getTime() - start.getTime()
	return parseInt(offset/1000/60/60/24) + 1
   },
   percent(){
   	return (this.days*100 / this.getDayOfYead()).toFixed(1)
   }
  }
}
</script>

<style>
.Progress{
	width:85%;
    margin-top:50rpx;
    text-align:center;
    margin:0 auto;

}

</style>
