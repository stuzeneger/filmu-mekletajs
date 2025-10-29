<?php
namespace App;

use GuzzleHttp\ClientInterface;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class OmdbClient
{
    private const DEFAULT_API_URL = 'http://www.omdbapi.com/';
    private const TYPE_MOVIE = 'movie';
    private const PLOT_FULL = 'full';

    private ClientInterface $http;
    private string $apiKey;
    private string $apiUrl;

    /**
     * @throws OmdbException
     */
    public function __construct(string $apiKey, ?ClientInterface $http = null, string $apiUrl = self::DEFAULT_API_URL)
    {
        if (empty($apiKey)) {
            throw new OmdbException('OMDb API key is required.');
        }

        $this->apiKey = $apiKey;
        $this->apiUrl = $apiUrl;
        $this->http = $http ?? new Client([
            'base_uri' => $this->apiUrl,
            'http_errors' => false,
        ]);
    }

    /**
     * @throws OmdbException
     */
    public function searchMovies(string $title, int $page = 1): array
    {
        return $this->request([
            's' => $title,
            'page' => $page,
            'type' => self::TYPE_MOVIE,
        ]);
    }

    /**
     * @throws OmdbException
     */
    public function getMovieByIMDBId(string $imdbId): array
    {
        return $this->request([
            'i' => $imdbId,
            'plot' => self::PLOT_FULL,
        ]);
    }

    /**
     * @param array<string, mixed> $queryParams
     * @return array<string, mixed>
     * @throws OmdbException
     */
    private function request(array $queryParams): array
    {
        $queryParams['apikey'] = $this->apiKey;

        try {
            $response = $this->http->request('GET', '', ['query' => $queryParams]);
        } catch (GuzzleException $e) {
            throw new OmdbException('HTTP request failed: ' . $e->getMessage(), 0, null, $e);
        }

        $body = (string)$response->getBody();
        $this->ensureSuccessfulResponse($response->getStatusCode(), $body);
        return $this->decodeJson($body, $response->getStatusCode());
    }

    /**
     * @throws OmdbException
     */
    private function ensureSuccessfulResponse(int $statusCode, string $body): void
    {
        if ($statusCode !== 200) {
            throw new OmdbException(
                'OMDb API returned status ' . $statusCode,
                $statusCode,
                json_decode($body, true)
            );
        }
    }

    /**
     * @param string $json
     * @param int|null $httpStatus
     * @return array<string, mixed>
     * @throws OmdbException
     */
    private function decodeJson(string $json, ?int $httpStatus = null): array
    {
        $data = json_decode($json, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new OmdbException(
                'Invalid JSON response: ' . json_last_error_msg(),
                $httpStatus,
                $data
            );
        }
        return $data;
    }
}
