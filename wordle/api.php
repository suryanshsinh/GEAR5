<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    echo "let post audio heaven request contrast";
}
else {
    $word = $_GET['word'];
    echo file_get_contents("https://lessgames.com/api/wordless/validate/".$word);
}
?>