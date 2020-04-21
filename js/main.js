import { executeGraphQLQuery } from "./fetch.js";





var launchesApp = new Vue({
    el: '#launchesApp',
    data: {
        launches: [
        ],
        backgroundPicture: null
    },
    mounted: function (newLaunches) {
        this.updateLaunches(newLaunches);
    },
    methods:{
        updateLaunches: function (newLaunches) {
            newLaunches.sort((a, b) => (a.launch_date_utc > b.launch_date_utc) ? 1 : -1)
            this.launches = newLaunches;
            let pic;
            for (pic in newLaunches) {
                if (newLaunches[pic].links.flickr_images[0]){
                    this.backgroundPicture = newLaunches[pic].links.flickr_images[0];
                    break;
                }
            }
        }
    }
})


let launchesQuery = '{ launches { rocket { rocket_name rocket_type } links { flickr_images } mission_name details launch_date_utc } }';
executeGraphQLQuery(launchesQuery).then(data => launchesApp.updateLaunches(data.data.launches));
