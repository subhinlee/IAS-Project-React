<template>
    <div>
        <div v-for="data in myJson" :key="data.start_time" class="list-group">
            <a href="#" class="list-group-item list-group-item-action">
                <div class="d-flex w-100 justify-content-between">
                    <h5 class="mb-1">heart_rate: {{ data.heart_rate}}</h5>
                    <small class="text-muted">
                        <div id="start_time">start_time: {{ formatTime(data.start_time)}}</div>
                        <div id="end_time">end_time: {{ formatTime(data.end_time)}}</div>
                    </small>
                </div>
                <p class="mb-1">
                    heart_rate_max: {{ data.heart_rate_max}} - heart_rate_min: {{ data.heart_rate_min}}
                </p>
            </a>
        </div>
    </div>
</template>

<script>
import json from '../json/data.json'

//new Date(1535707680000).toString();

export default{
    data(){
        return{
            myJson: json
        }
    },
    methods:{
        formatTime:function(json){
            var dat = new Date(json).toString();
            return dat
        }
    }
}
</script>

<style>
#heart_rate{

}
#heart_rate_max{

}
#heart_rate_min{

}
#start_time{

}
#end_time{
    
}
</style>
