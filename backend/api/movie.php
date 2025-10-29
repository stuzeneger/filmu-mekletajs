<?php
require __DIR__ . '/../vendor/autoload.php';

use App\OmdbClient;
use Dotenv\Dotenv;

session_start();
header('Content-Type: application/json');

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$id = $_GET['id'] ?? null;
$movie = null;
$error = null;

if ($id) {
    try {
        $client = new OmdbClient($_ENV['OMDB_API_KEY'] ?? '');
        $movie = $client->getMovieByIMDBId($id);

        if (empty($movie['Response']) || $movie['Response'] !== 'True') {
            $error = $movie['Error'] ?? 'Filmu neizdevās atrast.';
            $movie = null;
        }
    } catch (\Exception $e) {
        $error = $e->getMessage();
    }
} else {
    $error = 'ID nav norādīts';
}

echo json_encode([
    'movie' => $movie,
    'error' => $error,
]);
