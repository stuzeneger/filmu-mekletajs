<?php
require __DIR__ . '/../vendor/autoload.php';

use App\OmdbClient;
use Dotenv\Dotenv;

session_start();
header('Content-Type: application/json');

$dotenv = Dotenv::createImmutable(__DIR__ . '/../');
$dotenv->safeLoad();

$query = trim($_GET['q'] ?? '');
$page  = max(1, (int)($_GET['page'] ?? 1));

if (!isset($_SESSION['recent_searches'])) $_SESSION['recent_searches'] = [];

$results = [];
$error = null;
$totalResults = 0;
$totalPages = 0;

try {

    $client = new OmdbClient($_ENV['OMDB_API_KEY'] ?? '');

    if ($query !== '') {
        // Saglabā pēdējos meklējumus
        $searches = array_filter(
            $_SESSION['recent_searches'],
            fn($v) => strtolower($v) !== strtolower($query)
        );
        array_unshift($searches, $query);
        $_SESSION['recent_searches'] = array_slice($searches, 0, 5);

        $data = $client->searchMovies($query, $page);

        if (!empty($data['Response']) && $data['Response'] === 'True') {
            $results = $data['Search'] ?? [];
            $totalResults = (int)($data['totalResults'] ?? count($results));
            $totalPages = (int)ceil($totalResults / 10);
        } else {
            $error = $data['Error'] ?? 'Nezināma kļūda.';
        }
    }
} catch (\Exception $e) {
    $error = $e->getMessage();
}

echo json_encode([
    'results' => $results,
    'recent_searches' => $_SESSION['recent_searches'],
    'error' => $error,
    'totalResults' => $totalResults,
    'totalPages' => $totalPages,
    'page' => $page,
]);
