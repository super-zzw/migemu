<template>
    <view class="location">
        <map class="map" :latitude="latitude" :longitude="longitude" :markers="covers"></map>
    </view>
</template>
<script>
import { mapState } from 'vuex';
export default {
    data() {
        return {
			id:0, // 使用 marker点击事件 需要填写id
            title: 'map',
            latitude: '',
            longitude: '',
            covers: [{
                latitude: '',
                longitude: '',
                iconPath: '../../static/location.png'
            }]
        }
    },
	computed:{
		...mapState(['location'])
	},
	onLoad() {
		this.latitude = this.location.latitude;
		this.longitude = this.location.longitude;
		this.title = this.location.title;
		this.covers[0].latitude = this.location.latitude;
		this.covers[0].longitude = this.location.longitude;
	}
}
</script>

<style lang="scss" scoped>
.location{
	min-height: 100vh;
	.map{
		width: 100vw;
		height: 100vh;
	}
}
</style>
