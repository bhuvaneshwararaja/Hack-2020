



  let myChart = document.getElementById('myChart').getContext('2d');
  let myChart1 = document.getElementById('myChart1').getContext('2d');
  let myChart2 = document.getElementById('myChart2').getContext('2d');
  var self = parseInt(document.querySelector(".self").innerHTML);
  var group = parseInt(document.querySelector(".group").innerHTML);
  var corporate = parseInt(document.querySelector(".corporate").innerHTML);
  var others = parseInt(document.querySelector(".others").innerHTML);
  var front = parseInt(document.querySelector(".front").innerHTML);

  var py = parseInt(document.querySelector(".py").innerHTML);
  var js = parseInt(document.querySelector(".js").innerHTML);
  var get = document.querySelector(".contains-none p").innerHTML;
  var end = parseInt(document.querySelector(".reg").innerHTML);
  var limit = []
  var s = get.split(",")
  var res =[]
  for(var i=0;i<s.length;i++)
  {
    if(parseInt(s[i])>=0){
      res.push(parseInt(s[i]))
    }
  }
  for(var i = 1;i<=end;i++){
    limit.push("Reg:"+i)
  }
  console.log(limit)


Chart.defaults.global.defaultFontFamily = 'Lato';
Chart.defaults.global.defaultFontSize = 18;
Chart.defaults.global.defaultFontColor = '#777';

let regChart = new Chart(myChart, {
type:'doughnut',
data:{
  labels:['Self', 'Group','Corporate','Others'],
  datasets:[{
    label:'Registration',
    data:[self,group,corporate,others],

    backgroundColor:[
      '#398bf7',
      '#7460ee',
      '#06d79c',
      '#ef5350'
    ],
    borderWidth:1,

    hoverBorderWidth:3,

  }]
},
options:{
  title:{
    display:true,
    text:'Types of Registration',
    fontSize:25
  },
  legend:{
    display:true,
    position:'right',
    labels:{
      fontColor:'#000'
    }
  },
  layout:{
    padding:{
      left:50,
      right:0,
      bottom:0,
      top:0
    }
  },
  tooltips:{
    enabled:true
  },



}
});

let event_Chart = new Chart(myChart1, {
type:'bar',
data:{
  labels:['Front-End','Python','JavaScript'],
  datasets:[{

    data:[front,py,js],

    backgroundColor:[
      '#398bf7',
      '#7460ee',
      '#06d79c',
      '#ef5350'
    ],
    borderWidth:1,
    borderColor:'#777',
    hoverBorderWidth:3,
    hoverBorderColor:'#000'
  }]
},
options:{
  title:{
    display:true,
    text:'Types of Event',
    fontSize:25
  },
  legend:{
    display:true,
    position:'right',
    labels:{
      fontColor:'black'
    }
  },
  layout:{
    padding:{
      left:50,
      right:0,
      bottom:0,
      top:0
    }
  },
  tooltips:{
    enabled:true
  },
  scales: {
   yAxes: [{

       ticks: {
           suggestedMin: 0   // minimum will be 0, unless there is a lower value.

       }
   }]
}



}
});
let compareChart = new Chart(myChart2, {
type:'line',
data:{
  labels:limit,
  datasets:[{
    label:'ticket',
    data:res,
    borderColor:'#398bf7',
    borderWidth:1,
    hoverBorderWidth:3,
    hoverBorderColor:'#398bf7'
  }]
},
options:{
  title:{
    display:true,
    text:'Tickets per Registration',
    fontSize:25
  },
  legend:{
    display:true,
    position:'right',
    labels:{
      fontColor:'#000'
    }
  },
  layout:{
    padding:{
      left:50,
      right:0,
      bottom:0,
      top:0
    }
  },
  tooltips:{
    enabled:true
  },



}
});
function SideClose(){

var x = document.querySelector(".side");
if (x.style.display === "none") {
x.style.display = "block";
} else {

x.style.display = "none"
}


}
function Open(){

var x = document.querySelector(".lig-dark");
if (x.style.display === "none") {
x.style.display = "block";
} else {

x.style.display = "none"
}
}
function BgDark(){
 document.body.style.backgroundImage = "url('/images/dark.png')";
}
function FilterChart(){
 var l = document.querySelector(".limit").value;
 end = l;
}
