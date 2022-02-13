export default class Task {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly description: string,
        public readonly status: string,
        public readonly dateFrom: string,
        public readonly dateTo: string,
        public readonly color: number,
        public readonly members: Array<string>
    ) {}
}
