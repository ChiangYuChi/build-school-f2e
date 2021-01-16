import {
    $g,
    $c
} from '../Modules/helpers.js'
//取得json

let url = 'http://bsopendata.azurewebsites.net/api/LeisureTravel/Attractions';
let jsonArray = [];
let jsonArrayNew = [];
let city = $g("#city");
let district = $g("#district");
let msg = $g("#msg");
let loadingRing = $g('.loading-ring');
let map;
let regionMarker = [];
let districtMarker = [];
let siteMarker = [];
let infowindow = new google.maps.InfoWindow();
window.onload = function () {
    initMap();
    let promise1 = fetchJsonPromise(url);
    promise1
        .then(result => {

            jsonArray = JSON.parse(result);
            TrasformArray(jsonArray);

        });

}

function fetchJsonPromise(url) {
    return fetch(url)
        .then(
            response => response.text()
        );


}
//重整陣列
function TrasformArray(jsonArray) {
    let location = new Set();
    jsonArray.XML_Head.Infos.Info.forEach(
        item => {
            let name = item.Name;
            let discuss = item.Description;
            let tel = item.Tel;
            let address = item.Add;
            let region = item.Region;
            let town = item.Town;
            let ticketInfo = item.Ticketinfo;
            let remark = item.Remarks;
            let px = item.Px;
            let py = item.Py;
            let img = item.Picture1;
            let tourSite = {
                Name: name,
                Description: discuss,
                Tel: tel,
                Address: address,
                Region: region,
                Town: town,
                TicketInfo: ticketInfo,
                Remark: remark,
                Px: px,
                Py: py,
                Img: img
            }
            jsonArrayNew.push(tourSite);
        }

    )

    jsonArrayNew.forEach(item => {
        location.add(item.Region);
    })

    addInCitySelect(location);

}

//生成縣市列表
function addInCitySelect(location) {
    location.forEach(element => {
        if (element !== null) {
            let option = $c("option");
            option.setAttribute('value', element);
            option.innerHTML = element;
            city.appendChild(option);
        }
    })
}

//生成縣市分區列表

city.addEventListener('change', function (e) {
    let area = new Set();
    jsonArrayNew.forEach(item => {
        if (item.Region === e.target.value) {
            area.add(item.Town);
        }
    })
    addInDistrictSelect(area);

    showCityMarker(e.target.value);
})

function addInDistrictSelect(area) {
    if (district.length > 1) {
        district.innerHTML = '';

        let option = $c("option");
        option.setAttribute("value", -1)
        option.innerHTML = "請選擇區域";
        district.appendChild(option);
    }

    if (site.length > 1) {
        site.innerHTML = '';
        let option = $c("option");
        option.setAttribute("value", -1)
        option.innerHTML = "請選擇景點";
        site.appendChild(option);
    }

    area.forEach(element => {
        if (element !== null) {
            let option = $c("option");
            option.setAttribute('value', element);
            option.innerHTML = element;
            district.appendChild(option);
        }
    })
}


//生成分區個別地點列表

district.addEventListener('change', function (e) {
    let attriction = [];
    jsonArrayNew.forEach(item => {
        if (item.Town === e.target.value) {
            attriction.push(item.Name);
        }
    })
    addInSiteSelect(attriction);
    showDistrictMarker(e.target.value);
});

function addInSiteSelect(attriction) {
    if (site.length > 1) {
        site.innerHTML = '';
        let option = $c("option");
        option.setAttribute("value", -1)
        option.innerHTML = "請選擇景點";
        site.appendChild(option);
    }
    attriction.forEach(element => {
        let option = $c("option");
        option.setAttribute('value', element);
        option.innerHTML = element;
        site.appendChild(option);
    })
    showAttrictionMarker();
}
//初始化地圖

function initMap() {

    map = new google.maps.Map(document.getElementById("map"), {
        center: new google.maps.LatLng(25.0248603, 121.522363),
        zoom: 8,
    });

}

// 在地圖渲染所選縣市所有景點

function showCityMarker(region) {
  
    regionMarker.forEach(marker => {
        marker.setMap(null);
    });

    districtMarker.forEach(marker => {
        marker.setMap(null);
    });
    siteMarker.forEach(marker => {
        marker.setMap(null);
    });
    
    jsonArrayNew.forEach(element => {
        
        if (element.Region === region) {
            let marker = new google.maps.Marker({
                position: {
                    lat: element.Py,
                    lng: element.Px
                },
                map: map,
            });
            
            marker.addListener("click", () => {
                let div=$c('div');
                let title=$c('p');
                title.setAttribute('class','title');
                title.innerHTML=element.Name;
                div.appendChild(title);
                let detail=$c('p');
                detail.setAttribute('class','detail');
                detail.innerHTML=element.Description;
                div.appendChild(detail);
                let detailAddress =$c('p');
                detailAddress.innerHTML = element.Address;
                div.appendChild(detailAddress);
                infowindow.setContent(div);
                infowindow.open(map, marker);
                
            });

            regionMarker.push(marker);

        }
    })
}

// 在地圖渲染所選城鎮分區所有景點
function showDistrictMarker(district) {
    regionMarker.forEach(marker => {
        marker.setMap(null);
    });

    districtMarker.forEach(marker => {
        marker.setMap(null);
    });
    siteMarker.forEach(marker => {
        marker.setMap(null);
    });
    jsonArrayNew.forEach(element => {
        if (element.Town === district) {
            let marker = new google.maps.Marker({
                position: {
                    lat: element.Py,
                    lng: element.Px
                },
                map: map,
            });
            marker.addListener("click", () => {
                let div=$c('div');
                let title=$c('p');
                title.setAttribute('class','title');
                title.innerHTML=element.Name;
                div.appendChild(title);
                let detail=$c('p');
                detail.setAttribute('class','detail');
                detail.innerHTML=element.Description;
                div.appendChild(detail);
                let detailAddress =$c('p');
                detailAddress.innerHTML = element.Address;
                div.appendChild(detailAddress);
                infowindow.setContent(div);
                infowindow.open(map, marker);
                
            });
            districtMarker.push(marker);
        }
    })
}

function showAttrictionMarker() {
    site.addEventListener('change', function (e) {
        regionMarker.forEach(marker => {
            marker.setMap(null);
        });

        districtMarker.forEach(marker => {
            marker.setMap(null);
        });
        siteMarker.forEach(marker => {
            marker.setMap(null);
        });

        jsonArrayNew.forEach(element => {
            if (element.Name === e.target.value) {
                let marker = new google.maps.Marker({
                    position: {
                        lat: element.Py,
                        lng: element.Px
                    },
                    map: map,
                });
                marker.addListener("click", () => {
                    let div=$c('div');
                    let title=$c('p');
                    title.setAttribute('class','title');
                    title.innerHTML=element.Name;
                    div.appendChild(title);
                    let detail=$c('p');
                    detail.setAttribute('class','detail');
                    detail.innerHTML=element.Description;
                    div.appendChild(detail);
                    let detailAddress =$c('p');
                    detailAddress.innerHTML = element.Address;
                    div.appendChild(detailAddress);
                    infowindow.setContent(div);
                    infowindow.open(map, marker);
                    
                });
                siteMarker.push(marker);
            }

        })
    })
}