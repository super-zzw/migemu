<template>
	<view class="wrap">
		<view class="top">
			<courseTag :types="config.typeTags" :currentType="currentType" @change="tapTag"></courseTag>
			<view class="more" @tap="showModal" data-target="ChooseModal">
				<image src="../../static/zhedie.png" class="zhedie" mode=""></image>
			</view>
		</view>
		<view class="cont">
			<view v-for="(item,index) in data_list" :key="index">
				<courseItem :dataItem="item"></courseItem>
			</view>
			<moreList @change="getMore" v-if="hasMore" ></moreList>
		</view>
		<view class="cu-modal bottom-modal" :class="modalName=='ChooseModal'?'show':''" @tap="hideModal">
			<view class="cu-dialog topDialog" @tap.stop="">
				<view class="list">
					<view class="item" v-for="(value,key,index) of config.typeData" :key="key">
						<view class="itemTitle">
							{{key}}
						</view>
						<courseTag :types="value" :currentType="currentType" @change="tapTag"></courseTag>
					</view>
				</view>
				<view class="dialogBtn" @tap="hideModal">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import courseItem from "@/components/courseItem.vue"
import courseTag from "@/components/courseTag.vue"
import moreList from "@/components/moreList.vue"
import { mapState } from 'vuex'
export default{
	components:{
		courseTag,
		courseItem,
		moreList
	},
	data(){
		return {
			modalName:null,
			currentType:{
				courseModel:"",  //课程模式
				courseSubject:"",  //班课类型
				courseType:"",  //课程类型
			},
			hasMore:true,
			data_list:[],
			page:1
		}
	},
	computed:{
		...mapState(['config'])
	},
	methods:{
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
			this.hasMore = true;
			this.data_list = [];
			this.page = 1;
			await this.getData();
		},
		showModal(e) {
			this.modalName = e.currentTarget.dataset.target
		},
		hideModal(e) {
			this.modalName = null
		},
		getMore(){
			this.page ++ ;
			this.getData()
		},
		async getData(){
			uni.showLoading({
				mask:true
			})
			try{
				let res = await this.$http({
					apiName:"courseList",
					data:{
						page:this.page,
						...this.currentType
					}
				})
				this.data_list = this.data_list.concat(res.data.list);
				this.hasMore = res.data.hasNextPage;
			}catch(e){}finally{
				uni.hideLoading()
			}
		}
	},
	async onLoad() {
		await this.getData()
	},
	async onPullDownRefresh() {
		this.hasMore = true;
		this.data_list = [];
		this.page = 1;
		await this.getData();
		uni.stopPullDownRefresh();
	},
}
</script>

<style lang="scss" scoped>
/deep/ .cu-modal.bottom-modal::before{
	vertical-align: top;
}
.wrap{
	background-color: #fff;
	min-height: calc(100vh - 88rpx);
	.top{
		background-color: #fff;
		position: fixed;
		top: 0;
		width: 100%;
		left: 0;
		z-index: 9;
		height: 88rpx;
		box-sizing: border-box;
		border-bottom: 2rpx solid #F3F3F3;
		padding: 16rpx 32rpx;
		padding-right: 90rpx;
		.more{
			box-shadow:-2px 0px 6px 0px rgba(0,0,0,0.04);
			width: 88rpx;
			height: 86rpx;
			position: absolute;
			right: 0;
			top: 0;
			background-color: #fff;
			.zhedie{
				width: 88rpx;
				height: 88rpx;
			}
		}
	}
	.cont{
		margin-top: 88rpx;
		padding: 32rpx;
		padding-top: 2rpx;
	}
	.topDialog{
		vertical-align: initial;
		position: relative;
		padding: 32rpx;
		padding-bottom: 0;
		background-color: #fff;
		text-align: left;
		.list{
			.item{
				margin-bottom: 30rpx;
				.itemTitle{
					color: #303133;
					font-size: 28rpx;
					font-weight: bold;
				}
				/deep/ .types{
					height: fit-content;
					white-space:unset;
					.typeItem{
						margin-top: 20rpx;
					}
				}
			}
		}
		.dialogBtn{
			position: absolute;
			right: 32rpx;
			top: 28rpx;
			color: #fff;
			font-size: 28rpx;
			padding: 6rpx 18rpx;
			background-color: #F72C2C;
			border-radius: 26rpx;
		}
	}
}
</style>
