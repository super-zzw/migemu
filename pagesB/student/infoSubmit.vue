<template>
	<view class="content">
		<text class="title">课程类型</text>
		<view class="types">
			<template v-if="types.length !== 0">
				<text class="typeItem" v-for="(type,index) in types" @tap="clickType(index,$event)" :data-key="type.key" :class="{'active':act===index}" :key="type.id">
					{{type.value}}
				</text>
			</template>
		</view>
		<text class="title">其他说明</text>
		<textarea value="" placeholder="比如：上课时间要求在晚上或周末" v-model="remark " />
		<button class="wxBtn btn" :disabled="btnDisable" :loading="btnDisable" @tap="tasteSubmit"> 获取体验课</button>
	</view>
</template>

<script>
import Utils from "../../utils/method.js";
	export default{
		data(){
			return{
				types:[],
				act: 0,
				subjectId:null, // 点击的分类id
				remark: "" , //其他说明
				btnDisable: false
			}
		},
		
		async onShow(){
			try{
				if(uni.getStorageSync('session')){ // 证明已经登陆过了
					this.getConfig();
					await this.isTaste();
				}else{
					this.$store.commit('jumpPageSet',{
						rejectPath:"/pagesB/student/infoSubmit",
						path:"/pagesB/student/infoSubmit"
					})
					uni.reLaunch({
						url: "/pages/author/author"
					})
				}
			}catch(e){
				if(e.data.code === 500006){ // 已经有体验课资格了
					setTimeout(() => {
						uni.switchTab({
							url: "../../pages/index/index",
							success(res){
								
							},fail(err){
								console.log(err);
							}
						})
					},1300)
				}
			}
			
		},
		methods:{
			clickType(i,e){
				this.subjectId = e.currentTarget.dataset.key;
				console.log(this.subjectId);
				this.act = i;
			},
			async getConfig(){ // 拿到分类信息
				try{
					let res = await this.$http({
						apiName:"getConfig"
					})
					this.types = res.data.COURST_SUBJECT;
					this.subjectId = res.data.COURST_SUBJECT[0].key;
					console.log(this.subjectId);
				}catch(e){
					//TODO handle the exception
				}
			},
			async isTaste(){ // 检测是不是已经获取过提交课了
				try{
					return this.$http({
						apiName: "isSumibtAudition",
						method: "POST"
					});
	
				}catch(e){
					console.log(e);
				}
			},
			// 提交体验课
			async tasteSubmit(){
				if(!this.remark){
					uni.showToast({
						title: "其他说明不能为空...",
						icon: "none"
					})
					return;
				}
				try{
					this.btnDisable = true;
					const res = await this.$http({
						apiName: "submitAudition",
						method: "POST",
						data: {
							remark: this.remark,
							subjectId: this.subjectId
						}
					}) 
					uni.showToast({
						title: "获取体验课成功",
						icon: "success"
					})
					setTimeout(() => {
						this.btnDisable = false;
						uni.navigateTo({
							url: "./infoSuToast"
						})
					},1500)
				}catch(e){
					this.btnDisable = false;
					uni.navigateTo({
						url: "./infoFaToast"
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.content{
		padding: 20rpx 32rpx;
		min-height: 100vh;
		background-color: #FFFFFF;
		justify-content: flex-start;
		align-items: flex-start;
	}
	textarea{
		width: 686rpx;
		height: 280rpx;
		background-color: #F8F8F8;
		border-radius: 12rpx;
		padding: 30rpx;
		font-size: 28rpx;
	}
	.btn{
		width:686rpx;
		height: 88rpx;
		background-color: #2ACC8C;
		border-radius: 44rpx;
		line-height: 88rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		margin-top: 60rpx;
	}
	.title{
		font-size: 34rpx;
		color: #303133;
		font-weight: bold;
		margin-bottom: 30rpx;
	}
	.types{
		width: 100%;
		overflow-y: hidden;
		overflow-x: auto;
		height: 60rpx;
		white-space: nowrap;
		margin-bottom: 60rpx;
		.typeItem{
			display: inline-block;
			padding: 4rpx 12rpx;
			border-radius: 30rpx;
			box-sizing: border-box;
			border: 2rpx solid #DDE1E8;
			color: #909399;
			font-size: 28rpx;
			margin-right: 30rpx;
		}
		.typeItem.active{
			background-color: #2ACC8C;
			color: #fff;
			border-color: #2ACC8C;
		}
	}
</style>
