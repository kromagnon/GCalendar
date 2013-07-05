
function Calendar(container)
{  
    this.div = container;
    this.afterLoad = function(){};
    this.sevendays = false;
    this.div.append('<div class="BECalendar Gclearfix" id="BeCalendar"></div>');
    this.cdate = Date.today();
    this.firstdate = new Date.today();
    this.enddate = new Date.today();
    this.mouseisdown = false;

    var me = this;
    //add general purpose action listener
     $("#BeCalendar").on("click",".selectabledate",function(){
        $(".selecteddate").removeClass("selecteddate");
        $(this).addClass("selecteddate");
     });
      $("#BeCalendar").on("mousedown",".selectabledate",function(){
        $(".selecteddate").removeClass("selecteddate");
        $(this).addClass("selecteddate");
        me.firstdate = Date.parse($(this).attr("data-date"));
        me.mouseisdown = true;
     });
      $("#BeCalendar").on("mouseup",".selectabledate",function(){
       // $(this).addClass("selecteddate");
        me.enddate = Date.parse($(this).attr("data-date"));
        me.mouseisdown = false;
        $(".selectabledate").each(function(){
            currdate = Date.parse($(this).attr("data-date"));
            if(currdate.compareTo(me.firstdate) >= 0 && currdate.compareTo(me.enddate) <=0)
            {
                $(this).addClass("selecteddate");
            }
        });

     });

      $("#BeCalendar").on("mouseover",".selectabledate",function(){
        me.enddate = Date.parse($(this).attr("data-date"));
        if(me.mouseisdown){
            $(".selecteddate").removeClass("selecteddate");
            $(".selectabledate").each(function(){
                currdate = Date.parse($(this).attr("data-date"));
                if(currdate.compareTo(me.firstdate) >= 0 && currdate.compareTo(me.enddate) <=0)
                {
                    $(this).addClass("selecteddate");
                }
            });

        }
        
     });
    
}
Calendar.prototype.show  = function(){
    this.setupCalendar();
}
Calendar.prototype.dateClick = function(func){
    $("#BeCalendar").on("click",".selectabledate",func);
}
Calendar.prototype.dateStyle = function(func){
    this.afterLoad = func;
    func();
}
Calendar.prototype.setupCalendar = function()
{
    //Build the html for the calendar  
    $("#BeCalendar").append('<div class="Gclearfix" id="CalendarHeader"></div>');
    $("#BeCalendar").append('<div class="Gclearfix" id="CalendarBody"></div>');
    $("#CalendarHeader").append('<div class="Gclearfix" id="CalendarMon"></div>');
    $("#CalendarMon").append('<div class="clickable" id="prevarrow"></div><div id="monname"></div><div class="clickable" id="nextarrow"></div>');
    $("#CalendarHeader").append('<div id="DaysOfWeek"></div>');
    $("#DaysOfWeek").append('<div class="CalendarDoW"><span>Mon</span></div>');
    $("#DaysOfWeek").append('<div class="CalendarDoW"><span>Tue</span></div>');
    $("#DaysOfWeek").append('<div class="CalendarDoW"><span>Wed</span></div>');
    $("#DaysOfWeek").append('<div class="CalendarDoW"><span>Thu</span></div>');
    $("#DaysOfWeek").append('<div class="CalendarDoW"><span>Fri</span></div>');
    if(this.sevendays)
    {
        $("#DaysOfWeek").prepend("<div class='CalendarDoW'><span>Sun</span></div>");
        $("#DaysOfWeek").append("<div class='CalendarDoW'><span>Sat</span></div>");
        $(".CalendarDoW").css("width",Math.round($("#CalendarBody").width()/7));

    }
    this.fillCalendar();
    
    //set this to "me" because there is a scoping problem with using
    //actionlisteners inside a class
    var me = this;
   
    $("#nextarrow").click(function(){
        me.cdate.next().month();
        me.fillCalendar();
   });

    $("#prevarrow").click(function(){

        me.cdate.addMonths(-1); 
        me.fillCalendar();
    });
}
 //fillCalendar places all dates in correct places, and
 //it also executes a specified function after loading the dates.
 //This function will most likely be used to style specific dates using the
 //"modifydate" function     
 Calendar.prototype.fillCalendar = function ()
 {
    this.cdate.moveToFirstDayOfMonth();
    initialdate=this.cdate.clone();

    firstDay =this.cdate.getDay();
    curmonth = this.cdate.getMonth();
    monthstarted = false;
    $("#CalendarBody").html("");
    $("#monname").html(this.cdate.getMonthName()+" "+this.cdate.getFullYear());
    for(i= 0; i<6;i++)//for each row in the calendar
    {
        $("#CalendarBody").append("<div class ='calrow' id='calrow"+i+"'></div>");
        for(j=0;j<7;j++)//for each day of the week
        {
            if(j==firstDay)//mark where the first day of the month starts
            {
                monthstarted = true;
            }

        if((j!=0 && j!=6) || this.sevendays)//if not Sunday or Saturday
        {

            if(monthstarted && (curmonth == this.cdate.getMonth()))//only show dates for the current month
            {
                //display the date
                $("#calrow"+i).append("<div id='"+i+"_"+j+"' class='calcell clickable selectabledate'>"+this.cdate.getDate()+"</div>");
                
                //add an attribute to hold the value of the date to the cell
                $("#"+i+"_"+j).attr("data-date",this.cdate.getFullYear()+"-"+(this.cdate.getMonth()+1)+"-"+this.cdate.getDate());
                this.cdate = this.cdate.next().day();
            }
            else
            {
                //display an empty cell
                $("#calrow"+i).append("<div class='calcell'></div>");
            }
        }
        else //weekend
        {
                if(monthstarted)//just increment the date, don't display anything
                {
                this.cdate = this.cdate.next().day();
                }            
        }
    }
    }
//center day content
//do some funky math to fit the cells in and account for the borders
parentheight = $("#CalendarBody").parent().height();
dateheight = parentheight - $("#CalendarHeader").height();
$(".calrow").css("height",Math.round((dateheight/6))+"px");
$(".calcell").css("line-height",Math.round($(".calrow").height())+"px");

if(this.sevendays)
{
     $(".calcell").css("width",Math.round($("#CalendarBody").width()/7));

}
//select the current day
var me = this;
$(".selectabledate").each(function(){
    currdate = Date.parse($(this).attr("data-date"));
    if(currdate.compareTo(me.firstdate) >= 0 && currdate.compareTo(me.enddate) <=0)
    {
        $(this).addClass("selecteddate");
    }
});
//setActionListener(actionlistener)

this.afterLoad();

this.cdate= initialdate.clone();//set date back to beginning of month

}

function setActionListener(functoexec)
{
    $(".selectabledate").click(functoexec);
}    
function modifyDate(datestr,functoexec){

    $(".selectabledate").each(function(){

        celldate = Date.parse($(this).attr("data-date"));
            
            compdate = Date.parse(datestr);

            if(celldate.equals(compdate))
            {
                $(this).each(functoexec);
            }

        })

}