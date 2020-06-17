<template>
	<view class="task">
		<view class="" v-if="dataList.length > 0">
			<view class="tItem" v-for="(item,index) in dataList" :key="index" @tap="toDetail(item.srlJobId)">
				<view class="tItem1">
					<taskItem :task="item"></taskItem>
				</view>
				<taskCourse :toDetail="false" :courseData="item"></taskCourse>
			</view>
			<moreList @change="getMore" v-if="hasMore" ></moreList>
		</view>
		<view class="empty" v-else>
			<defaultPage></defaultPage>
		</view>
	</view>
</template>

<script>
import taskItem from '@/components/taskItem.vue'
import taskCourse from '@/components/taskCourse.vue'
import moreList from "@/components/moreList.vue"
import defaultPage from "@/components/defaultPage.vue"
export default{
	components:{
		taskItem,
		moreList,
		taskCourse,
		defaultPage
	},
	data(){
		return {
			hasMore:true,
			page:1,
			dataList:[]
		}
	},
	methods:{
		async getMore(){
			this.page ++;
			await this.getData()
		},
		toDetail(id){
			uni.navigateTo({
				url:'/pagesB/student/taskDetail?id=' + id
			})
		},
		async getData(){
			uni.showLoading({
				title:"加载中...",
				mask:true
			})
			try{
				let res = await this.$http({
					apiName:"taskList",
					method:"POST",
					data:{
						page:this.page,
					}
				})
				this.dataList = this.dataList.concat(res.data.list);
				this.hasMore = res.data.hasNextPage;
			}catch(e){
				//TODO handle the exception
			}
			uni.hideLoading()
		}
	},
	async onShow() {
		this.dataList = [];
		this.page = 1;
		await this.getData()
	},
	async onPullDownRefresh() {
		this.dataList = [];
		this.page = 1;
		await this.getData();
		uni.stopPullDownRefresh();
	},
}
</script>

<style lang="scss" scoped>
.task{
	height: 100vh;
	background-color: #F6F6F6;
	padding: 32rpx;
	.tItem{
		box-shadow:0px 4px 24px 0px rgba(0,0,0,0.08);
		border-radius:12px;
		margin-bottom: 32rpx;
		overflow: hidden;
		.tItem1{
			padding: 30rpx;
			background-color: #fff;
		}
	}
	.empty{
		height: 100%;
		flex-direction: column;
	}
}

</style>
