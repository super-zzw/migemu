<template>
	<view class="content">
		<view class="header flex align-center justify-between">
			<view class="h-left flex align-center">
				<view class="img-icon">
					<image src="../../static/my/jifen.png" mode=""></image>
				</view>
				
				<view class="integral flex flex-column ">
					<text class="num">{{sumAmount}}</text>
					<text>当前积分</text>
				</view>
			</view>
			<picker mode="selector" :value="index" :range="selectArr" @change="selectChange">
				<view class="h-right flex align-center">{{selectArr[index]}}  <image src="../../static/bottom.png" ></image></view>
			</picker>
			
		</view>
		<view class="null" v-if="data_list.length === 0 ">
			<DefaultPage ></DefaultPage>
		</view>
		
		<template v-else>
			<view class="context flex align-center justify-between" v-for="(list) in data_list" :key="list.id" >
				<view class="c-left flex flex-column">
					<text class="description">{{list.sourceType == 1 ? '购买课程' : list.sourceType == 2 ? '完成作业' : list.sourceType == 3 ? '上课签到': list.sourceType == 4? '教师评价' : list.sourceType == 5 ?'课程评价':list.sourceType == 6 ? '平台奖励':'平台扣除'}}</text>
					<text>{{list.createTime}}</text>
				</view>
				<view class="c-right">
					{{list.type===0?'+':'-'}}{{list.amount}}
				</view>
			</view>
		</template>
	</view>
</template>

<script>
import Utils from "../../utils/method.js";
import DefaultPage from "../../components/defaultPage.vue"
	export default{
		data(){
			return{
				selectArr: ['全部记录','获取','使用'],
				index: 0,
				data_list:[],
				sumAmount: 0
			}
		},
		onLoad() {
			this.defaultGetIntegral();
			this.getSumIntegral();      
		}, 
		methods:{
			selectChange(e){
				if(this.index != e.detail.value){ // 避免重复请求
					this.index = e.detail.value
					if(this.index == 1 ){
						this.getIntegral(0);
					}else if(this.index == 2 ){
						this.getIntegral(1);
					}else if(this.index == 0 ){
						this.defaultGetIntegral();
					}
				}
			},
			// 获取总积分
			async getSumIntegral(){
				const { data:{integration=0} } = await this.$http({apiName: "getSumStudetnI",method:"GET"});
				this.sumAmount = integration;
			},
			// 获取积分明细
			async defaultGetIntegral(){
				const {data} = await this.$http({apiName: "getIntegral"});
				if(data.list.length !== 0  ){
					data.list.forEach(item => item['createTime'] = Utils.unixToDatetime(item['createTime']));
				}
				this.data_list = data.list;
			},
			async getIntegral(type){
				const {data} = await this.$http({apiName: "getIntegral",data:{type}});
				if(data.list.length !== 0 ) {
					data.list.forEach(item => item['createTime'] = Utils.unixToDatetime(item['createTime']));
				}
				this.data_list = data.list;
			}
		}
	}
</script>

<style scoped lang="scss">
	.header{
		width: 100%;
		height: 160rpx;
		padding: 0 26rpx 0 32rpx;
		background-color: #FFFFFF;
		.h-left{
			.img-icon{
				width:86rpx;
				height:86rpx;
				background:#F72C2C;
				border-radius: 50%;
				image{
					width: 86rpx;
					height: 86rpx;
				}
				margin-right: 16rpx;
			}
			.integral{
				font-size: 28rpx;
				color: #606266;
				line-height: 40rpx;
				.num{
					font-size: 40rpx;
					color: #F95C25;
					line-height: 56rpx;
					font-weight: bold;
					
				}
			}
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
	.null{
		margin-top: 200rpx;
	}
	.context{
		width: 100%;
		height: 128rpx;
		background-color: #FFFFFF;
		padding: 0 32rpx;
		&:nth-of-type(2){
			margin-top: 20rpx;
		}
		.c-left{
			text{
				line-height: 36rpx;
				font-size: 26rpx;
				color: #909399;
			}
			.description{
				line-height: 44rpx;
				font-size: 32rpx;
				color: #303133;
				margin-bottom: 4rpx;
				font-weight: bold;
			}
		}
		.c-right{
			font-size: 32rpx;
			font-weight: bold;
		}
	}
</style>
