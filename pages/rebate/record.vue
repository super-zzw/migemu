<template>
	<view class="content">
		<view class="top flex flex-column justify-center align-center">
			<h2>{{total}}</h2>
			<text>位好友已接受邀请购买课程</text>
		</view>
		<view class="item"></view>
		<view class="botBlock" v-if="dataList.length > 0">
			<view class="botBlock-row flex">
				<view class="botBlock-col" v-for="item in textArr" :key="item.id">{{item}}</view>
			</view>
			<view class="botBlock-table">
				<view class="botBlock-tr flex" v-for="list in dataList" :key="list.id">
					<view class="botBlock-td flex flex-column justify-center align-center">
						<text class="tel">{{list.name}}</text>
						<!-- <text class="time">{{list.createTime}}注册 </text> -->
					</view>
					<view class="botBlock-td flex align-center justify-center">
						<text class="money">¥{{list.money}}</text>
					</view>
					<view class="botBlock-td flex align-center justify-center">
						<text class="date">{{list.createTime | dealTime}}</text>
					</view>
					<view class="botBlock-td flex align-center justify-center">
						<text class="money">¥{{list.rebateAmount}}</text>
					</view>
				</view>
				<moreList @change="getMore" v-if="hasMore" ></moreList>
			</view>
		</view>
		<view class="botBlock empty" v-else>
			<defaultPage></defaultPage>
		</view>
	</view>
</template>

<script>
	import Utils from "../../utils/method.js"
	import defaultPage from "@/components/defaultPage.vue"
	import moreList from "@/components/moreList.vue"
	export default{
		components:{
			defaultPage
		},
		data(){
			return{
				textArr:['我的好友','订单金额','订单时间','返利金额'],
				dataList:[],
				hasMore:true,
				page:1,
				total:0
			}
		},
		onLoad() {
			this.getData()
		},
		filters:{
			dealTime(val){
				if(val){
					return Utils.unixToDatetime(val,3)
				}else{
					return ""
				}
			}
		},
		methods:{
			async getData(){
				let res = await this.$http({
					apiName:"rebateRecord",
					data:{page:this.page,size:1}
				})
				this.dataList = this.dataList.concat(res.data.list);
				this.hasMore = res.data.hasNextPage;
				this.total = res.data.total
			},
			getMore(){
				this.page ++;
				this.getData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #F9FAFB;
	}
	.top{
		background:url('../../static/yqjlbg.png') no-repeat;
		width: 100%;
		height: 280rpx;
		background-size: cover;
		h2{
			font-size: 48rpx;
			color: #FDC623;
			margin-bottom: 16rpx;
		}
		text{
			font-size: 26rpx;
			color: #FFFFFF;
			margin-left: 238rpx;
		}
	}
	.item{
		background-color: #FAC429;
		width: 720rpx;
		height: 32rpx;
		border-radius: 16rpx;
		margin: 40rpx auto 0;
	}
	.botBlock{
		width: 686rpx;
		height: 900rpx;
		box-shadow:0px 4px 20px 0px rgba(42,204,140,0.07);
		background-color: #FFFFFF;
		margin: 0 auto;
		position: relative;
		top: - 12rpx;
		padding: 0 22rpx;
		.botBlock-row{margin-top: 46rpx;}
		.botBlock-col{
			padding: 16rpx 23rpx;
			font-size: 28rpx;
			color: #FFFFFF;
			background: #FAC429;
			margin-right: 2rpx;
			flex-basis: 24.9%;
		}
		.botBlock-table{
			.botBlock-tr{font-size: 24rpx; color:#606266;height: 86rpx;background-color: #F6F2F2;margin-bottom: 2rpx;
			.time{font-size: 18rpx; color:#BCC0C8}
			&:nth-of-type(odd){
				background-color: #FCFAFA;
			}
			}
			.botBlock-td{flex-basis: 25%;
				.time{
					font-size: 20rpx;
				}
				.data,.money{
					font-size: 24rpx;
				}
				
			}
		}
	}
	.botBlock::after{
		content: "";
		position: absolute;
		top: 0;
		width: 100%;
		height: 12rpx;
		background: rgba(44, 201, 138, 0.19);
		filter: blur(4px);
	}
</style>
