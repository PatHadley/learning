<html>
 <head>
  <title>PHP Test</title>
 </head>
 <body>
  <?php
  if (strpos($_SERVER['HTTP_USER_AGENT'], 'Chrome') !== FALSE) {
  ?>
  <h3>strpos() must have returned non-false</h3>
  <p>You are using Chrome</p>
  <?php
  } else {
  ?>
  <h3>strpos() must have returned false</h3>
  <p>You are not using Chrome</p>
  <?php
  }
  ?>
 </body>
</html>