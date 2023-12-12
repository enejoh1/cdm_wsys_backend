<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%request.setCharacterEncoding("UTF-8"); %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="x" uri="http://java.sun.com/jsp/jstl/xml" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="sql" uri="http://java.sun.com/jsp/jstl/sql" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<!-- main.jsp -->
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="utf-8">
    <title>재고관리 모바일 웹</title>
    <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
    <script src="/resources/quaggaJS/dist/quagga.js"></script>
    <link rel="stylesheet" type="text/css" href="/resources/bootstrap-4.4.1/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" 
    		integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <style>
        /* In order to place the tracking correctly */
        canvas.drawing, canvas.drawingBuffer {
            position: absolute;
            left: 0;
            top: 0;
        }
    </style>
<%@ include file="/resources/view/common/property/importFiles.jsp"%>

<script type="text/javascript" src="/resources/view/js/main/mainConf.js"></script>
<script type="text/javascript" src="/resources/view/js/main/main.js"></script>

<script type="text/javascript">
var gCONTENT_PATH = '${MainVo.main_content_path}';
var userAgent = navigator.userAgent.toLowerCase(); // 접속 핸드폰 정보

</script>
 </head>
  <body>
  HBLWMS
  </body>
</html>