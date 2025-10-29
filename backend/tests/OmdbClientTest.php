<?php

namespace Tests;

use App\OmdbClient;
use App\OmdbException;
use PHPUnit\Framework\TestCase;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\StreamInterface;
use GuzzleHttp\ClientInterface;

class OmdbClientTest extends TestCase
{
    private function createMockClient(string $responseBody, int $statusCode = 200): ClientInterface
    {
        $stream = $this->createMock(StreamInterface::class);
        $stream->method('__toString')->willReturn($responseBody);

        $response = $this->createMock(ResponseInterface::class);
        $response->method('getBody')->willReturn($stream);
        $response->method('getStatusCode')->willReturn($statusCode);

        $client = $this->createMock(ClientInterface::class);
        $client->method('request')->willReturn($response);

        return $client;
    }

    public function testConstructWithoutApiKeyThrowsException()
    {
        $this->expectException(OmdbException::class);
        new OmdbClient('');
    }

    /**
     * @throws OmdbException
     */
    public function testSearchMoviesReturnsArray()
    {
        $mockResponse = json_encode(['Search' => [['Title' => 'Test Movie']]]);
        $client = $this->createMockClient($mockResponse);

        $omdb = new OmdbClient('dummykey', $client);
        $result = $omdb->searchMovies('Test');

        $this->assertIsArray($result);
        $this->assertArrayHasKey('Search', $result);
        $this->assertEquals('Test Movie', $result['Search'][0]['Title']);
    }

    /**
     * @throws OmdbException
     */
    public function testGetMovieByIMDBIdReturnsArray()
    {
        $mockResponse = json_encode(['Title' => 'Test Movie', 'imdbID' => 'tt1234567']);
        $client = $this->createMockClient($mockResponse);

        $omdb = new OmdbClient('dummykey', $client);
        $result = $omdb->getMovieByIMDBId('tt1234567');

        $this->assertIsArray($result);
        $this->assertEquals('Test Movie', $result['Title']);
        $this->assertEquals('tt1234567', $result['imdbID']);
    }

    /**
     * @throws OmdbException
     */
    public function testRequestThrowsOmdbExceptionOnHttpError()
    {
        $client = $this->createMockClient('{"error":"Bad request"}', 500);
        $omdb = new OmdbClient('dummykey', $client);

        try {
            $omdb->searchMovies('Test');
            $this->fail('Expected OmdbException not thrown');
        } catch (OmdbException $e) {
            $this->assertEquals(500, $e->getHttpStatus());
            $this->assertArrayHasKey('error', $e->getOmdbResponse());
        }
    }

    /**
     * @throws OmdbException
     */
    public function testRequestThrowsOmdbExceptionOnInvalidJson()
    {
        $client = $this->createMockClient('invalid-json');
        $omdb = new OmdbClient('dummykey', $client);

        try {
            $omdb->searchMovies('Test');
            $this->fail('Expected OmdbException not thrown');
        } catch (OmdbException $e) {
            $this->assertEquals(200, $e->getHttpStatus());
            $this->assertNull($e->getOmdbResponse()); // decodeJson atgriež null JSON kļūdas gadījumā
            $this->assertStringContainsString('Invalid JSON response', $e->getMessage());
        }
    }
}
