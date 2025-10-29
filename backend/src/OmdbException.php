<?php
namespace App;

use Exception;

class OmdbException extends Exception
{
    private ?int $httpStatus;
    private ?array $omdbResponse;

    public function __construct(
        string $message,
        ?int $httpStatus = 0,
        ?array $omdbResponse = [],
        ?Exception $previous = null
    ) {
        parent::__construct($message, 0, $previous);
        $this->httpStatus = $httpStatus;
        $this->omdbResponse = $omdbResponse;
    }

    public function getHttpStatus(): ?int
    {
        return $this->httpStatus;
    }

    public function getOmdbResponse(): ?array
    {
        return $this->omdbResponse;
    }
}
