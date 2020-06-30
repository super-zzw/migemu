<template>
	<view class="content">
		<view class="header flex align-center justify-between">
			<view class="h-left">资料列表</view>
			<!-- <view class="h-right flex align-center">按时间排序<image src="../../static/bottom.png" ></image></view> -->
		</view>
		<template v-if="coureseArr.length!==0">
			<view class="block flex align-center justify-between" v-for="(item,index) in coureseArr" :key="item.id">
				<view class="b-left flex align-center">
					<image :src="item.fileType === 0 ?'../../static/my/wj.png':item.fileType === 1?'../../static/my/wp.png':item.fileType === 2 ? '../../static/my/yp.png':'../../static/my/sp.png' " class="img" mode=""></image>
					<view class="b-text flex flex-column">
						<text>{{item.name}}</text>
						<text>{{item.createTime}}</text>
					</view>
				</view>
				<view class="b-right" >
					<image src="../../static/my/zlr.png" @tap="copy(item.fileUrl)" mode=""></image>
					<image src="../../static/teacher/sc.png" class="delete" v-if="userInfo.userType == 1" @tap="dele(index)" mode=""></image>  <!-- 是老师才用显示 -->
				</view>
			</view>
		</template>
		
		
		<view class="null" v-else>
			<DefaultPage tipsText="- 暂无资料 -"></DefaultPage>
		</view>
	</view>
</template>

<script>
	import { mapState } from "vuex";
	import utils from "../../utils/method.js"
	export default{
		computed:{
			...mapState(['userInfo'])
		},
		data(){
			return{
				selectArr: ['按时间排序'],
				index: 0,
				courseId: null,
				coureseArr:[]
			}
		},
		onLoad({cid}) {
			cid && (this.courseId = cid);
			this.getCourseMaterial();
		},
		methods:{
			copy(val){
				this.$copy(val);
			},
			selectChange(e){
				this.index = e.target.value;
			},
			dele(i){ // 教师才可以删除
				var that = this;
				uni.showModal({
					title: '确认要删除吗?',
					confirmColor: "#FDC623",
					success(res) {
						if(res.confirm){
							that.deleteMaterial(i)
						}
					}
				})
			},
			async deleteMaterial(i){
				uni.showLoading({
					title:"删除中...",
					mask:true
				})
				await this.$http({
					apiName:"deleteMaterialDetail",
					method:"POST",
					data:{
						courseMaterialId:this.coureseArr[i].id
					}
				}).then(res =>{
					this.coureseArr.splice(i,1);
					uni.showToast({
						title:"删除成功"
					})
				}).catch(_=>{})
				uni.hideLoading()
			},
			// 获取课程资料列表
			async getCourseMaterial(){
				let _apiName = "materialDetail";
				let _method = "GET"
				if(this.userInfo.userType == 2){
					_apiName = "getCiyrseNaterialL";
					_method = "POST"
				}
				uni.showLoading({
					title: "正在加载中...",
					mask:true
				})
				const { data } = await this.$http({
					apiName: _apiName,
					method: _method,
					data:{
						courseId: this.courseId
					}
				});
				data.forEach(item => {item['createTime'] = utils.unixToDatetime(item['createTime'])});
				this.coureseArr = data;
				uni.hideLoading()
			}
		}
		
	}
</script>

<style scoped lang="scss">
	.content{
		min-height: 100vh;
		background-color: #FFFFFF;
	}
	.header{
		width: 100%;
		height: 88rpx;
		padding: 0 26rpx 0 32rpx;
		.h-left{
			font-size: 34rpx;
			font-weight: bold;
		}
		.h-right{
			font-size: 28rpx;
			image{
				width: 40rpx;
				height: 40rpx;
				margin-left: 2rpx;
				margin-top: 4rpx;
			}
		}
	}
	.block{
		width: 100%;
		height: 140rpx;
		padding: 0 32rpx;
		.img{
			width: 72rpx;
			height: 72rpx;
			margin-right: 18rpx;
		}
		.b-text{
			text{
				line-height:40rpx;
				font-size: 28rpx;
				color: #606266;
				&:first-of-type{
					margin-bottom: 4rpx;
					color: #303133;
					font-weight: 550;
				}
			}
		}
		.b-right{
			image{
				width: 48rpx;
				height: 48rpx;
			}
			.delete{
				margin-left: 30rpx;
			}
		}
	}
	.null{
		height: 50vh;
	}
</style>
