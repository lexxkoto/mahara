<?php
    
    // This script is only for command-line use.
    // Die if called from the web interface.
    
    if(php_sapi_name() !== 'cli') {
        die('Naw.');
    }    
    
    // Stephen - stick the database details in here and call this file
    // from the command line. It needs permission to alter the collation
    // so it might need to be the root user.

    $db_host    = 'localhost';
    $db_name    = 'mahara';
    $db_user    = 'iamauser';
    $db_pass    = 'iamapassword';
    
    // These are the values that worked in our test upgrade
    
    $characterset = 'utf8';
    $collation = 'utf8_unicode_ci';

    function o($text) {
        echo $text.PHP_EOL;
    }

    $con = mysqli_connect($db_host, $db_user, $db_pass);

    o("(i) Alex's Mahara database fixer v1.1");
    o("(i) Using database $db_name on $host");
    o("(i) Using collation $collation and character set $characterset".PHP_EOL);
    
    o("(i) Connecting to the database...");
    
    if(!$con) {
        o("/!\\ Cannot connect to the database");
        die();
    }

    o("(i) Selecting database...");

    mysqli_select_db($con, $db_name);
  
    o("(i) Listing tables...");

    $result=mysqli_query($con, 'show tables');

    while($tables = mysqli_fetch_array($result)) {
        foreach ($tables as $key => $value) {
            o('(i) Fixing collation for table '.$value);
            mysqli_query($con, "ALTER TABLE $value CONVERT TO CHARACTER SET $characterset COLLATE $collation");
        }
    }

    out("(i) Done.".PHP_EOL);

?>