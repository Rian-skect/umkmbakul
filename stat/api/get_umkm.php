<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");

// Ganti dengan data dari Supabase Dashboard → Settings → API
$supabaseUrl = "https://gykbniseplrqvrnabzdh.supabase.co/rest/v1/umkm";
$supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5a2JuaXNlcGxycXZybmFiemRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMzMzEyNTcsImV4cCI6MjA2ODkwNzI1N30.0ESeTAo3RRdVkGL3UGte8-KUjBy2F8Rh40O-bo67P0w";

// Kirim request ke Supabase REST API
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $supabaseUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
  "apikey: $supabaseKey",
  "Authorization: Bearer $supabaseKey",
  "Content-Type: application/json"
]);

$response = curl_exec($ch);
$error = curl_error($ch);
curl_close($ch);

// Cek error
if ($error) {
    echo json_encode(["error" => $error]);
} else {
    echo $response;
}
?>
