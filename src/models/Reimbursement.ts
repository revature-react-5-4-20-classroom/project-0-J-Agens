export class Reimbursement {
    reimbursementId: number;
    author?: number;
    amount?: number;
    dateSubmitted?: number | string; // string for input
    dateResolved?: number;
    description?: string;
    resolver?: number; // foreign key
    status?: number; // foreign key 
    type?: number; // foreign key

    constructor(
        reimbursementId: number,
        author?: number,
        amount?: number,
        dateSubmitted?: number,
        dateResolved?: number,
        description?: string,
        resolver?: number,
        status?: number,
        type?: number
    ) {
        this.reimbursementId = reimbursementId;
        this.author = author;
        this.amount = amount;
        this.dateSubmitted = dateSubmitted;
        this.dateResolved = dateResolved;
        this.description = description;
        this.resolver = resolver;
        this.status = status;
        this.type = type;
    }
}