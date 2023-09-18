export interface Faqs {
    id: number;
    question: string;
    answer: string;
}

export type Data = Faqs[] | {message: string}