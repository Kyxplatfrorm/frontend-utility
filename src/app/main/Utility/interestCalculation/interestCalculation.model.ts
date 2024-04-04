import { InstallmentEntity } from "app/ui/utility";

export class Calculation {
    TnaAmount: number;
    InterestRate: number;
    BsmvRate: number;
    KkdfRate: number;
    InstallCount: number;
    TransactionDate: any;
    DueDate: any;
    TotalTnaAmount: number;
    TotalInterestAmount: number;
    InstallmentList: Array<InstallmentEntity>;
    images: {
        default: boolean;
        id: string;
        url: string;
        type: string;
    }[];

    /**
     * Constructor
     *
     * @param calculation
     */
    constructor(calculation?) {
        calculation = calculation || {};
        this.TnaAmount = calculation.TnaAmount;
        this.InterestRate = calculation.InterestRate;
        this.BsmvRate = calculation.BsmvRate;
        this.KkdfRate = calculation.KkdfRate;
        this.InstallCount = calculation.InstallCount;
        this.TransactionDate = calculation.TransactionDate;
        this.DueDate = calculation.DueDate;
        this.TotalTnaAmount = calculation.TotalTnaAmount;
        this.TotalInterestAmount = calculation.TotalInterestAmount;
        this.InstallmentList = calculation.InstallmentList;
        this.images = calculation.images || [];
    }
}
