import { executeGraphQLQuery } from "./fetch.js";

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} array to split
 * @param chunk_size {Integer} Size of every group
 */
function Split4withRelHeight(myArray){
    let totalRelativeHeight = getTotalRelHeight(myArray);
    let columnHeight = Math.ceil(totalRelativeHeight/4);
    let resultArray = [];
    let tempArray = [];
    let tempRelHeight = 0;
    //Assume panel with picture is 6x heigth of panel without picture



    for (var index = 0; index < myArray.length; index++) {
        let launch = myArray[index];
        tempArray.push(launch);
        tempRelHeight += launch.relHeight;
        if (tempRelHeight >= columnHeight){
            tempRelHeight = 0;
            resultArray.push([...tempArray]);
            tempArray = [];
        }


    }
    resultArray.push([...tempArray]);

    return resultArray;
}

/**
 *
 * @param myArray
 */
function getTotalRelHeight(myArray){
    let total = 0;
    for (var i = 0; i < myArray.length; i++){
        let launch = myArray[i];
        if (launch.links.flickr_images && launch.links.flickr_images.length > 0){
            launch.relHeight = 6;
            total += 6;
        }else{
            launch.relHeight = 1;
            total += 1;
        }
    }
    return total;
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
            let launchesSplit = Split4withRelHeight(this.launches, 4);
            this.launches1 = launchesSplit[0];
            this.launches2 = launchesSplit[1];
            this.launches3 = launchesSplit[2];
            this.launches4 = launchesSplit[3];

        }
    }
})


let launchesQuery = '{ launches { rocket { rocket_name rocket_type } links { flickr_images } launch_site { site_name_long} mission_name mission_id details launch_date_utc } }';
executeGraphQLQuery(launchesQuery).then(function(data){
    launchesApp.updateLaunches(data.data.launches);
    $(document.body).attr('style', '');
    $(document.body).addClass('lime');
    $(document.body).addClass('lighten-5');
});
