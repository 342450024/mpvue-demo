import Vue from 'vue'
import Book from './book'

const app = new Vue(Book)
app.$mount()
export default {
	config: {
		enablePullDownRefresh: true,
		navigationBarTitleText: '书本',
		backgroundColor: '#f1f1f1'

	}
}