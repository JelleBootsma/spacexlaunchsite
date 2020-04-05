import { executeGraphQLQuery } from "./fetch.js";





var launchesApp = new Vue({
    el: '#launchesApp',
    data: {
        launches: [
        ]
    },
    mounted: function (newLaunches) {
        this.updateLaunches(newLaunches);
    },
    methods:{
        updateLaunches: function (newLaunches) {
            this.launches = newLaunches;
        }
    }
})


let launchesQuery = '{ launches { rocket { rocket_name rocket_type } links { flickr_images } mission_name details launch_date_utc } }';
executeGraphQLQuery(launchesQuery).then(data => launchesApp.updateLaunches(data.data.launches));
