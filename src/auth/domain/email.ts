export default class Email {
    constructor(
        public readonly id: string,
        public readonly email: string,
        public readonly role: string,
        public readonly hasUser: boolean
    ) {}
}
