<template>
	<view class="taskData">
		<view class="taskText">
			{{taskData.content}}
		</view>
		<view class="audioBox">
			<view class="audioItem" v-for="(item, index) in taskData.voiceList" :key="index" @tap="playUploadAudio(index)">
				<image src="../static/audio.png" class="audioImg" mode="widthFix"></image>
				<view class="audioTime">{{ item.time }}</view>
			</view>
		</view>
		<view class="imgVideoBox">
			<view class="vbItemCont" v-for="(item1,index1) in taskData.picList" :key="index1">
				<image @tap="showImg(item1)" :src="item1" class="vbItem" mode=""></image>
			</view>
			<view class="vbItemCont" v-for="(item2,index2) in taskData.videoList" :key="index2">
				<video class="vbItem" :src="item2" controls></video>
				<view class="videoLatout" @tap="playVideo(item2)"></view>
			</view>
		</view>
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="boxTop">
					<image v-if="modalType == 1" class="imgPic" :src="modalImgUrl" mode="widthFix"></image>
					<view class="videoBox" v-if="modalType == 2">
						<video class="videoData" :src="modalVideoSrc" controls></video>
					</view>
				</view>
				<view class="boxBoo">
					<image @tap="hideModal" class="close" src="../static/closeModal.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="voicePlayModal == 'voice' ? 'show':''">
			<view class="cu-dialog myDialog">
				<view class="boxTop boxTopVideo">
					<view class="audioOpr">
						<view class="toLeft"></view>
						<view class="toCenter">
							<!-- 点击播放录音 -->
							<view class="tmOpr" v-if="!startVoicePlay" @tap="playUploadAudio('')">
								<image src="../static/playAudio.png" class="tmOprImg" mode=""></image>
								<view class="tmOprText">
									播放录音
								</view>
							</view>
							<!-- 播放中 -->
							<view class="tmOpr" @tap="pauseVoicePlay" v-if="startVoicePlay && voicePlaying">
								<image src="../static/pauseAudio.png" class="tmOprImg" mode=""></image>
								<view class="tmOprText">
									播放中{{voicePlayTimeFormat}}
								</view>
							</view>
							<!-- 暂停或播放结束 -->
							<view class="tmOpr" @tap="goonVoicePlay" v-if="startVoicePlay && !voicePlaying">
								<image src="../static/playAudio.png" class="tmOprImg" mode=""></image>
								<view class="tmOprText">
									暂停中{{voicePlayTimeFormat}}
								</view>
							</view>
						</view>
						<view class="toRight"></view>
					</view>
				</view>
				<view class="boxBoo">
					<image @tap="hideVoicePlayModal" class="close" src="../static/closeModal.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
//1，点击激活录音->开始录音
//2，点击开始录音->正在录制
//3，点击停止->选择重录，播放，上传
//点击重录进入2，
//点击播放->选择重录，暂停，上传
import utils from '../utils/method.js'
export default{
	props:{
		taskData:{
			type:Object,
			default:()=>{{}}
		},
		textPlaceholder:{
			type:String,
			default:""
		}
	},
	data(){
		return {
			modalName: null,
			modalType: '', //大图还是视频1大图，2视频
			modalImgUrl: '',
			modalVideoSrc: '',
			
			voicePlaySrc:"",
			voicePlayModal:null,
			voicePlayManger:null,  //已上传的录音管理器
			voicePlayTime:0,  //已上传的录音播放时长
			voicePlayTimeFormat:"00:00",  //已上传的录音播放时长格式化
			startVoicePlay:false,  //true播放开始
			voicePlaying:false,  //true正在播放
		}
	},
	methods:{
		//开始播放已上传的音频
		playUploadAudio(index){
			this.showVoicePlayModal();
			if(String(index)){
				this.voicePlaySrc = this.taskData.voiceList[index].audioUrl;
				this.voicePlayManger = uni.createInnerAudioContext();
				this.voicePlayManger.src = this.voicePlaySrc;
				this.voicePlayManger.autoplay = true;
			}else{
				this.voicePlayManger.play()
			}
			this.startVoicePlay = true;
			this.voicePlaying = true;
			let self = this;
			this.voicePlayManger.onTimeUpdate(()=>{
				self.voicePlayTime = Math.floor(self.voicePlayManger.currentTime)
				self.voicePlayTimeFormat = utils.exRecordTime(self.voicePlayTime);
				console.log(`语音总时间：${self.voicePlayManger.duration}，当前播放时间：${self.voicePlayTime}`)
			})
			this.voicePlayManger.onEnded(()=>{
				uni.showToast({
					title:"播放结束",
					duration:800,
					icon:"none"
				})
				self.startVoicePlay = false;
				self.voicePlaying = false;
			})
		},
		//暂停
		pauseVoicePlay(){
			this.voicePlayManger.pause();
			this.voicePlaying = false;
		},
		//继续
		goonVoicePlay(){
			this.voicePlayManger.play();
			this.voicePlaying = true;
		},
		showVoicePlayModal(){
			this.voicePlayModal = 'voice';
		},
		hideVoicePlayModal(){
			this.voicePlayModal = null;
			this.voicePlayManger.stop();
			this.voicePlayManger = null;
			this.startVoicePlay = false;
			this.voicePlaying = false;
		},
		
		showImg(imgUrl) {
			this.modalType = 1;
			this.modalImgUrl = imgUrl;
			this.modalName = 'Modal';
		},
		//播放已上传的视频
		playVideo(videoSrc) {
			this.modalType = 2;
			this.modalVideoSrc = videoSrc;
			this.modalName = 'Modal';
		},
		hideModalRecord(){
			if(this.audioing){
				uni.showToast({
					title:"请先结束录音",
					icon:"none"
				})
			}else if(this.startAudio){
				let _this = this;
				uni.showModal({
				    title: '提示',
				    content: '当前录音未上传，关闭会丢失录音，确定关闭？',
				    success: function (res) {
				        if (res.confirm) {
				            _this.modalName = null;
							_this.$set(_this.oprations[2], 'active', false);
				        }
				    }
				});
			}else{
				this.modalName = null;
				this.$set(this.oprations[2], 'active', false);
			}
		},
		hideModal(e) {
			this.modalName = null;
			this.modalType = this.modalImgUrl = this.modalVideoSrc = '';
		},
		deleteFile(type,index){
			let _this = this;
			uni.showModal({
			    title: '提示',
			    content: '删除该文件将无法恢复，确定删除？',
			    success: function (res) {
			        _this.$emit('mediaDelete',type,index)
			    }
			});
		},
		mediaDataChange(type,data){
			this.$emit('mediaDataChange',type,data)
		}
	},
	created() {
		
	}
}
</script>

<style lang="scss">
.taskData {
	.taskText {
		min-height: 50rpx;
		color: #303133;
		font-size: 32rpx;
		line-height: 44rpx;
		word-break: break-word;
	}
	.textarea-placeholder {
		color: #999999;
		font-size: 32rpx;
	}
	.audioBox {
		.audioItem {
			margin-top: 30rpx;
			background-color: #dffbf2;
			display: flex;
			align-items: center;
			padding: 14rpx 20rpx;
			position: relative;
			border-radius: 8rpx;
			overflow: hidden;
			.audioImg {
				width: 26rpx;
				height: auto;
			}
			.audioTime {
				color: #303133;
				font-size: 28rpx;
				margin-left: 16rpx;
			}
		}
	}
	.imgVideoBox {
		margin-top: 40rpx;
		display: flex;
		// justify-content: space-between;
		flex-flow: row wrap;
		.vbItemCont {
			position: relative;
			border-radius: 8rpx;
			overflow: hidden;
			position: relative;
			margin-bottom: 30rpx;
			width: 194rpx;
			height: 194rpx;
			margin-right: 20rpx;
			.vbItem {
				width: 194rpx;
				height: 194rpx;
			}
			.videoLatout {
				position: absolute;
				width: 100%;
				height: 100%;
				left: 0;
				top: 0;
			}
		}
		.vbItemCont:nth-child(3n){
			margin-right: 0;
		}
	}
	.chachaBox {
		position: absolute;
		right: 0;
		top: 0;
		border-radius: 0px 8rpx 0px 8rpx;
		background-color: #f72c2c;
		text-align: center;
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		.chachaImg {
			width: 18rpx;
			height: 18rpx;
		}
	}
	.btnGroup {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		.oprBtns {
			display: flex;
			.oprBtnItem {
				text-align: center;
				width: 64rpx;
				margin-right: 26rpx;
				.oprBtnItemImg {
					width: 64rpx;
					height: 64rpx;
				}
				.oprBtnItemText {
					color: #606266;
					font-size: 24rpx;
				}
			}
		}
		.zipVideoBox {
			display: inline-block;
			.round {
				transform: scale(0.6, 0.6);
			}
			/deep/ checkbox .wx-checkbox-input.wx-checkbox-input-checked {
				background-color: #2acc8c !important;
			}
			.zipVideoBoxText {
			}
		}
	}
}
.myDialog{
	width: 686rpx;
	background: transparent;
	.boxTop{
		font-size: 0;
		border-radius: 10rpx;
		overflow: hidden;
		.imgPic{
			width: 100%;
			height: auto;
		}
		.videoBox{
			width: 100%;
			height: 500rpx;
			.videoData{
				width: 100%;
				height: 100%;
			}
		}
	}
	.boxTopVideo{
		background-color: #fff;
		padding-top: 40rpx;
		padding-bottom: 40rpx;
	}
	.boxBoo{
		margin-top: 60rpx;
		text-align: center;
		.close{
			width: 84rpx;
			height: 84rpx;
		}
	}
	.audioOpr{
		display: flex;
		align-items: center;
		justify-content: space-around;
		.tmOpr{
			text-align: center;
			.tmOprImg{
				width: 80rpx;
				height: 80rpx;
			}
			.tmOprText{
				margin-top: 20rpx;
				color: #606266;
				font-size: 28rpx;
			}
		}
	}
}
</style>
