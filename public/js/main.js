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

function isScrolledIntoView(el) {
    var rect = el.getBoundingClientRect();
    var elemTop = rect.top;
    var elemBottom = rect.bottom;

    // Only completely visible elements return true:
    var isVisible = (elemBottom <= window.innerHeight);
    // Partially visible elements return true:
    //isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    return isVisible;
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
        initialLoaded: false,
        launches: [[],[],[],[]],
        allLaunches: [],
        launches1: [],
        launches2: [],
        launches3: [],
        launches4: [],
        allLaunches1: [],
        allLaunches2: [],
        allLaunches3: [],
        allLaunches4: []
    },
    mounted: function (newLaunches) {
        this.updateLaunches(newLaunches);
    },
    methods:{
        updateLaunches: function (newLaunches) {
            if (newLaunches == undefined) return;
            newLaunches.sort((a, b) => (a.launch_date_utc > b.launch_date_utc) ? -1 : 1)
            this.allLaunches = newLaunches;
            let launchesSplit = Split4withRelHeight(this.allLaunches, 4);
            this.allLaunches = launchesSplit;
            for (let i = 0; i < 4; i++){
                this.AddCards(i);
            }
            this.initialLoaded = true;


        },
        AddCards: function (col) {
            let toAdd = 24;
            while (toAdd > 0 && this.launches[col].length < this.allLaunches[col].length){
                toAdd -= this.allLaunches[col][this.launches[col].length].relHeight;
                this.launches[col].push(this.allLaunches[col][this.launches[col].length]);
            }
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

$(document).ready(function(){
    $(window).scroll(function(){
        for (let i = 0; i < 4; i++){
            let columnDOM = document.getElementById("launchColumn" + (i +1));
            if (launchesApp.initialLoaded == true && isScrolledIntoView(columnDOM)){
                launchesApp.AddCards(i);
            }
        }
    });
});
