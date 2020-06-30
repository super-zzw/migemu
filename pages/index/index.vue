<template>
	<view class="wrap">
		<view class="banner">
			<swiper v-if="banner_list.length > 0" class="swiper" :autoplay="true" >
				<swiper-item class="swiper-item" v-for="(item,index) in banner_list" :key="index" @tap="bannerJump(item.jumpType,item.jumpId)">
					<image :src="item.pic" mode="" class="bannerImg"></image>
				</swiper-item>
			</swiper>
		</view>
		<view class="cont">
			<view class="navBox">
				<view class="navItem">
					<navigator url="./cooperation" hover-class='none'>
						<image src="../../static/image/nav1.png" class="navImg"></image>
						</navigator>
					<text>共建合作学堂</text>
				</view>
				<view class="navItem">
					<!-- <navigator url="./shiting" hover-class='none'> -->
						<!-- <image src="../../static/image/nav2.png" class="navImg"></image> -->
					<!-- </navigator> -->
					<view url="./shiting" hover-class='none'>
						<image src="../../static/image/nav2.png" class="navImg"></image>
					</view>
					
					<text>免费体验课程</text>
				</view>
				<view class="navItem">
					<navigator url="./lessonSystem" hover-class='none'>
						<image src="../../static/image/nav2.png" class="navImg"></image>
					</navigator>
					<text>了解课程体系</text>
				</view>
			</view>
			<view class="listTitle">
				<view class="lt1">
					课程列表 
				</view>
				<!-- <view class="lt2" @tap="toPath('/pages/index/list')">
					<text class="lt2Text">更多</text> 
					<image class="lt2Img" src="../../static/more.png" mode="widthFix"></image>
				</view> -->
			</view>
			<!-- <courseTag :types="types" :currentType="currentType" @change="tapTag"></courseTag> -->
			<view class="list">
				<view v-for="(item,index) in data_list" :key="index">
					<courseItem :dataItem="item"></courseItem>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import courseItem from "@/components/courseItem.vue"
	import courseTag from "@/components/courseTag.vue"
	import { mapState } from 'vuex';
	import utils from '../../utils/method.js'
	export default {
		onShareAppMessage (){
			return utils.homeShare("../../static/homeshare.png")
		},
		components:{
			courseItem,
			courseTag
		},
		data() {
			return {
				currentType:{
					courseModel:"",  //课程模式
					courseSubject:"",  //班课类型
					courseType:"",  //课程类型
				},
				types:[],
				banner_list:[],
				data_list:[],
			}
		},
		computed:{
			...mapState(['config'])
		},
		async onLoad() {
			// uni.showTabBarRedDot({
			// 	index:2
			// })
			this.initData()
		},
		async onPullDownRefresh() {
			this.types = [];
			this.banner_list = [];
			this.data_list = [];
			await this.initData();
			uni.stopPullDownRefresh();
		},
		methods: {
			async tapTag(e){
				if(e.paramType){
					if(this.currentType[e.paramType] == e.key){
						this.currentType[e.paramType] = "";
					}else{
						this.currentType[e.paramType] = e.key;
					}
				}else{
					this.currentType = {
						courseModel:"",  //课程模式
						courseSubject:"",  //班课类型
						courseType:"",  //课程类型
					}
				}
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				await this.getData();
				uni.hideLoading();
			},
			toPath(path){
				uni.navigateTo({
					url:path
				})
			},
			async initData(){
				uni.showLoading({
					title:"加载中...",
					mask:true
				})
				await this.getConfig()
				await this.getBanner()
				await this.getData()
				uni.hideLoading()
			},
			async getBanner(){
				try{
					let res = await this.$http({
						apiName:"bannerList"
					})
					this.banner_list = res.data
				}catch(err){}
			},
			async getConfig(){
				try{
					let res = await this.$http({
						apiName:"getConfig"
					})
					this.types.push({value:"全部类别",paramType:""},...res.data.COURST_STATUS,...res.data.COURST_SUBJECT,...res.data.COURST_TYPE);
					res.data["typeTags"] = this.types;
					res.data["typeData"] = {};
					this.$set(res.data["typeData"],"课程模式",res.data.COURST_STATUS);
					this.$set(res.data["typeData"],"课程类型",res.data.COURST_SUBJECT);
					this.$set(res.data["typeData"],"班课类型",res.data.COURST_TYPE);
					this.$store.commit('configSet',res.data)
				}catch(e){
					//TODO handle the exception
				}
			},
			async getData(){
				try{
					let res = await this.$http({
						apiName:"courseList",
						data:{...this.currentType}
					})
					this.data_list = res.data.list;
				}catch(err){}
			},
			bannerJump(jumpType,jumpId){
				switch(Number(jumpType)){
					case 1:
						uni.navigateTo({
							url:"/pages/index/article?id=" + jumpId
						});
						break;
					case 2:
						uni.navigateTo({
							url:"/pages/index/good?id=" + jumpId
						});
						break;
					default:
						return
						break;
				}
			},
		
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		min-height: 100vh;
		background-color: #fff;
		.banner{
			width: 100%;
			.swiper{
				height: 280rpx;
				.bannerImg{
					width: 100%;
					height: 280rpx;
				}
			}
		}
		.cont{
			padding: 32rpx;
			.navBox{
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				margin-bottom: 40rpx;
				.navItem{
					// width: 168rpx;
					// padding: 0 16rpx;
					display: flex;
					align-items: center;
					flex-direction: column;
					// height: 152rpx;
					
					.navImg{
						width: 96rpx;
						height: 96rpx;
						margin-bottom:16rpx ;
					}
					text{
						font-size: 28rpx;
						font-weight:500;
						color:rgba(96,98,102,1);
						line-height:40rpx;
					}
				}
			}
			.listTitle{
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				// padding-bottom: 16rpx;
				.lt1{
					color: #303133;
					font-size: 32rpx;
					font-weight:600;
					margin-bottom: 36rpx;
				}
				
			}
		
		}
	}
</style>