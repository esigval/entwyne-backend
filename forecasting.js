class PPCForecastingModel {
    constructor({
        initialPPC,
        budget,
        pricePerCredit,
        visitorToTrialConversionRate,
        trialToPaidConversionRate,
        churnRate,
        creditsPerMonth,
        months,
        initialInvestment,
        maxLTV
    }) {
        this.ppc = initialPPC;
        this.budget = budget;
        this.pricePerCredit = pricePerCredit;
        this.visitorToTrialConversionRate = visitorToTrialConversionRate;
        this.trialToPaidConversionRate = trialToPaidConversionRate;
        this.churnRate = churnRate;
        this.creditsPerMonth = creditsPerMonth;
        this.months = months;
        this.initialInvestment = initialInvestment;
        this.maxLTV = maxLTV;
        this.revenue = [];
        this.profit = [];
        this.investments = [initialInvestment];
        this.clicks = [];
        this.trials = [];
        this.paidCustomers = [];
        this.totalPaidUsers = 0; // To track cumulative paid users
    }

    calculateMonthlyClicks(investment) {
        return Math.max(investment / this.ppc, 0);
    }

    calculateTrialUsers(visitors) {
        return Math.max(visitors * this.visitorToTrialConversionRate, 0);
    }

    calculatePaidUsers(trialUsers) {
        return Math.max(trialUsers * this.trialToPaidConversionRate, 0);
    }

    calculateChurnedUsers(paidUsers) {
        return Math.max(paidUsers * this.churnRate, 0);
    }

    calculateMonthlyRevenue(paidUsers) {
        return Math.max(paidUsers * this.creditsPerMonth * this.pricePerCredit, 0);
    }

    forecast() {
        for (let month = 0; month < this.months; month++) {
            let currentInvestment = Math.max(this.investments[month], 0);
            let clicks = this.calculateMonthlyClicks(currentInvestment);
            let trialUsers = this.calculateTrialUsers(clicks);
            let newPaidUsers = this.calculatePaidUsers(trialUsers);
            let churnedUsers = this.calculateChurnedUsers(this.totalPaidUsers);

            this.totalPaidUsers = Math.max(this.totalPaidUsers + newPaidUsers - churnedUsers, 0);

            let monthlyRevenue = this.calculateMonthlyRevenue(this.totalPaidUsers);
            let monthlyProfit = monthlyRevenue - currentInvestment;

            // Ensure LTV cap is considered
            let ltv = monthlyRevenue / (this.totalPaidUsers || 1); // Prevent division by zero
            if (ltv > this.maxLTV) {
                monthlyRevenue = this.maxLTV * this.totalPaidUsers;
                monthlyProfit = monthlyRevenue - currentInvestment;
            }

            this.revenue.push(monthlyRevenue);
            this.profit.push(monthlyProfit);
            this.clicks.push(clicks);
            this.trials.push(trialUsers);
            this.paidCustomers.push(this.totalPaidUsers);

            // Reinvest profit in the next month
            this.investments.push(Math.max(monthlyProfit, 0));
        }
    }

    getResults() {
        return {
            revenue: this.revenue,
            profit: this.profit,
            investments: this.investments,
            clicks: this.clicks,
            trials: this.trials,
            paidCustomers: this.paidCustomers
        };
    }
}

// Example usage:
const model = new PPCForecastingModel({
    initialPPC: 2,
    budget: 5000,
    pricePerCredit: 2,
    visitorToTrialConversionRate: 0.05,
    trialToPaidConversionRate: 0.1,
    churnRate: 0.02,
    creditsPerMonth: 100,
    months: 12,
    initialInvestment: 5000,
    maxLTV: 1200
});

model.forecast();
console.log(model.getResults());
