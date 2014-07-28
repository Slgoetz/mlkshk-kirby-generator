<!DOCTYPE html>
<html lang="en" class="no-js">
<head>

  <meta charset="utf-8" />

  <title><?php echo html($site->title()) ?> | <?php echo html($page->title()) ?></title>
  <meta name="description" content="<?php echo html($site->description()) ?>" />


  <!-- build:css styles/vendor.css -->
  <!-- bower:css -->
  <!-- endbower -->
  <!-- endbuild -->

  <!-- build:css styles/main.css -->
  <link rel="stylesheet" href="assets/css/main.css">
  <!-- endbuild -->

  <!-- build:js scripts/vendor/modernizr.js -->
  <script src="bower_components/modernizr/modernizr.js"></script>
  <!-- endbuild -->


</head>
<body>
  <!--[if lt IE 9]>
    <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
  <![endif]-->

  <header class="cf" role="banner">
    <a class="branding" href="<?php echo url() ?>"><img src="<?php echo url('assets/images/logo.png') ?>" width="115" height="41" alt="<?php echo html($site->title()) ?>" /></a>
    <?php snippet('menu') ?>
  </header>