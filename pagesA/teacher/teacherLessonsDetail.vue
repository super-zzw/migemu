<template>
	<view class="content" v-if="detail">
		<view class="top flex justify-center" >
			<view class="headBg"></view>
			<view class="block ">
				<view class="block-top flex flex-column">
					<view class="block-name flex flex-column">
						<view class="flex ">
							<view class="block-title z">{{detail.courseTitle || ''}}</view>
						</view>
						<view class="m-border">
							<text class="myborder">
								{{ detail.courseType == 0 ? '线下课':'线上课' }}
							</text>
							<text class="myborder">
								{{ detail.courseClassType == 1 ? '1对1':detail.courseClassType == 2?'1对2':'多人小班' }}
							</text>
						</view>
						<view class="block-title ass">{{detail.lessonTitle || ''}}</view>
					</view>
					<view class="text bar-text" v-if="detail.courseType == 0">上课地点：<text>{{detail.schoolName || ''}}</text> </view>
					<!-- <text class="text text-block" v-if="detail.courseType == 0">{{detail.adr2}}</text> -->
					<view class="text " v-if="detail.courseType == 0">课室信息：{{detail.classRoomTitle || ''}}</view>  
					<view class="text xy" v-if="detail.courseType == 1">学员：{{detail.studentNameStr || ''}}</view>
					<view class="text time t" v-if="detail.courseType == 1">上课时间：{{detail.startTime || ''}} {{detail.startTimeStr || ''}}</view>  
					
					<view class="on-line flex flex-column" v-if="detail.courseType == 1 && detail.liveUrl">
						<view class="on-line-col flex align-center" v-if="detail.liveUr">直播课室网址：<text>{{detail.liveUrl}} </text><image @tap.stop="copy(detail.liveUrl)" src="../../static/my/oncopy.png" mode=""></image></view>
						<view class="on-line-col flex align-center" v-if="detail.liveNumber">直播课室号码：<text>{{detail.liveNumber}} </text><image @tap.stop="copy(detail.liveNumber)" src="../../static/my/oncopy.png" mode=""></image></view>
						<view class="on-line-col flex align-center" v-if="detail.livePwd">直播课室密码：<text>{{detail.livePwd}} </text><image @tap.stop="copy(detail.livePwd)" src="../../static/my/oncopy.png" mode=""></image></view>
					</view>
				</view>
				<!-- 线下 -->
				<view class="block-bottom flex" v-if="detail.courseType == 0">
					<view class="block-bottom-col flex align-center justify-center" v-if="detail.status == 0" @tap="finish" data-target="Modal">
						<image src="../../static/teacher/jieke.png" ></image>
						结课
					</view>
					<view class="block-bottom-col flex align-center justify-center"  v-else @tap="noCancel" data-target="Modal">
						<image src="../../static/teacher/qxjk.png" ></image>
						取消结课
					</view>
					<view class="block-bottom-col flex align-center justify-center" @tap="navTo('./taskQear')" data-target="Modal">
						<image src="../../static/teacher/bz.png" ></image>
						布置作业
					</view>
				</view>
				<!-- 线下 -->
				<!-- 线上 -->
				<view class="block-bottom flex" v-else>
					<view class="block-bottom-col flex align-center justify-center" v-if="!detail.livePwd" @tap="showModal($event,'write')" data-target="Modal">
						<image src="../../static/teacher/txks.png" ></image>
						填写课室号
					</view>
					<view class="block-bottom-col flex align-center justify-center" v-else @tap="showModal($event,'write')" data-target="Modal">
						<image src="../../static/teacher/xgks.png" ></image>
						修改课室号
					</view>
					<view class="block-bottom-col flex align-center justify-center" v-if="detail.status == 0" @tap="finish" data-target="Modal">
						<image src="../../static/teacher/jieke.png" ></image>
						结课
					</view>
					<view class="block-bottom-col flex align-center justify-center" v-else @tap="noCancel" data-target="Modal">
						<image src="../../static/teacher/qxjk.png" ></image>
						取消结课
					</view>
					<!-- <view class="block-bottom-col flex align-center justify-center" @tap="navTo('./taskQear?cid=' + detail.arrangeCourseId)" data-target="Modal">
						<image src="../../static/teacher/bz.png" ></image>
						布置作业
					</view> -->
				</view>
				<!-- 线上 -->
			</view>
		</view>
		<!--  -->
		<view class="c-block ">
			<view class="c-title">签到课评</view>
			<view class="row flex" > 
				<view class="flex align-center">
					<text>{{detail.realNum}}</text>实到
				</view>
				<view class="flex align-center">
					<text>{{detail.signNum}}</text>签到
				</view>
				<view class="flex align-center">
					<text>{{detail.stuNum}}</text>应到
				</view>
			</view>
			<view class="c-student flex justify-between">
				<view class="c-s-block flex flex-column align-center"  v-for="(list,index) in detail.studentNameList" :key="list.id">
					<image :src="list.studentAvatar" mode=""></image>
					<view class="noi flex align-center">
						<text class="name">{{list.studentName}}</text>
						<text class="iden">学员</text>
					</view>
					<view class="many flex align-center">
						<text>已上：{{list.useTime}}</text>
						<text class="m-border"></text>
						<text>剩余：{{list.courseTime - list.useTime}}</text>
					</view>
					<view class="btns">
						<text class="grayBg" v-if="list.signInFlag == 0 "  @tap="showModal($event,'sign',index)" data-target="Modal">未签到</text>
						<text class="greenBg" v-else @tap="showModal($event,'sign',index)" data-target="Modal">已签到</text>
						<text class="grayBg" :data-id="list.studentReservedLessonId" :data-name="list.studentName" @tap="navToFillClass(`./fillClass`,$event)" v-if="!list.commentStudentId">未课评</text>
						<text class="greenBg" :data-name="list.studentName" @tap="navToSoure(index,$event)" v-else>已课评</text>
					</view>
				</view>
			</view>
		</view>

		
		<view class="cu-modal" :class="modalName=='Modal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="boxTop flex align-center flex-column justify-center">
					<view class="c-sign flex flex-column align-center" v-if="type === 'sign'">
						<view class="boxTop-name">学员：{{clickName}}</view>
						<view class="switch flex align-center justify-between">
							<text>扣课时</text>
							<switch checked="true" @change="switchChange" />
						</view>
						<view class="select flex flex-column ">
							<text class="tips">选择签到状态</text>
							<view class="flex ">
								<text v-for="(item,index) in signStatus" :class="signIndex === index ?'active':''" @tap="changeSignStatus(index)" :key="item.id">{{item}}</text>
							</view>
						</view>
						<input type="text" class="cause" v-model="qCause" placeholder="请输入请假原因" v-if="signIndex == 1"/>
						<view class="btns flex align-center justify-center" >
							<button class="cancel green" @tap="updateStudentStatus">确定</button> 
							<button class="cancel gray" @tap="hideModal">取消</button> 
						</view>
					</view>
					<view class="write flex flex-column align-center" v-else-if="type === 'write'">
						<input type="text" v-model="liveNumber" placeholder="请填写直播室号码" placeholder-class="placeholder"/>
						<input type="text" v-model="liveUrl" placeholder="请填写直播室网址" placeholder-class="placeholder"/>
						<input type="text" v-model="livePwd" placeholder="请填写直播室密码" placeholder-class="placeholder"/>
						<view class="btns flex align-center justify-center" >
							<button class="cancel green" @click="confirmLive">确定</button> 
							<button class="cancel gray" @tap="hideModal">取消</button> 
						</view>
					</view>
				</view>
				<view class="boxBoo">
					<image @tap="hideModal" class="close" src="../../static/closeModal.png" mode=""></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from "../../utils/method.js"
	export default{
		data(){
			return{
				notStart: [],
				imgSrcs:[],
				modalName:null,
				type:'',
				textData: [{
					color: "#FDC623",
					text: "线下课"
				},
				{
					color: "#2ACC8C",
					text: "1对1"
				}],
				signStatus:['已到达','请假','迟到','早退','旷课'],
				signIndex:-1,
				form: 1, // 1是线上，0是线下
				arrangeCourseLessonId: null , // 排课课节id
				detail: null,
				liveUrl: "",
				liveNumber: "",
				livePwd: "",
				isDownCourse: true, // 是否扣课时
				qCause: "", // 请假原因，请假才需要
				studentCourseId: null , //点击的约课ID
				clickIndex: null, // 点击的下标
				clickName: null , //点击的名称
			}
		},
		onLoad({aid}) {
			aid && (this.arrangeCourseLessonId = aid);
		},
		onShow() {
			this.getTLessonsDetail();
		},
		methods:{
			showModal(e,type,index) {
				console.log(index)
				this.modalName = e.currentTarget.dataset.target;
				this.type = type;
				this.studentCourseId = this.detail.studentNameList[index].studentReservedLessonId;
				this.clickIndex = index;
				this.clickName = this.detail.studentNameList[index].studentName;
			},
			hideModal(e) {
				this.modalName = null;
			},
			switchChange(e){
				console.log(e);
				this.isDownCourse = e.detail.value;
			},
			changeSignStatus(i){
				this.signIndex = i;
			},
			navTo(path){
				uni.navigateTo({
					url: path
				})
			},
			copy(val){
				this.$copy(val);
			},
			navToSoure(index,e){
				const id = this.detail.studentNameList[index].studentReservedLessonId;
				const name = e.currentTarget.dataset.name;
				this.detail['studentReservedLessonId'] = id;
				this.detail['studentNameStr'] = name;
				this.$store.commit('teacherCommentItemSet',this.detail);
				uni.navigateTo({
					url: "./teacherLookEval?id="+id
				})
			},
			finish(){
				var that = this;
				uni.showModal({
					title: '确认是否结课?',
					content: "结课后不可修改签到状态或取消结课",
					confirmColor: "#FDC623",
					success(res) {
						if(res.confirm){
							that.closeSession();
						}else{
							console.log("点击了取消");
						}
					}
				})
			},
			noCancel(){
				uni.showToast({
					title: '不可取消结课，请联系教务老师',
					icon:'none'
				})
			},
			// 修改课评或者填写直播信息
			async confirmLive(){
				if(!this.liveNumber){
					uni.showToast({
						title: "请输入号码",
						icon:"none"
					});
					return;
				}
				try{
					const { data } = await this.$http({
						apiName: "updateLiveInfo",
						method: "POST",
						data: {
							arrangeCourseLessonId: this.detail.arrangeCourseLessonId ,
							liveNumber: this.liveNumber,
							liveUrl: this.liveUrl,
							livePwd: this.livePwd
						}
					});
					this.detail.liveUrl =  this.liveUrl;
					this.detail.liveNumber = this.liveNumber;
					this.detail.livePwd = this.livePwd;
					uni.showToast({
						title: "修改成功"
					})
					this.hideModal();
				}catch(e){
					console.log(e);
				}
				
			},
			// 结课
			async closeSession(){
				try{
					const { data } = await this.$http({
						apiName: "updateStatus",
						method: "POST",
						data: {
							arrangeCourseLessonId: this.detail.arrangeCourseLessonId
						}
					});
					this.detail.status = 1;
					uni.showToast({
						title: "结课成功"
					})
					this.hideModal();
				}catch(e){
				}
			},
			//修改学生状态
			async updateStudentStatus(){
				const sData = {
					deductionStatus: this.isDownCourse ? '1' : '0',
					signInFlag: Number(this.signIndex) + 2,
					studentCourseId: this.studentCourseId,
				}
				if(this.signIndex == 1){
					if(!this.qCause){
						uni.showToast({
							title: "请输入请假原因",
							icon: "none"
						})
						return;
					}
					sData['reason'] = this.qCause;
				}
				const { data } = await this.$http({
					apiName: "updateSignIn",
					method: "POST",
					data: sData
				});
				uni.showToast({
					title: "签到成功",
					icon: "success"
				})
				this.getTLessonsDetail();
				this.hideModal();
			},
			navToFillClass(path,e){
				const id = e.currentTarget.dataset.id;
				const name = e.currentTarget.dataset.name;
				this.detail['studentReservedLessonId'] = id;
				this.detail['studentName'] = name;
				this.$store.commit('teacherCommentItemSet',this.detail);
				
				uni.navigateTo({
					url: path
				})
			},
			async getTLessonsDetail(){
				uni.showLoading({
					title: "正在加载中",
					mask: true
				})
				try{
					const { data } = await this.$http({
						apiName: "getTeacherLessonsInto",
						method: "GET",
						data: {
							arrangeCourseLessonId: this.arrangeCourseLessonId
						}
					});
					data[0].startTime = utils.unixToDatetime(data[0].startTime,3);
					// if(data[0].schoolName){
					// 	this.getTwoRowAddress(data[0].schoolName,data[0]);
					// }
					this.liveUrl = data[0].liveUrl;
					this.liveNumber = data[0].liveNumber;
					this.livePwd = data[0].livePwd;
					this.detail = data[0];
					
					uni.hideLoading();
				}catch(e){
					uni.hideLoading();
				}
				
			},
			// 把地址分成两行
			// getTwoRowAddress(str,data){
			// 	const reg = /区|镇/;
			// 	if(reg.test(str)){ // 如果匹配
			// 		const result = str.match(reg)[0];
			// 		const resultSplit = str.split(result);
			// 		data.adr1 = resultSplit[0] + result;
			// 		data.adr2 = resultSplit[1];
			// 	}
			// },
		}
	}
</script>

<style scoped lang="scss">
	.content{
		min-height: 100vh;
		background-color: #FFFFFF;
		padding-bottom: 40rpx;
	}
	.top{
		width: 100%;
		background-color: #FFFFFF;
		position: relative;
		.headBg{
			width: 100%;
			height: 284rpx;
			background:linear-gradient(180deg,rgba(42,204,140,1) 0%,rgba(42,204,140,1) 40%,rgba(67,213,155,0) 100%);
			position: absolute;
		}
		.block{
			width: 686rpx;
			height: auto;
			position: relative;
			margin-top: 32rpx;
			background-color: #FFFFFF;
			box-shadow:0px 4px 20px 0px rgba(0,0,0,0.12);
			border-radius:12rpx;
			.block-top{
				padding: 32rpx 32rpx 0;
				.on-line{
					margin-bottom: 30rpx;
					.on-line-col{
						font-size: 28rpx;
						color: #606266;
						line-height: 50rpx;
						text{
							color: #F95C25;
						}
						image{
							width: 36rpx;
							height: 36rpx;
							margin-left: 3rpx;
						}
					}
				}
			}
			.block-name{
				.m-border{
					margin: 10rpx 0;
				}
				.myborder{
					border-radius:21rpx;
					border:2rpx solid #FDC623;
					padding: 4rpx 12rpx;
					font-size: 24rpx;
					margin-right: 10rpx;
					color: #FDC623;
					
				}
				.block-title{
					font-size: 36rpx;
					font-weight: bold;
					margin-right: 20rpx;
					&.z{
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						max-width: 490rpx;
					}
					&.ass{
						max-width: 620rpx;
						margin-top: 4rpx;
						margin-bottom: 18rpx;
						margin-right: 0;
					}
				}
				
			}
			.text{
				font-size: 28rpx;
				color: #606266;
			}
			.total{
				margin: 20rpx 0 16rpx 0;
			}
			.xy{
				margin: 20rpx 0 10rpx ;
			}
			.text-block{
				margin-left: 138rpx;
				margin-top: 10rpx;
				margin-bottom: 10rpx;
			}
			.bar-outer{
				width: 626rpx;
				height: 16rpx;
				background-color: #EDEDED;
				border-radius: 10rpx;
				margin: 12rpx 0 16rpx 0;
				.bar{
					width: 40%;
					height: 100%;
					background-color: #FDC623;
					border-radius: 10rpx;
				}
			}
			.time{
				margin: 16rpx 0 0 0;
				&.t{
					margin-top: 0;
					// margin-bottom: 20rpx;
				}
			}
			.block-bottom{
				width: 100%;
				height: 100rpx;
				border-top: 2rpx solid rgba(0,0,0,.1);
				margin-top: 26rpx;
				.block-bottom-col{
					flex: 1;
					font-size: 30rpx;
					image{
						width: 48rpx;
						height: 48rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
	.c-block{
		margin-top: 40rpx;
		padding: 0 32rpx;
		width: 100%;
		
		.c-title{
			font-size: 34rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			position: relative;
			&::after{
				content: "";
				position: absolute;
				left: -29rpx;
				top: 50%;
				transform: translateY(-50%);
				width: 8rpx;
				height: 40rpx;
				background:#FDC623;
				border-radius:0px 200px 200px 0px;  
			}
		}
		.row{
			margin-bottom: 30rpx;
			view{
				font-size: 26rpx;
				color: #606266;
				margin-right: 50rpx;
				text{
					font-size: 40rpx;
					color: #FDC623;
					margin-right: 10rpx;
					font-weight: bold;
				}
			}
		}
		.c-student{
			flex-wrap: wrap;
			.c-s-block{
				flex: 0 0 334rpx;
				height: 350rpx;
				box-shadow:0px 4px 16px 0px rgba(0,0,0,0.12);
				border-radius:12rpx;
				margin-bottom: 20rpx;
				image{
					width: 88rpx;
					height: 88rpx;
					margin: 40rpx 0 12rpx;
					border-radius: 50%;
				}
				.noi{
					margin-bottom: 22rpx;
					.name{
						font-size: 32rpx;
						font-weight: bold;
						max-width: 240rpx;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
					.iden{
						padding: 4rpx 10rpx;
						background:#FDC623;
						border-radius:200px 0px 18px 200px;
						color: #FFFFFF;font-size: 24rpx;
						margin-left: 20rpx;
					}
				}
				.many{
					margin-bottom: 20rpx;
					text{
						font-size: 28rpx;
					}
					.m-border{
						width: 2rpx;
						height: 38rpx;
						background-color: #C0C4CC;
						margin: 0 16rpx;
					}
				}
				.btns{
					text:first-of-type{
						margin-right: 14rpx;
					}
				}
			}
		}
	}
	.myDialog{
		width: 580rpx;
		text-align: center;
		background: transparent;
		.c-sign{
			width: 100%;
			.cause{
				width: 465rpx;
				height: 70rpx;
				line-height: 70rpx;
				text-align: center;
				font-size: 28rpx;
				border: 2rpx solid #909399;
				border-radius: 26rpx;
			}
			.select{
				align-items: flex-start;
				padding: 0 48rpx 0 56rpx;
				margin-top: 30rpx;
				margin-bottom: 20rpx;
				.tips{
					font-size: 32rpx;
					color: #303133;
				}
				view{
					width: 465rpx;
					flex-wrap: wrap;
					
					text{
						flex-shrink: 0;
						border: 2rpx solid #909399;
						color: #909399;
						font-size: 28rpx;
						padding: 6rpx 20rpx;
						margin-right: 24rpx;
						border-radius:26px;
						margin-top: 20rpx;
						&.active{
							border-color: #FDC623;
							color: #FDC623;
						}
					}
				}
			}
		}
		.boxTop{
			padding: 70rpx 0 68rpx ;
			background-color: #fff;
			border-radius: 12rpx;
			.boxTop-name{
				font-size: 36rpx;
				font-weight: bold;
				margin-top: 10rpx;
				margin-bottom: 62rpx;
			}
			.switch{
				width: 100%;
				padding: 0 48rpx 0 56rpx;
				font-size: 32rpx;
				color: #303133;
				switch{
					transform: scale(.7);
				}
			}
			.write{
				input{
					width: 490rpx;
					height: 80rpx;
					line-height: 80rpx;
					text-align: center;
					border-radius:44rpx;
					border:2rpx solid rgba(192,196,204,1);
					margin-bottom: 40rpx;
					&:first-of-type{
						margin-top: 52rpx;
					}
				}
			}
			.btns{
				width: 530rpx;
				margin-top: 40rpx;
				button{
					width: 228rpx;
					height: 64rpx;
					line-height: 64rpx;
					font-size: 28rpx;
					color: #FFFFFF;
					border-radius: 32rpx;
					&.green{
						background-color: #FDC623;
					}
					&.gray{
						background-color: #C0C4CC;
					}
				}
			}
			.grade{
				margin-top: 12rpx;
				text{
					font-size: 28rpx;
					color: #606266;
				}
				.score{
					margin-top: 20rpx;
					text{
						font-size: 30rpx;
						color: #303133;
						margin-bottom: 0;
					}
				}
				.submitBtn{
					width: 378rpx;
					height: 64rpx;
					line-height: 64rpx;
					background-color: #FDC623;
					border-radius: 32rpx;
					color: #FFFFFF;
					margin: 80rpx 0 40rpx ;
				}
			}
			.sign{
				width: 378rpx;
				height: 64rpx;
				line-height: 64rpx;
				background-color: #FDC623;
				border-radius: 32rpx;
				color: #FFFFFF;
			}
		}
		.boxBoo{
			margin-top: 60rpx;
			text-align: center;
			.close{
				width: 84rpx;
				height: 84rpx;
			}
		}
	}
</style>
