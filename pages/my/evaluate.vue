<template>
	<view class="content">
		<textarea value="" placeholder="请写出你对该课程的感受..." v-model="content" />
		<view class="imgs flex">
			<template v-if="imgSrcs.length !== 0">
				<view class="image" v-for="(src,index) in imgSrcs" :key="src.id">
					<image :src="src"   mode=""></image>
					<view class="close flex align-center justify-center" @tap="closeImg(index)"> 
						<image src="../../static/close.png" mode=""></image>
					</view>
				</view>
			</template>
			<view class="uploadImg flex align-center justify-center" @tap="uploadImg">
				<image src="../../static/add.png" mode=""></image>
			</view>
		</view>
		<button class="btn" @tap="evalSubmit" :disabled="btnDisable" :loading="btnDisable">提交</button>
	</view>
	
</template>

<script>
	export default{
		data(){
			return{
				imgSrcs:[],
				content: "", // 文本框输入内容
				courseId: null ,// 课程标识
				maxUploadImg: 3, // 最多上传多少张图片
				btnDisable:false,
				edit: false, // 是否是修改
				commentId: null,
				type: 1, // 1 添加 2 修改 
			}
		},
		computed:{
			residue(){
				let resi = this.maxUploadImg - this.imgSrcs.length; // 最多可以上传多少张 改动前面的数字即可
				if(resi < 0){resi = 0};
				return resi;
			}
		},
		onLoad({cid,context,imgs,cmmid}) {
			cid && (this.courseId = cid);
			context && (this.content = context);
			imgs && (() => this.imgSrcs = imgs.split(","))();
			cmmid && (this.commentId = cmmid,this.type = 2)
		},
		methods:{
			uploadImg(){
				var that = this;
				this.chooseImg().then(temps => {
					temps.forEach(async item => {
						const {data:src} = await that.$upLoadImg({
							apiName: "upLoadFile",
							name: "file",
							filePath: item
						});
						that.imgSrcs.push(src);
					})
				})
			},
			closeImg(i){
				this.imgSrcs.splice(i,1);
			},
			// 选择图片
			chooseImg(){
				var that = this;
				console.log(this.residue);
				return new Promise((resolve,reject) => {
					if(this.residue === 0){
						uni.showToast({
							title: `最多上传${this.maxUploadImg}张图片`,
							icon: "none"
						})
						reject(false);
						return;
					}
					uni.chooseImage({
						count: that.residue,
						success(res) {
							resolve(res.tempFilePaths);
						}
					})
				})
			},
			async evalSubmit(){
				try{
					this.btnDisable = true;
					const submitData = {
						content: this.content,
						courseId: this.courseId,
						imgUrl: this.imgSrcs,
						type: this.type
					}
					if(this.commentId){ submitData['commentId'] = this.commentId }
					const { data } = await this.$http({
						apiName: "postCourseComment",
						method: "POST",
						data:submitData
					});
					uni.showToast({
						title:"提交成功.."
					})
					setTimeout(() => {
						this.btnDisable = false
						uni.navigateBack({
							delta:1
						});
					},1000)
					
				}catch(e){
					this.btnDisable = false
					uni.showToast({
						title: "提交失败,请重试..",
						icon: "none"
					})
				}
				
			},
			
		}
		
	}
</script>

<style scoped lang="scss">
	.content{
		align-items: flex-start;
		min-height: 100vh;
		background-color: #FFFFFF;
	}
	textarea{
		width: 686rpx;
		height: 342rpx;
		background-color: #F8F8F8;
		border-radius: 12rpx;
		padding: 30rpx;
		margin-left: 32rpx;
		margin-top: 30rpx;
	}
	.imgs{
		width: 100%;
		padding: 0 32rpx;
		flex-wrap: wrap;
		margin-top: 30rpx;
		image,.image{
			width: 194rpx;
			margin-right: 30rpx;
			height: 194rpx;
			border-radius: 8rpx;
		}
		.image{
			position: relative;
			.close{
				position: absolute;
				right: 0;
				top: 0;
				width: 40rpx;
				height: 40rpx;
				background:rgba(247,44,44,1);
				border-radius:0px 8rpx 0px 8rpx;
				image{
					width: 18rpx;
					height: 18rpx;
					margin: 0;
				}
			}
		}
	}
	.uploadImg{
		width: 194rpx;
		height: 194rpx;
		border-radius: 8rpx;
		background-color: #F8F8F8;
		image{
			width: 80rpx;
			height: 80rpx;
			margin: 0;
		}
	}
	.btn{
		width: 686rpx;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #2ACC8C;
		border-radius: 44rpx;
		color: #FFFFFF;
		font-size: 32rpx;
		margin: 128rpx 0 128rpx 32rpx;
	}
</style>
