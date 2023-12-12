<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>

<link rel="stylesheet" type="text/css" href="${MainVo.main_content_path}/extjs5/module/main.css">
<link rel="stylesheet" type="text/css" href="${MainVo.main_content_path}/extjs5/module/xdview/xdview.css">
<link rel="stylesheet" type="text/css" href="${MainVo.main_content_path}/extjs5/module/xdview/css/fonts.css">

<link rel="stylesheet" href="${MainVo.main_content_path}/admin/assets/vendor/jquery-ui/jquery-ui.css" />
<link rel="stylesheet" href="${MainVo.main_content_path}/admin/assets/vendor/jquery-ui/jquery-ui.theme.css" />

<script type="text/javascript" src="${MainVo.main_content_path}/ext-6.7.0/build/examples/classic/shared/include-ext.js"></script>

<script type="text/javascript" src="${MainVo.main_content_path}/ext-6.7.0/packages/ux/src/ajax/Simlet.js"></script>
<script type="text/javascript" src="${MainVo.main_content_path}/ext-6.7.0/packages/ux/src/ajax/DataSimlet.js"></script>
<script type="text/javascript" src="${MainVo.main_content_path}/ext-6.7.0/packages/ux/src/ajax/JsonSimlet.js"></script>

<script src="${MainVo.main_content_path}/ext-pdf-viewer-master/resources/lib/pdf.js/minified/compatibility.js"></script>
<script src="${MainVo.main_content_path}/ext-pdf-viewer-master/resources/lib/pdf.js/minified/pdf.js"></script>

<link rel="stylesheet" type="text/css" href="${MainVo.main_content_path}/ext-6.7.0/packages/pivot/build/classic/classic/resources/pivot-all.css" />
<script type="text/javascript" src="${MainVo.main_content_path}/ext-6.7.0/build/classic/locale/locale-ko.js"></script>

<script src="${MainVo.main_content_path}/admin/assets/vendor/jquery/jquery.js"></script>
<script src="${MainVo.main_content_path}/admin/assets/vendor/jquery-ui/jquery-ui.js"></script>

<%-- <script type="text/javascript" src="${MainVo.main_content_path}/js/main/mainConf.js"></script>
<script type="text/javascript" src="${MainVo.main_content_path}/js/main/main.js"></script> --%>

<link rel="stylesheet" type="text/css" href="${MainVo.main_content_path}/resources2/css/wsyscss.css" />
<%-- <link rel="stylesheet" type="text/css" href="${MainVo.main_content_path}/resources2/css/msyscss.css" /> --%>
<link rel="stylesheet" type="text/css" href="${MainVo.main_content_path}/css/awesomefont.css" />

<script type="text/javascript">
	/*Globar Value Define*/
	var/*GLOBAL*/vCONTEXT_PATH = '${pageContext.request.contextPath}';
	var/*GLOBAL*/CONTEXT_PATH = '${pageContext.request.contextPath}';
	
	var gCONTENT_PATH = '${pageContext.request.contextPath}';
	
	var topMenuList = '${MainVo.topMenuList}';
	var childMenuList = '${MainVo.childMenuList}';
	var treeMenuList = '${MainVo.treeMenuList}';

</script>
</head>
</html>