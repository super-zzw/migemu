//接口
export default{
	/**
	 * 公共接口
	 */
	bannerList:"/pub/get/bannerList",  //首页轮播图
	courseList:"/pub/get/courseList",  //课程列表，首页和更多页
	getConfig:"/pub/getConfig",  //项目配置
	sendCode: "/pub/sendAuthCode" , // 发送手机验证码 POST
	courseInfo:"/pub/get/courseInfo",  //获取课程详情
	schoolList:"/pub/get/schoolList",  //获取线下课上课地点
	teacherInfo:"/pub/get/teacherInfo",  //获取教师信息
	commentList:"/pub/get/commentList",  //获取课程评价列表
	article:"/pub/get/article",  //文章详情，1用户协议，2隐私协议，3课程协议，4如何上课，5关于华羽
	checkRecommendCode:"/pub/get/teacherByRecommendCode",  //推荐校验码
	orderCourse:"/pay/delete/courseMaterial",  //购买课程下单
	upLoadFile:"/pub/file",  //文件上传
	remindList:"/pub/get/remind/list",  //获取通知列表
	noticeList:"/pub/get/notice/list",  //获取提醒列表
	noticeDetail:"/pub/get/notice/info",  //获取通知详情
	getAuditionTeacher: "/user/get/getTeacher", // 获取体验老师资料
	/**
	 * 小程序登录和个人中心接口
	 */
	isBindRoutine: "/user/loginCheck" , // 检验是否已经绑定过了
	checkTeacher: "/user/checkTeacher", // 检验是否可为老师注册 POST
	getUserInfo: "/user/getInfo", // 获取用户信息
	getStudentList: "/user/getStudentList", //获取角色下的学员列表 GET
	getUserPhone: "/user/getWxMobile" , // 获取用户手机号  GET
	perfectInfo: "/user/perfectInfo", //完善用户信息 POST
	userRegister: "/user/register", //微信用户注册
	switchRole: "/user/switchRole", //切换角色
	switchStudent: "/user/switchStudent", //切换学员
	changePhone: "/user/changePhone" , //修改用户手机号
	checkPhone: "/user/checkPhone" , //判断手机号是否被使用过
	cacheJsCode: "/user/cacheJsCode" , //缓存jsCode
	submitAudition: "/user/post/audition" , //体验课提交
	isSumibtAudition: "/user/checkTrialClass" , //是否已经有体验课资格了
	
	/**
	 * 学生接口
	 */
	getSumStudetnI: "/student/getStudent", // 获取总积分
	getNotLessonsList: "/student/getAwaitLessonsList" , //获取待上课节
	getIntegral: "/student/getIntegral", // 获取积分明细
	getCourseList: "/student/getCourseList" , // 获取课程列表
	getCourseDate: "/student/getCourseDate" , //获取课程日历
	getLessonsList: "/student/getLessonsList", //获取课节展示 
	getCourseGeneralSituation: "/student/courseGeneralSituation", //课程概况
	getReservationLessonList: "/student/getReservationLesson", //预约上课列表
	getCiyrseNaterialL :"/student/getCourseMaterial", //获取课程资料
	getMyReservationLesson: "/student/getMyReservationLesson", // 获取我的约课列表
	getReservationLesson: "/student/reservationLesson" , //立即预约
	getCancelReservationLesson: "/student/cancelReservation", //取消预约
	getTeacher: "/student/getContactTeacher", // 获取联系老师
	postCourseComment: "/student/postCourseComment" , //提交课程评价
	lookCommentCourse: "/student/getCommentCourse", //查看课程评价
	taskList:"/student/studentMyJob",  //我的作业列表
	withdraw:"/student/withdraw",  //邀请返利申请提现
	stdentTaskDetail:"/student/getJobDetail",  //学生作业详情
	rebateData:"/student/getMyRebate",  //获取我的返利数据
	rebateRecord:"/student/get/inviteList",  //邀请记录
	getStudentLessonDetail: "/student/getLessonDetail" , //获取课节详情
	studentSign: "/student/signIn" , //上课签到
	studentCommentTeacher: "/student/commentTeacher" , //评价老师
	getStudentHour: "/student/getClassHour" , //我的课时
	getClassHourDetail: "/student/getClassHourDetail", //课时详情
	getConsumeLog: "/student/getConsumeLog" , //消耗记录
	submitTask:"/student/subStudentJob",  //学生提交作业
	/**
	 * 教师接口
	 */
	rankList:"/teach/get/teacher/rank",  //教师排行榜
	unKpStudents:"/teach/get/comment/student/list",  //获取未课评的学生列表
	uploadDataList:"/teach/list/courseMaterial",  //教师资料上传列表
	kpStudent:"/teach/update/comment/student",  //教师对学生课评
	materialUpload:"/teach/upload/courseMaterial",  //课后管理资料上传
	materialDetail:"/teach/getCourseMaterial",  //课程资料详情
	deleteMaterialDetail:"/teach/delete/courseMaterial",  //教师删除课程资料
	teacherTaskCourseList:"/teach/get/course/list",  //老师作业管理对应课程列表
	lessionList:"/teach/get/arrange/lesson",  //获取所有课节
	lessionStudent:"/teach/get/arrange/student",  //获取该课程的所有学生
	makeTask:"/teach/homeWork",  //布置作业 POST
	lessionTaskList:"/teach/get/homeWork/list",  //获取课节的作业列表GET
	lessionTaskDetail:"/teach/get/job/info",  //获取作业详情GET
	lessionTaskDetail2:"/teach/get/homeWork/info",  //获取作业详情，查看用，统一返回字段
	deleteTask:"/teach/delete/job",  //删除作业GET
	getTeacherCourseCount: "/teach/get/course/statistics" , //老师-课时统计
	getTeachSelectDate: "/teach/get/arrangeLessons/selectDate" , // 老师首页-根据时间获取排课课节列表
	didTaskStudentList:"/teach/get/homeWork/studentList",  //获取已经做了某个作业的学生列表
	studentTaskDetail:"/teach/get/homeWork/student/info",  //获取某个学生的做的作业详情和教师评阅
	teacherGetCourseDate: "/teach/getCourseDate" , //老师获取课程日历
	teacherGetLessonsList: "/teach/getLessonsList", //老师获取课节展示 

	getTeacherLessonsInto: "/teach/getLessons/into" , //获取课节详情
	updateLiveInfo: "/teach/update/liveInfo" , // 修改直播信息
	updateStatus: "/teach/update/status", // 结课
	updateSignIn: "/teach/update/signIn", //老师代学生签到/请假等
	teacherLookStudetn: "/teach/get/comment/student" , //老师查看学生课评

	reviewTask:"/teach/get/homeWork/examine",  //批阅学生作业POST
	repluseTask:"/teach/get/homeWork/repulse",  //作业打回重做POST
	taskClass:"/teach/get/arrange/course",  //获取可以布置作业的课程列表

}