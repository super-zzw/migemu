<template>
	<view class="taskList">
		<view class="tlTab">
			<view class="tlTabItem" :class="currentTab == 1 ? 'active' : ''" @tap="changeTab(1)">
				进行中
			</view>
			<view class="tlTabItem" :class="currentTab == 2 ? 'active' : ''" @tap="changeTab(2)">
				已截止
			</view>
		</view>
		<view class="tabCont" v-if="data_list.length > 0">
			<view class="tcItem" v-for="(item,index) in data_list" :key="index" @tap="toTaskDetail(item.jobId)">
				<view class="tcItem1">
					<taskItem :task="item" :edit="-1" @deleteItem="deleteItem"></taskItem>
					<view class="subData">
						<view class="sdText">
							<text class="sdT1">{{item.submitNum}}/{{item.totalNum}}</text>
							<text class="sdT2">提交情况</text>
						</view>
						<view class="sdText">
							<text class="sdT1">{{item.viewNum}}/{{item.totalNum}}</text>
							<text class="sdT2">批阅情况</text>
						</view>
					</view>
				</view>
				<taskCourse :toDetail="false" :courseData="item"></taskCourse>
			</view>
			<moreList @change="getMore" v-if="hasMore" ></moreList>
		</view>
		<view class="tabCont empty" v-else>
			<defaultPage></defaultPage>
		</view>
	</view>
</template>

<script>
import taskItem from '@/components/taskItem.vue'
import taskCourse from '@/components/taskCourse.vue'
import moreList from "@/components/moreList.vue"
import defaultPage from "../../components/defaultPage.vue"
export default{
	components:{
		taskItem,
		moreList,
		taskCourse,
		defaultPage
	},
	data(){
		return{
			currentTab:1,
			hasMore:true,
			data_list:[],
			arrangeCourseId:"",
			page:1
		}
	},
	onLoad(opt) {
		this.arrangeCourseId = opt.id;
	},
	async onShow() {
		this.page = 1;
		this.data_list = [];
		await this.getData()
	},
	methods:{
		async getData(){
			uni.showLoading({
				title:"数据加载中...",
				mask:true
			})
			try{
				let res = await this.$http({
					apiName:"lessionTaskList",
					data:{
						arrangeCourseId:this.arrangeCourseId,
						page:this.page,
						status:this.currentTab
					}
				})
				// this.data_list = res.data.list;
				this.data_list = this.data_list.concat(res.data.list);
				this.hasMore = res.data.hasNextPage
			}catch(e){
				//TODO handle the exception
			}finally{
				uni.hideLoading()
			}
		},
		getMore(){
			this.page ++ ;
			this.getData()
		},
		changeTab(tab){
			if(tab == this.currentTab){
				return
			}else{
				this.page = 1;
				this.data_list = [];
				this.currentTab = tab;
				this.getData();
			}
		},
		toTaskDetail(id){
			uni.navigateTo({
				url:"/pagesA/teacher/taskDetail?id=" + id
			})
		},
		async deleteItem(jobId){
			uni.showLoading({
				title:"删除中...",
				mask:true,
			})
			try{
				let res = await this.$http({
					apiName:"deleteTask",
					data:{
						jobId:jobId
					}
				})
				if(res){
					uni.showToast({
						title:"删除成功"
					})
					setTimeout(_=>{
						this.page = 1;
						this.data_list = [];
						this.getData();
					},1500)
				}
			}catch(e){
				//TODO handle the exception
			}finally{
				uni.hideLoading()
			}
		}
	},
	async onPullDownRefresh() {
		this.page = 1;
		this.data_list = [];
		await this.getData();
		uni.stopPullDownRefresh();
	},
}
</script>

<style lang="scss" scoped>
.taskList{
	min-height: 100vh;
	background-color: #F6F6F6;
	padding-top: 86rpx;
	box-sizing: border-box;
	.tlTab{
		position: fixed;
		width: 100%;
		top: 0;
		left: 0;
		height: 86rpx;
		display: flex;
		justify-content: space-around;
		background-color: #fff;
		z-index: 99;
		.tlTabItem{
			color: #909399;
			font-size: 32rpx;
			padding-bottom: 20rpx;
			box-sizing: border-box;
			line-height: 82rpx;
			font-weight: bold;
		}
		.tlTabItem.active{
			color: #FDC623;
			border-bottom: 4rpx solid #FDC623;
		}
	}
	.tabCont{
		padding: 32rpx;
		.tcItem{
			box-shadow:0px 4px 24px 0px rgba(0,0,0,0.08);
			border-radius:12px;
			overflow: hidden;
			margin-bottom: 30rpx;
			background-color: #fff;
			.tcItem1{
				padding: 30rpx;
				.subData{
					display: flex;
					margin-top: 20rpx;
					.sdText{
						margin-right: 40rpx;
						.sdT1{
							color: #FDC623;
							font-weight: bold;
							font-size: 40rpx;
						}
						.sdT2{
							margin-left: 10rpx;
							color: #606266;
							font-size: 26rpx;
						}
					}
				}
			}
		}
	}
	.tabCont.empty{
		height: calc(100vh - 86rpx);
	}
}
</style>
