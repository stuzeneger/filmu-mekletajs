export class SearchValidator {
    minLength: number

    constructor(minLength = 3) {
        this.minLength = minLength
    }

    isValid(value: string): boolean {
        return value.trim().length >= this.minLength
    }
}

