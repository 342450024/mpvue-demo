import Vue from 'vue'
import Comment from './comment'

const app = new Vue(Comment)
app.$mount()

export default {
	config: {
		navigationBarTitleText: '评论页',
		enablePullDownRefresh: true,
		backgroundColor: '#f1f1f1'
	}
}