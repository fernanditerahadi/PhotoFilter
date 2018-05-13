// Filter Page specific
// Filter Page specific
// Filter Page specific
var image = null;
var edited = null;
var canvas = null;
var context = null;
var angle = 0;
var currangle = 0;
var filter = {"GrayScale":"grayscale(1)",
              "Sepia":"sepia(1)",
              "XPro2":"contrast(1.3) brightness(0.8) sepia(0.3) saturate(1.5) hue-rotate(-5deg)",
              "Willow":"saturate(0.02) contrast(0.85) brightness(1.2) sepia(0.02)",
              "Walden":"sepia(0.35) contrast(0.9) brightness(1.1) hue-rotate(-10deg) saturate(1.5)",
              "Valencia":"sepia(0.15) saturate(1.5) contrast(0.9)",
              "Toaster":"sepia(0.4) saturate(2.5) hue-rotate(-30deg) contrast(0.67)",
              "Sierra":"contrast(0.8) saturate(1.2) sepia(0.15)",
              "Rise":"saturate(1.4) sepia(0.25) hue-rotate(-15deg) contrast(0.8) brightness(1.1)",
              "Nashville":"sepia(0.4) saturate(1.5) contrast(0.9) brightness(1.1) hue-rotate(-15deg)",
              "Mayfair":"saturate(1.4) contrast(1.1)",
              "LoFi":"contrast(1.4) brightness(0.9) sepia(0.05)",
              "Kelvin":"sepia(0.4) saturate(2.4) brightness(1.3) contrast(1)",
              "Inkwell":"grayscale(1) brightness(1.2) contrast(1.05)",
              "Hudson":"contrast(1.2) brightness(0.9) saturate(0.8) hue-rotate(-15deg)",
              "Hefe":"contrast(1.3) sepia(0.3) saturate(1.3) hue-rotate(-10deg) brightness(0.95)",
              "Earlybird":"sepia(0.4) saturate(1.6) contrast(1.1) brightness(0.9) hue-rotate(-10deg)",
              "Brannan":"sepia(0.5) contrast(1.4)",
              "Amaro":"hue-rotate(-10deg) contrast(0.9) brightness(1.1) saturate(1.5)",
              "F1997":"sepia(0.5) hue-rotate(-30deg) saturate(1.2) contrast(0.8)"};

function resetFilterVar(){
  image = null;
  edited = null;
  canvas = null;
  context = null;
  angle = 0;
  currangle = 0;
}

function loadImage(inputID, canvasID, canvasdescID, toolsNum){
  resetFilterVar();
  var input = document.getElementById(inputID);
  var filename = input.value.split(/(\\|\/)/g).pop();
  var img = new Image();
  img.src = _URL.createObjectURL(input.files[0]);
  img.onload = function(){
    document.getElementById(canvasdescID).innerHTML = filename+" | "+this.width+" x "+this.height;};
  canvas = document.getElementById(canvasID);
  canvas.style.width = "auto";
  image = new SimpleImage(input);
  image.drawTo(canvas);
  document.getElementById("filter-nav").style.display = "block";
  document.getElementsByClassName("photofilter-tools")[toolsNum].style.display= "flex";
  $("#remove-image").removeClass("btn-secondary").addClass("btn-danger").attr("data-target","#confirm-remove");
  window.scrollBy(0,110);
  return;
}

function removeImage(inputID, canvasID, canvasdescID, toolsNum){
  context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.clearRect(0, 0, canvas.height, canvas.width);
  document.getElementById(inputID).value = null;
  document.getElementById(canvasdescID).innerHTML = "Browse Image";
  canvas.style.width = "1000px";
  document.getElementById("filter-nav").style.display = "none";
  document.getElementsByClassName("photofilter-tools")[toolsNum].style.display= "none";
  $("#remove-image").removeClass("btn-danger").addClass("btn-secondary").attr("data-target","");
  editCheck();
  resetFilterVar();
  window.scrollBy(0,-150);
  return;
}

function getFilter(filterName){
  context = canvas.getContext("2d");
  edited = image;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.filter = filter[filterName];
  drawFilter();
  editCheck();
  return;
}

function drawFilter(){
  if(currangle == 90 || currangle == 270){
    context.drawImage(edited.canvas, 0, 0, canvas.height, canvas.width);
  }
  else{
    context.drawImage(edited.canvas, 0, 0, canvas.width, canvas.height);
  }
  return;
}

function restore(){
  context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  image.drawTo(canvas);
  edited = null;
  angle = 0;
  currangle = 0;
  editCheck();
  return;
}

function rotateCheck(){
  if(currangle == 0){
    document.getElementById("restore").style.color = "#AAAAAA";
    $("#restore-image").attr("data-target","");
  }
  else{
    document.getElementById("restore").style.color = "#FFFFFF";
    $("#restore-image").attr("data-target","#confirm-restore");
  }
}

function editCheck(){
  if(edited == null){
    document.getElementById("restore").style.color = "#AAAAAA";
    $("#restore-image").attr("data-target","");
    $("#rotate-left").attr({"data-target":"", "onclick":"rotateLeft()"});
    $("#rotate-right").attr({"data-target":"", "onclick":"rotateRight()"});
  }
  else{
    document.getElementById("restore").style.color = "#FFFFFF";
    $("#restore-image").attr("data-target","#confirm-restore");
    $("#rotate-left").attr({"data-target":"#confirm-rotate-left", "onclick":""});
    $("#rotate-right").attr({"data-target":"#confirm-rotate-right", "onclick":""});
    }
  return;
}

function drawRotated(degrees){
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  if(degrees == 90 || degrees == 270){
    canvas.width = image.height;
    canvas.height = image.width;
  }
  else{
    canvas.width = image.width;
    canvas.height = image.height;
  }
  context.clearRect(0,0, canvas.width, canvas.height);
  if(degrees == 90 || degrees == 270){
    context.translate(image.height/2, image.width/2);
  }
  else{
    context.translate(image.width/2, image.height/2);
  }
  context.rotate(degrees*Math.PI/180);
  context.translate(-image.width/2, -image.height/2);
  if(edited == null){
    context.drawImage(image.canvas, 0, 0);
    rotateCheck();
  }
  else{
    context.drawImage(edited.canvas, 0, 0);
    edited = null;
    editCheck();
    rotateCheck();
  }
  return;
}

function rotateLeft(){
  if(angle == 0){
    angle = 270;
  }
  else{
    angle = (angle - 90) % 360;
  }
  currangle = angle;
  drawRotated(angle);
  return;
}

function rotateRight(){
  angle = (angle + 90) % 360;
  currangle = angle;
  drawRotated(angle);
  return;
}


// Steganography-Page Specific
// Steganography-Page Specific
// Steganography-Page Specific
var mode = null;
var leftImage = null;
var rightImage = null;
var centerImage = null;
var identifier = null;
var loaded = 0;

function updateIdentifier(inputID, canvasID){
  identifier = [inputID, canvasID];
  return;
}

function resetIdentifier(){
  identifier = null;
  return;
}
function steganographyLoadImage(inputID, canvasID){
  var input = document.getElementById(inputID);
  var canvas = document.getElementById(canvasID);
  if(inputID.includes("left")){
    if(leftImage != null){
      loaded -= 1
    }
    leftImage = new SimpleImage(input);
    leftImage.drawTo(canvas);
    document.getElementsByClassName("steganography-tools")[0].style.display= "flex";
    document.getElementsByClassName("steganography-canvas-label")[0].style.display= "none";
  }
  else if(inputID.includes("right")){
    if(rightImage != null){
      loaded -= 1
    }
    rightImage = new SimpleImage(input);
    rightImage.drawTo(canvas);
    document.getElementsByClassName("steganography-tools")[2].style.display= "flex";
    document.getElementsByClassName("steganography-canvas-label")[2].style.display= "none";
  }
  else{
    if(centerImage != null){
      loaded -= 1
    }
    centerImage = new SimpleImage(input);
    centerImage.drawTo(canvas);
    document.getElementsByClassName("steganography-tools")[1].style.display= "flex";
    document.getElementsByClassName("steganography-canvas-label")[1].style.display= "none";
  }
  loaded += 1;
  document.getElementById("mode").disabled = true;
  document.getElementById("switch").style.filter = "grayscale(1)";
  checkProcess();
  checkLoaded();
  return;
}

function steganographyRemoveImage(){
  var inputID = identifier[0];
  var canvasID = identifier[1];
  var canvas = document.getElementById(canvasID);
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.clearRect(0, 0, canvas.height, canvas.width);
  document.getElementById(inputID).value = null;
  if(inputID.includes("left")){
    leftImage = null;
    document.getElementsByClassName("steganography-tools")[0].style.display= "none";
    document.getElementsByClassName("steganography-canvas-label")[0].style.display= "inline-block";
  }
  else if(inputID.includes("right")){
    rightImage = null;
    document.getElementsByClassName("steganography-tools")[2].style.display= "none";
    document.getElementsByClassName("steganography-canvas-label")[2].style.display= "inline-block";
  }
  else{
    centerImage = null;
    document.getElementsByClassName("steganography-tools")[1].style.display= "none";
    document.getElementsByClassName("steganography-canvas-label")[1].style.display= "inline-block";
  }
  identifier = null;
  loaded -= 1;
  checkProcess();
  checkLoaded();
}

function checkProcess(){
  if(document.getElementById("process").innerHTML != "Process"){
    document.getElementById("process").innerHTML = "Process";
    $("#process").removeClass("btn-warning").addClass("btn-primary");
    checkLoaded();
  }
  return;
}

function checkLoaded(){
  if(loaded < 1){
    document.getElementById("mode").disabled = false;
    document.getElementById("switch").style.filter = "grayscale(0)";
  }
  if(document.getElementById("mode").checked && loaded != 1){
    $("#process").removeClass("btn-primary").addClass("btn-secondary").attr({"onclick":"","onfocus":""});
  }
  else if(document.getElementById("mode").checked && loaded == 1){
    $("#process").removeClass("btn-secondary").addClass("btn-primary").attr({"onclick":"process() ","onfocus":"doHomeWork()"});
  }
  else if(!document.getElementById("mode").checked && loaded != 2){
    $("#process").removeClass("btn-primary").addClass("btn-secondary").attr({"onclick":"","onfocus":""});
  }
  else if(!document.getElementById("mode").checked && loaded == 2){
    $("#process").removeClass("btn-secondary").addClass("btn-primary").attr({"onclick":"process() ","onfocus":"doHomeWork()"});
  }
  return;
}

function clickInput(inputNumber){
  $('input:file')[inputNumber].click();
  return;
}

function changeMode(canvasID, leftID, rightID, centerID){
  try{
    mode = document.getElementById("mode").checked;
  }
  catch{
    return;
  }
  function collapseExpand(){
    $(canvasID).slideToggle(400, function(){
        if(mode==true){
          $(canvasID+leftID).css("display","none");
          $(canvasID+rightID).css("display","none");
          $(canvasID+centerID).css("display","inline-block");
        }
        else{
          $(canvasID+leftID).css("display","inline-block");
          $(canvasID+rightID).css("display","inline-block");
          $(canvasID+centerID).css("display","none");
        }
    });
    $(canvasID).slideToggle(400);
  }
  return collapseExpand();
}

function clearBits(colorValue){
  return (Math.floor(colorValue/16) * 16);
}

function extractBits(colorValue){
  return ((colorValue % 16) * 16);
}

function chopPixel(image){
  for(var pixel of image.values()){
    pixel.setRed(clearBits(pixel.getRed()));
    pixel.setGreen(clearBits(pixel.getGreen()));
    pixel.setBlue(clearBits(pixel.getBlue()));
  }
  return image;
}

function shiftPixel(image){
  for(var pixel of image.values()){
    pixel.setRed(pixel.getRed()/16);
    pixel.setGreen(pixel.getGreen()/16);
    pixel.setBlue(pixel.getBlue()/16);
  }
  return image;
}

function seperateMessage(centerImage){
  var result = new SimpleImage(centerImage.getWidth(), centerImage.getHeight());
  var count = 1;
  for(var pixel of result.values()){
    var x = pixel.getX();
    var y = pixel.getY();
    var centerPixel = centerImage.getPixel(x,y);
    if(count == 1){
      var red = centerPixel.getRed();
      var green = centerPixel.getGreen();
      var blue = centerPixel.getBlue();
      if(red != 45 && green != 67 && blue != 89){
        $("#alert-modal").modal("show");
      }
    }
    pixel.setRed(extractBits(centerPixel.getRed()));
    pixel.setGreen(extractBits(centerPixel.getGreen()));
    pixel.setBlue(extractBits(centerPixel.getBlue()));
    count += 1
  }
  return result;
}

function combineImage(leftImage, rightImage){
  var result = new SimpleImage(leftImage.getWidth(), leftImage.getHeight());
  var count = 1;
  for(var pixel of result.values()){
    var x = pixel.getX();
    var y = pixel.getY();
    var leftPixel = leftImage.getPixel(x,y);
    var rightPixel = rightImage.getPixel(x,y);
    if(count==1){
      pixel.setRed(45);
      pixel.setGreen(67);
      pixel.setBlue(89);
    }
    else{
      pixel.setRed(leftPixel.getRed()+ rightPixel.getRed());
      pixel.setGreen(leftPixel.getGreen() + rightPixel.getGreen());
      pixel.setBlue(leftPixel.getBlue() + rightPixel.getBlue());
    }
    count += 1;
  }
  return result;
}

function hideImage(){
  var canvas = document.getElementById('rcanvas-center');
  rightImage.setSize(leftImage.getWidth(), leftImage.getHeight());
  leftImage = chopPixel(leftImage);
  rightImage = shiftPixel(rightImage);
  var result = combineImage(leftImage, rightImage);
  result.drawTo(canvas);
  return;
}

function extractImage(){
  var canvas = document.getElementById('rcanvas-center');
  var result = seperateMessage(centerImage);
  result.drawTo(canvas);
  return;
}

function doHomeWork(){
  document.getElementById("image-loading-background").style.display = "flex";
  return;
}

function process(){
  if(!document.getElementById("mode").checked){
    document.getElementById("modal-title").innerHTML = "Combined Image";
    hideImage();
  }
  else if(document.getElementById("mode").checked){
    document.getElementById("modal-title").innerHTML = "Extracted Message";
    extractImage();
  }
  $("#combined-image").modal("show");
  document.getElementById("process").innerHTML = "Restart";
  $("#process").removeClass("btn-primary").addClass("btn-warning").attr({"onclick":"restart()","onfocus":""});
  document.getElementById("image-loading-background").style.display = "none";
  return;
}

function restart(){
  location.reload();
}

// Global Page
// Global Page
// Global Page
var _URL = window.URL || window.webkitURL;

function dataURLtoBlob(dataurl) {
  var arr = dataurl.split(','),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], {type:mime});
}

function download(canvasID, fileName){
  var link = document.createElement("a");
  var imgData = document.getElementById(canvasID).toDataURL({format: 'png', multiplier: 1});
  var strDataURI = imgData.substr(22, imgData.length);
  var blob = dataURLtoBlob(imgData);
  var objurl = URL.createObjectURL(blob);
  link.download = fileName;
  link.href = objurl;
  link.click();
}

function resizeNavBar(){
  if ($(this).scrollTop() > 60) {
    $('div.jumbotron').removeClass("text-center");
    $('div.jumbotron').addClass("fixed-top").css({"height":"55px", "box-shadow":"0 10px 12px -8px rgba(0,0,0,0.5)"});
    $('div.jumbotron').children("hr").css({"display":"none"});
    $('div.jumbotron').children("p").css({"display":"none"});
    $('div.jumbotron').children("h4").css({"font-size":"125%"});
    $('div.photofilter-photo-container').css({"margin-top":"12%"});
    $('nav.photofilter-navigation').css({"position":"fixed"});
    $('nav.photofilter-navigation').children("ul").css({"justify-content":"flex-end"});
    $('nav.photofilter-navigation').children("ul").children("li").css({"width":"120px"});
    $('nav.photofilter-navigation').children("ul").children("li").children("a").css({"font-size":"84%", "padding-top":"5px", "padding-bottom":"5px"});
    $('#inner-fixed').css("height","0px");
    $('#inner-remaining').css("top","0px");
  }
  else {
    $('div.jumbotron').addClass("text-center");
    $('div.jumbotron').removeClass('fixed-top').css({"height":"140px"});
    $('div.jumbotron').children("hr").css({"display":"block"});
    $('div.jumbotron').children("p").css({"display":"inline"});
    $('div.jumbotron').children("h4").css({"font-size":"200%"});
    $('div.photofilter-photo-container').css({"margin-top":"1%"});
    $('nav.photofilter-navigation').css({"position":"static"});
    $('nav.photofilter-navigation').children("ul").css({"justify-content":"center"});
    $('nav.photofilter-navigation').children("ul").children("li").css({"width":"150px"});
    $('nav.photofilter-navigation').children("ul").children("li").children("a").css({"font-size":"87%", "padding-top":"7px", "padding-bottom":"7px"});
    $('#inner-fixed').css("height","150px");
    $('#inner-remaining').css("top","150px");
  }
  return;
}

function initialise(){
  $('[data-toggle="tooltip"]').tooltip();
  changeMode("", "", "", "");
}

function onReady(callback){
  var intervalID = window.setInterval(checkReady, 1000);
  function checkReady(){
    if (document.getElementsByTagName("body")[0] !== undefined){
      window.clearInterval(intervalID);
      callback.call(this);
    }
  }
}

function showPage(id, value){
  if(value == true){
    document.getElementById(id).style.display = "block";
  }
  else{
    document.getElementById(id).style.display = "none";
  }
}

function checkPage(){
  showPage("page", true);
  showPage("loading", false);
}

onReady(checkPage);
$(document).ready(initialise);
$(document).scroll(resizeNavBar);
