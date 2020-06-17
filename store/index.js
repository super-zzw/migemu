import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

/**
 * 登录要先设置 isLogin userRole 和 userInfo  和 session
 * 退出登录要 清理掉这四个
 */

const store = new Vuex.Store({
	state:{
		isLogin:false,  //是否登录
		inviteCode: "", // 被邀请码,学生购买课程时用到
		userRole:1,  //当前用户角色，1是教师，2是学生
		location:null,  //记录需要跳转到地图的位置信息
		orderInfo:null,  //记录即将购买的订单信息
		jumpPage:{},  //记录登录之后需要调回来的页面以及是否是tab等数据
		config:null,  //配置
		userInfo:{} , // 用户信息 
		orderSchoolList:[],  //线下课订单上课地点
		teacherCommentItem:null,  //教师的课评课程对象
		assessment:'',// 课程评价数据
	},
	mutations:{
		inviteCodeSet(state,data){
			state.inviteCode = data;
		},
		locationSet(state,data){
			state.location = data;
		},
		orderInfoSet(state,data){
			state.orderInfo = data;
		},
		userRoleChange(state,data){
			state.userRole = data;
		},
		isLoginSet(state,data){
			state.isLogin = data;
		},
		jumpPageSet(state,data){
			state.jumpPage['rejectPath'] = data.rejectPath || "";
			state.jumpPage['path'] = data.path || "";
			state.jumpPage['isTab'] = data.isTab || false;
		},
		configSet(state,data){
			state.config = data;
		},
		userInfoSet(state,data){
			let _data = {
				...state.userInfo,
				...data
			}
			state.userInfo = _data;
			if(state.userInfo && state.userInfo.name) {
				state.userInfo.nickName = state.userInfo.name;
			}
		},
		orderSchoolListSet(state,data){
			state.orderSchoolList = data;
		},
		teacherCommentItemSet(state,data){
			state.teacherCommentItem = data;
		},
		assessmentSet(state,data){
			state.assessment = data;
		}
	},
})
export default store