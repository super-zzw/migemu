<template>
	<view class="noticeDetail">
		<view class="title">
			{{title}}
		</view>
		<view class="dateTime">
			时间：{{createTime | dealTime}}
		</view>
		<rich-text class="contents" :nodes="content"></rich-text>
	</view>
</template>

<script>
	import utils from "../../utils/method.js"
	export default {
		data() {
			return {
				content: "",
				title: "",
				subTitle: "",
				createTime: ""
			}
		},
		methods: {
			async getData(id) {
				uni.showLoading({
					title: "加载中...",
					mask: true
				})
				try {
					let res = await this.$http({
						apiName: "noticeDetail",
						data: {
							id: id
						}
					})
					if(res.data.content){
						this.content = res.data.content.replace(/\<img/gi, "<img class='html_img' ");
					}
					this.title = res.data.title;
					this.subTitle = res.data.subTitle;
					this.createTime = res.data.createTime
				} catch (e) {
					//TODO handle the exception
				} finally {
					uni.hideLoading()
				}
			}
		},
		onLoad(opt) {
			opt.id && this.getData(opt.id)
		},
		filters: {
			dealTime(val) {
				if (val) {
					return utils.unixToDatetime(val)
				} else {
					return ""
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.noticeDetail {
		padding: 30rpx;
		min-height: 100vh;
		box-sizing: border-box;
		.title{
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			color: #303133;
		}
		.dateTime{
			color: #8799A3;
			font-size: 24rpx;
			margin-top: 20rpx;
		}
		.contents{
			margin-top: 40rpx;
		}
	}
</style>
