import Vue from 'vue'
import Detail from './Detail'

const app = new Vue(Detail)
app.$mount()

export default {
	config: {
		navigationBarTitleText: '图书详情'
	}
}