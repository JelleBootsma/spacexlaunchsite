import { executeGraphQLQuery } from "./fetch.js";

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Integer} Size of every group
 */
function chunkArray(myArray, chunk_count){
    let index = 0;
    let arrayLength = myArray.length;
    let tempArray = [];
    let chunk_size = Math.ceil(arrayLength/chunk_count)

    for (index = 0; index < arrayLength; index += chunk_size) {
        let myChunk = myArray.slice(index, index+chunk_size);
        // Do something if you want with the group
        tempArray.push(myChunk);
    }

    return tempArray;
}



var launchesApp = new Vue({
    el: '#launchesApp',
    data: {
        launches: [
        ],
        launches1: [],
        launches2: [],
        launches3: [],
        launches4: [],
        backgroundPicture: null
    },
    mounted: function (newLaunches) {
        this.updateLaunches(newLaunches);
    },
    methods:{
        updateLaunches: function (newLaunches) {
            if (newLaunches == undefined) return;
            newLaunches.sort((a, b) => (a.launch_date_utc > b.launch_date_utc) ? -1 : 1)
            this.launches = newLaunches;
            let pic;
            for (pic in newLaunches) {
                if (newLaunches[pic].links.flickr_images[0]){
                    this.backgroundPicture = newLaunches[pic].links.flickr_images[0];
                    break;
                }
            }
            let launchesSplit = chunkArray(this.launches, 4);
            this.launches1 = launchesSplit[0];
            this.launches2 = launchesSplit[1];
            this.launches3 = launchesSplit[2];
            this.launches4 = launchesSplit[3];

        }
    }
})


let launchesQuery = '{ launches { rocket { rocket_name rocket_type } links { flickr_images } mission_name details launch_date_utc } }';
executeGraphQLQuery(launchesQuery).then(function(data){
    launchesApp.updateLaunches(data.data.launches);
    $(document.body).attr('style', '');
    $(document.body).addClass('lime');
    $(document.body).addClass('lighten-5');
});
