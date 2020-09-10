<template>
	<view class="taskData">
		<textarea v-if="oprations[0].active" class="taskText taskText2" @input="textInput" :auto-height="true" v-model="taskData.content" maxlength="-1" :placeholder="textPlaceholder" placeholder-class @blur="hideTextarea" />
		<view class="taskText" v-else>
			<text v-if="taskData.content" class="taskText2">{{taskData.content}}</text>
			<text class="textarea-placeholder" v-else>{{textPlaceholder}}</text>
		</view>
		<view class="audioBox">
			<view class="audioItem" v-for="(item, index) in taskData.voiceList" :key="index" @tap="playUploadAudio(index)">
				<image src="../static/audio.png" class="audioImg" mode="widthFix"></image>
				<view class="audioTime">{{ item.time }}</view>
				<view class="chachaBox" @tap.stop="deleteFile(2,index)"><image src="../static/chacha.png" class="chachaImg" mode=""></image></view>
			</view>
		</view>
		<view class="imgVideoBox">
			<view class="vbItemCont" v-for="(item1,index1) in taskData.picList" :key="index1">2
				<image @tap="showImg(item1)" :src="item1" class="vbItem" mode=""></image>
				<view class="chachaBox" @tap.stop="deleteFile(1,index1)"><image src="../static/chacha.png" class="chachaImg" mode=""></image></view>
			</view>
			<view class="vbItemCont" v-for="(item2,index2) in taskData.videoList" :key="index2">
				<video class="vbItem" :src="item2" controls></video>
				<view class="videoLatout" @tap="playVideo(item2)"></view>
				<view class="chachaBox" @tap.stop="deleteFile(3,index2)"><image src="../static/chacha.png" class="chachaImg" mode=""></image></view>
			</view>
		</view>
		<view class="btnGroup">
			<view class="oprBtns">
				<view class="oprBtnItem" v-for="(item, index) in oprations" :key="index" @tap="toOpration(index)">
					<image v-if="item.active" class="oprBtnItemImg" :src="item.imgUrl1" mode=""></image>
					<image v-else class="oprBtnItemImg" :src="item.imgUrl0" mode=""></image>
					<view class="oprBtnItemText">{{ item.text }}</view>
				</view>
			</view>
			<checkbox-group @change="changeZip">
				<label class="zipVideoBox">
					<checkbox class="round" :class="true ? 'checked' : ''" :checked="zipVideo ? true : false" value="1"></checkbox>
					<text class="zipVideoBoxText">压缩视频</text>
				</label>
			</checkbox-group>
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
		<view class="cu-modal" :class="modalName=='ctrl'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="boxTop boxTopVideo">
					<view class="audioOpr">
						<view class="toLeft">
							<!-- 点击重录 -->
							<view class="tmOpr" v-if="startAudio && !audioing" @tap="toReRecord">
								<image src="../static/reRecord.png" class="tmOprImg" mode=""></image>
								<view class="tmOprText">
									重录
								</view>
							</view>
						</view>
						<view class="toCenter">
							<!-- 点击开始录制 -->
							<view class="tmOpr" v-if="!startAudio" @tap="toStartAudio">
								<image src="../static/playAudio.png" class="tmOprImg" mode=""></image>
								<view class="tmOprText">
									开始录音
								</view>
							</view>
							<!-- 录音中，点击结束录制 -->
							<view class="tmOpr" v-if="startAudio && audioing" @tap="toFinishAudio">
								<image src="../static/pauseAudio.png" class="tmOprImg" mode=""></image>
								<view class="tmOprText">
									{{recordingTimeFormat}}
								</view>
							</view>
							<!-- 点击播放录音 -->
							<view class="tmOpr" v-if="startAudio && !audioing && !audioPlaying" @tap="toPlayAudio">
								<image src="../static/playAudio.png" class="tmOprImg" mode=""></image>
								<view class="tmOprText">
									播放录音
								</view>
							</view>
							<!-- 播放中 -->
							<view class="tmOpr" v-if="audioPlaying" @tap="toStopPlayAudio">
								<image src="../static/pauseAudio.png" class="tmOprImg" mode=""></image>
								<view class="tmOprText">
									播放中{{recordPlayTimeFormat}}
								</view>
							</view>
						</view>
						<view class="toRight">
							<!-- 点击上传 -->
							<view class="tmOpr" v-if="startAudio && !audioing" @tap="toUploadAudio">
								<image src="../static/upload.png" class="tmOprImg" mode=""></image>
								<view class="tmOprText">
									上传
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="boxBoo">
					<image @tap="hideModalRecord" class="close" src="../static/closeModal.png" mode=""></image>
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
		},
		showTextarea:{
			type:Number,
			default:1
		}
	},
	watch:{
		showTextarea(val){
			if(val == -1){
				this.$set(this.oprations[0],"active",false)
			}
		}
	},
	data(){
		return {
			oprations: [
				{
					imgUrl0: require('../static/work10.png'),
					imgUrl1: require('../static/work11.png'),
					text: '文本',
					active: false
				},
				{
					imgUrl0: require('../static/work20.png'),
					imgUrl1: require('../static/work21.png'),
					text: '图片',
					active: false
				},
				{
					imgUrl0: require('../static/work30.png'),
					imgUrl1: require('../static/work31.png'),
					text: '语音',
					active: false
				},
				{
					imgUrl0: require('../static/work40.png'),
					imgUrl1: require('../static/work41.png'),
					text: '视频',
					active: false
				}
			],
			startAudio: false, //点击录音按钮后变成true，只能重录或者上传完成才能改成false
			audioing: false, //是否录音中
			audioPlaying: false, //是否播放录音中
			modalName: null,
			modalType: '', //大图还是视频1大图，2视频
			modalImgUrl: '',
			modalVideoSrc: '',
			recorderManager:null,  //录音管理器
			innerAudioContext:null,  //录音播放管理器
			voiceTempPath:"",  //录音缓存路径
			recordTimer:null,  //录音计时器
			recordingTime:0,  //录音中的时长（未格式化）
			recordingTimeFormat:"00:00",  //录音中的时长（格式化）
			recordPlayTime:0,  //录音播放时长
			recordPlayTimeFormat:"00:00",  //录音播放时长格式化
			zipVideo: true, //视频压缩
			
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
		hideTextarea(){
			this.$set(this.oprations[0],"active",false)
		},
		
		
		//开始播放已上传的音频
		playUploadAudio(index){
			this.hideTextarea();
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
		
		
		//文本输入
		textInput(e){
			this.mediaDataChange(0,e.detail.value)
		},
		//开始录音
		toStartAudio() {
			this.recordingTime = 0;
			this.recordingTimeFormat = "00:00"
			this.startAudio = true;
			this.audioing = true;
			this.recorderManager.start({format:'mp3'});
			console.log("开始录音")
		},
		//结束录音
		toFinishAudio() {
			this.audioing = false;
			this.recorderManager.stop();
			this.clearRecordTimer();
			console.log('录音结束');
		},
		//播放录音
		toPlayAudio() {
			console.log(this.voiceTempPath)
			this.audioPlaying = true;
			this.innerAudioContext.src = this.voiceTempPath;
			this.innerAudioContext.play();
			console.log("播放录音")
		},
		//停止播放录音
		toStopPlayAudio() {
			this.audioPlaying = false;
			this.innerAudioContext.stop();
		},
		//重录
		toReRecord() {
			this.startAudio = false;
			this.audioing = false;
		},
		//上传录制的音频
		async toUploadAudio() {
			this.startAudio = this.audioPlaying = false;
			this.$set(this.oprations[2], 'active', false);
			uni.showLoading({
				title:"上传中...",
				mask:true
			})
			try{
				let ret = await this.$upLoadImg({
					apiName:"upLoadFile",
					filePath:this.voiceTempPath,
					name:"file"
				});
				this.mediaDataChange(2,{
					audioUrl:ret.data,
					time:this.recordingTimeFormat
				})
				this.hideModal()
			}catch(e){
				console.log("音频上传错误：",e)
			}finally{
				uni.hideLoading()
			}
		},
		showImg(imgUrl) {
			this.hideTextarea();
			this.modalType = 1;
			this.modalImgUrl = imgUrl;
			this.modalName = 'Modal';
		},
		//播放已上传的视频
		playVideo(videoSrc) {
			this.hideTextarea();
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
			this.hideTextarea()
			let _this = this;
			uni.showModal({
			    title: '提示',
			    content: '删除该文件将无法恢复，确定删除？',
			    success: function (res) {
					if(res.confirm){
						_this.$emit('mediaDelete',type,index)
					}
			    }
			});
		},
		changeZip(e) {
			if (e.detail.value[0]) {
				this.zipVideo = true;
			} else {
				this.zipVideo = false;
			}
		},
		initRecord(){
			this.recorderManager = uni.getRecorderManager();
			this.innerAudioContext = uni.createInnerAudioContext();
			let self = this;
			this.recorderManager.onStart(function (res) {
				self.clearRecordTimer()
				self.recordTimer = setInterval(()=>{
					self.recordingTime ++;
					self.recordingTimeFormat = utils.exRecordTime(self.recordingTime);
					console.log("录制中：",self.recordingTime,self.recordingTimeFormat)
				},1000)
			});
			this.recorderManager.onStop(function (res) {
				console.log('录音结束：' , res);
				self.voiceTempPath = res.tempFilePath;
			});
			this.innerAudioContext.onTimeUpdate(()=>{
				self.recordPlayTime = Math.floor(self.innerAudioContext.currentTime)
				self.recordPlayTimeFormat = utils.exRecordTime(self.recordPlayTime);
				console.log(`录音总时间：${self.innerAudioContext.duration}，当前播放时间：${self.recordPlayTime}`)
			})
			this.innerAudioContext.onEnded(()=>{
				self.toStopPlayAudio()
			})
		},
		clearRecordTimer(){
			clearInterval(this.recordTimer);
			this.recordTimer = null;
		},
		async toOpration(index) {
			if (index == 0) {  //文本输入
				this.$set(this.oprations[0], 'active', true);
			}else{
				this.$set(this.oprations[0], 'active', false);
				if (index == 1) {  //图片上传
					uni.showLoading({
						title:"上传中...",
						mask:true
					})
					try{
						let _img_url = await utils.uploadFile();
						if(_img_url){
							this.mediaDataChange(1,_img_url)
						}
					}catch(e){
						console.log("图片上传错误:",e)
						//TODO handle the exception
					}finally{uni.hideLoading()}
				} else if (index == 2) {  //录音
					if (!this.oprations[index].active) {
						//显示录音组件
						this.modalName = 'ctrl';
						this.$set(this.oprations[index], 'active', true);
						this.initRecord()
					} else {
						if (!this.startAudio) {  //非录音状态处理
							this.$set(this.oprations[index], 'active', false);
						}else{  //录音状态关闭录音按钮激活显示，只有显示录音按钮才可以关闭
							uni.showToast({
								title:"录音状态下不能关闭",  
								icon:"none"
							})
						}
					}
				} else if (index == 3) {  //上传视频
					uni.showLoading({
						title:"上传中...",
						mask:true
					})
					try{
						let _video_url = await utils.uploadVideo(this.zipVideo);
						if(_video_url){
							this.mediaDataChange(3,_video_url)
						}
					}catch(e){
						console.log("视频上传错误：",e)
					}finally{
						uni.hideLoading()
					}
				}
			}
		},
		mediaDataChange(type,data){
			this.$emit('mediaDataChange',type,data)
		}
	},
}
</script>

<style lang="scss">
.taskData {
	.taskText {
		min-height: 50rpx;
		color: #303133;
		font-size: 32rpx;
		line-height: 44rpx;
	}
	.taskText2{
		word-wrap:break-word;
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
				background-color: #FDC623!important;
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
