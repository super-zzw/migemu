<template>
	<view class="taskMake">
		<view class="makeTaskInfo">
			<view class="apply-row flex flex-column justify-center align-center">
				<view class="apply-title"><text>作业标题</text></view>
				<input type="text" v-model="title" placeholder="请输入作业标题" placeholder-class="placeholder"/>
			</view>
		</view>
		<view class="makeTaskInfo">
			<view class="apply-row flex flex-column justify-center align-center">
				<view class="apply-title"><text>作业对应课程课节</text></view>
				<picker class="tmPicker" @change="lessionChange" range-key="lessonTitle" :value="lessionIndex" :range="lessionList">
					<view class="uni-input uni-inputLession" v-if="lessionIndex">
						{{lessionList[lessionIndex].lessonTitle}}
					</view>
					<view class="uni-input uni-input2" v-else>请选择对应课程课节</view>
				</picker>
			</view>
		</view>
		<view class="makeTaskInfo">
			<view class="apply-row flex flex-column justify-center align-center">
				<view class="apply-title"><text>作业类型</text></view>
				<picker class="tmPicker" @change="maskTypeChange" range-key="label" :value="typeIndex" :range="maskTypeList">
					<view class="uni-input" v-if="typeIndex">
						{{maskTypeList[typeIndex].label}}
					</view>
					<view class="uni-input uni-input2" v-else>选择作业类型</view>
				</picker>
			</view>
		</view>
		<view class="makeTaskInfo">
			<view class="apply-row flex flex-column justify-center align-center">
				<view class="apply-title"><text>作业布置对象</text></view>
				<view class="tmPicker" @tap="showModal" data-target="bottomModal">
					<view class="uni-input uni-inputLession" v-if="studentNames">
						{{studentNames}}
					</view>
					<view class="uni-input uni-input2" v-else>请选择作业布置对象</view>
				</view>
			</view>
		</view>
		<view class="makeTaskInfo">
			<view class="apply-row flex flex-column justify-center align-center">
				<view class="apply-title"><text>作业提交截止时间</text></view>
				<picker class="tmPicker" mode="date" @change="bindDateChange" :start="startDate" :end="endDate" :value="endTime">
					<view class="uni-input" v-if="endTime">
						{{endTime}}
					</view>
					<view class="uni-input uni-input2" v-else>请选择截止日期</view>
				</picker>
			</view>
		</view>
		<view class="taskBox taskBoxMedia">
			<mediaData :showTextarea="showTextarea" :taskData="taskData" :textPlaceholder="textPlaceholder" @mediaDataChange="mediaDataChange" @mediaDelete="mediaDelete"></mediaData>
		</view>
		<view class="taskOpr">
			<view class="taskBtn" @tap="submit">
				保存
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="modalName=='bottomModal'?'show':''">
			<view class="cu-dialog myDialog">
				<view class="cu-bar bg-white">
					<view class="action cancel" @tap="hideModal(false)">取消</view>
					<view class="action sure" @tap="checkStudent">确定</view>
				</view>
				<view class="padding-xl">
					<checkbox-group class="block" @change="checkBoxChange">
						<view class="cu-list menu text-left">
							<view class="cu-item" v-for="(item,index) in studentList" :key="index">
								<label class="flex justify-between align-center flex-sub">
									<view class="flex-sub">{{item.name}}</view>
									<checkbox :value="item.id" :checked="item.checked" color="#FFCC33" style="transform:scale(0.7)" />
								</label>
							</view>
						</view>
					</checkbox-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import taskItem from '@/components/taskItem.vue'
import taskCourse from '@/components/taskCourse.vue'
import mediaData from '@/components/mediaData.vue'
import utils from '../../utils/method.js'
export default{
	components:{
		taskItem,
		taskCourse,
		mediaData
	},
	data(){
		return {
			showTextarea:1,  //用于控制子组件mediaData的textarea的显示和隐藏
			textPlaceholder:"请输入作业内容",
			modalName:null,
			starNm:3,
			showDetail:false,
			taskData: {
				content: '',
				picList: [],
				voiceList: [],
				videoList: [],
			},
			lessionList:[],
			lessionIndex:"",  //课程列表的index
			studentList:[],
			studentId:[],
			studentNames:"",
			studentIdTemp:[],
			maskTypeList:[
				{
					label:"课前作业",
					id:0
				},
				{
					label:"课后作业",
					id:1
				}
			],
			typeIndex:"",  //作业类型列表的index
			endTime:"",  //截止时间
			title:"",  //作业标题
			taskId:"",  //作业编辑id
			arrangeCourseId:"",  //课程id
		}
	},
	async onLoad(opt) {
		if(opt.cid){
			this.arrangeCourseId = opt.cid;
			await this.getLessionList();
		}
		if(opt.id){
			this.taskId = opt.id;
			this.getEditData()
		}
	},
	computed:{
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	methods:{
		//获取待编辑的数据
		async getEditData(){
			uni.showLoading({
				title:"数据加载中...",
				mask:true
			})
			try{
				let res = await this.$http({
					apiName:"lessionTaskDetail",
					data:{
						lessonJobId:this.taskId
					}
				})
				this.taskData = {
					content:res.data.content,
					picList:res.data.picList || [],
					voiceList:res.data.voiceList || [],
					videoList:res.data.videoList || []
				}
				for(let i in this.lessionList){
					if(this.lessionList[i].arrangeCourseLessonId == res.data.arrangeCourseLessonId){
						console.log(i,this.lessionList[i])
						this.lessionIndex = i;
						break
					}
				}
				await this.getLessionStudent(res.data.arrangeCourseLessonId);
				({
					endTime:this.endTime,
					studentId:this.studentId,
					title:this.title
				} = res.data);
				this.endTime = utils.unixToDatetime(this.endTime,3)
				for(let j in this.maskTypeList){
					if(this.maskTypeList[j].id == res.data.type){
						this.typeIndex = j;
						break
					}
				}
				
				for(let item of this.studentList){
					if(this.studentId.indexOf(item.id) > -1){
						this.studentNames = this.studentNames + item.name + '，'
					}
				}
				this.setStudentCheck()
			}catch(e){
				//TODO handle the exception
			}finally{
				uni.hideLoading()
			}
		},
		//获取作业课节列表
		async getLessionList(){
			uni.showLoading({
				title:"数据加载中..."
			})
			try{
				let res = await this.$http({
					apiName:"lessionList",
					data:{
						arrangeCourseId:this.arrangeCourseId
					}
				})
				this.lessionList = res.data;
			}catch(e){
				//TODO handle the exception
			}
			uni.hideLoading()
		},
		//获取布置作业学生列表
		async getLessionStudent(id){
			uni.showLoading({
				title:"数据加载中...",
				mask:true
			})
			try{
				let res = await this.$http({
					apiName:"lessionStudent",
					data:{
						arrangeLessonId:id
					}
				})
				this.studentList = res.data;
				this.studentList.map(item => {
					this.$set(item,"checked",false)
				})
			}catch(e){
				//TODO handle the exception
			}
			uni.hideLoading()
		},
		showModal(e) {
			if(!this.lessionIndex){
				uni.showToast({
					title:"请选择对应课程课节",
					icon:"none"
				})
				return
			}else{
				this.showTextarea = -1;
				this.modalName = e.currentTarget.dataset.target;
			}
		},
		hideModal() {
			this.modalName = null;
			this.studentIdTemp = [];
			this.setStudentCheck()
		},
		checkStudent(){
			if(this.studentIdTemp.length > 0){
				this.studentId = this.studentIdTemp;
			}
			this.getCheckNames();
			this.hideModal();
		},
		getCheckNames(){
			this.studentNames = "";
			this.studentList.map(item => {
				if(this.studentId.indexOf(String(item.id)) > -1){
					this.studentNames = this.studentNames + item.name + "，";
				}
			})
		},
		//设置学生选中
		setStudentCheck(){
			let _list = [];
			this.studentId.map(item => {
				_list.push(Number(item))
			})
			this.studentList.map(data => {
				if(_list.indexOf(data.id) > -1){
					data.checked = true
				}else{
					data.checked = false
				}
			})
		},
		checkBoxChange(e){
			this.studentIdTemp = e.detail.value;
		},
		async lessionChange(e){
			this.lessionIndex = e.detail.value;
			let _id = this.lessionList[this.lessionIndex].arrangeCourseLessonId;
			await this.getLessionStudent(_id);
		},
		maskTypeChange(e){
			this.typeIndex = e.detail.value;
		},
		bindDateChange(e) {
			this.endTime = e.detail.value
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();

			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				year = year + 2;
			}
			month = month > 9 ? month : '0' + month;;
			day = day > 9 ? day : '0' + day;
			return `${year}-${month}-${day}`;
		},
		mediaDataChange(type,data){
			if(type == 0){
				this.taskData.content = data;
			}else if(type == 1){
				this.taskData.picList.push(data)
			}else if(type == 2){
				this.taskData.voiceList.push(data)
			}else if(type == 3){
				this.taskData.videoList.push(data)
			}
		},
		mediaDelete(type,index){
			if(type == 1){
				this.taskData.picList.splice(index,1)
			}else if(type == 2){
				this.taskData.voiceList.splice(index,1)
			}else if(type == 3){
				this.taskData.videoList.splice(index,1)
			}
		},
		async submit(){
			let _jdata = [
				{
					data:this.title.trim(),
					info:"请输入作业标题"
				},
				{
					data:this.lessionIndex,
					info:"请选择对应课程课节"
				},
				{
					data:this.typeIndex,
					info:"请选择作业类型"
				},
				{
					data:this.studentNames,
					info:"请选择作业布置对象"
				},
				{
					data:this.endTime,
					info:"请选择截止日期"
				},
				{
					data:(!this.taskData.content.trim() && 
					!this.taskData.picList.length &&
					!this.taskData.voiceList.length &&
					!this.taskData.videoList.length) ? "" : 1,
					info:"请输入作业内容"
				}
			]
			let jres = await utils.judgeData(_jdata);
			if(jres){
				uni.showLoading({
					title:"提交中...",
					mask:true
				})
				try{
					let res = await this.$http({
						apiName:"makeTask",
						method:"POST",
						data:{
							jobId:this.taskId || "",
							content:this.taskData.content,
							videoList:this.taskData.videoList,
							picList:this.taskData.picList,
							voiceList:JSON.stringify(this.taskData.voiceList),
							arrangeCourseLessonId:this.lessionList[this.lessionIndex].arrangeCourseLessonId,
							endTime:this.endTime,
							studentId:this.studentId,
							title:this.title,
							type:this.maskTypeList[this.typeIndex].id
						}
					})
					if(res){
						uni.showToast({
							title:"提交成功"
						})
						setTimeout(_=>{
							uni.navigateBack()
						},1500)
					}
				}catch(e){
					//TODO handle the exception
				}finally{
					uni.hideLoading()
				}
			}
		}
	},
}
</script>

<style lang="scss" scoped>
.taskMake{
	min-height: 100vh;
	background-color: #fff;
	box-sizing: border-box;
	padding: 32rpx;
	padding-bottom: 150rpx;
	.apply-row{
		width: 100%;
		height: 160rpx;
		padding: 0 32rpx;
		position: relative;
		&:first-child{
			margin-top: 20rpx;
		}
		input{
			font-size: 30rpx;
			margin-top: 16rpx;
			width: 686rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius:44rpx;
			border:2rpx solid rgba(192,196,204,1);
		}
		.uni-input2{
			color: #909399;
			font-size: 28rpx;
		}
		.place{
			font-size: 30rpx;
			color: #909399;
		}
		.apply-title{
			color: #303133;
			font-size: 32rpx;
			font-weight: bold;
			
		}
		.tmPicker{
			font-size: 30rpx;
			margin-top: 16rpx;
			width: 686rpx;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			border-radius: 44rpx;
			border: 2rpx solid #c0c4cc;
			.uni-inputLession{
				overflow-y: hidden;
				overflow-x: auto;
				box-sizing: border-box;
				height: 80rpx;
				white-space: nowrap;
			}
		}
	}
	.taskBox{
		box-shadow:0px 4px 24px 0px rgba(0,0,0,0.08);
		border-radius:12px;
		padding: 30rpx;
		background-color: #fff;
		overflow: hidden;
		.detailMore{
			padding: 30rpx;
			padding-top: 0;
			.detailDesc{
				color: #909399;
				font-size: 28rpx;
				line-height: 44rpx;
			}
			.detailImgBox{
				display: flex;
				flex-flow: row wrap;
				justify-content: space-between;
				.detailImg{
					width: 194rpx;
					height: 194rpx;
					border-radius: 8rpx;
					margin-top: 20rpx;
					
				}
			}
		}
		.chachaBox{
			position: absolute;
			right: 0;
			top: 0;
			border-radius:0px 8rpx 0px 8rpx;
			background-color: #F72C2C;
			text-align: center;
			width: 40rpx;
			height: 40rpx;
			line-height: 40rpx;
			.chachaImg{
				width: 18rpx;
				height: 18rpx;
			}
		}
	}
	.taskBoxMedia{
		margin-top: 40rpx;
	}
	.taskOpr{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 140rpx;
		background-color: #fff;
		display: flex;
		justify-content: space-around;
		.taskBtn{
			width: 686rpx;
			height: 88rpx;
			border-radius: 44rpx;
			background-color: #2ACC8C;
			margin-top: 26rpx;
			text-align: center;
			line-height: 88rpx;
			color: #fff;
			font-size: 32rpx;
			font-weight: bold;
		}
	}
	.myDialog{
		.cu-bar{
			border-bottom: 2rpx solid #dee3ec;
		}
		.action{
			font-size: 32rpx;
		}
		.cancel{
			color: #8799A3;
		}
		.sure{
			color: #2ACC8C;
		}
		.padding-xl{
			padding: 32rpx;
			background-color: #fff;
			/deep/ checkbox .wx-checkbox-input.wx-checkbox-input-checked{
				background-color: #2ACC8C!important;
			}
		}
	}
}
</style>