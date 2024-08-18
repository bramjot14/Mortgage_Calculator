import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "secrets",
  password: "Chauhan@123",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
    res.render('index', { 
        cmhcInsurance: null, 
        insuredMortgage: null, 
        payment: null, 
        paymentFrequency: 'Monthly', // Default value
        downPaymentPercentage: null, 
        price: null, 
        amortization: 25, // Default value
        mortgageRate: 4.29, // Default value 
        error: null 
    });
});

app.post('/calculate', (req, res) => {
    const price = parseFloat(req.body.price);
    const downPaymentPercentage = parseFloat(req.body.down_payment);
    const amortization = parseInt(req.body.amortization);
    const mortgageRate = parseFloat(req.body.mortgage_rate) / 100;
    const paymentFrequency = req.body.payment_frequency;

    console.log(`Received input - Price: ${price}, Down Payment: ${downPaymentPercentage}, Amortization: ${amortization}, Mortgage Rate: ${mortgageRate}, Payment Frequency: ${paymentFrequency}`);

    if (isNaN(price) || isNaN(downPaymentPercentage) || isNaN(amortization) || isNaN(mortgageRate)) {
        console.error("Invalid input data");
        return res.status(400).send("Invalid input data");
    }

    const downPayment = (downPaymentPercentage / 100) * price;

    // CMHC Down Payment Validation
    let minimumDownPayment;
    let minimumDownPaymentPercentage;

    if (price <= 500000) {
        minimumDownPayment = 0.05 * price;
        minimumDownPaymentPercentage = 5;
    } else if (price > 500000 && price < 1000000) {
        minimumDownPayment = (0.05 * 500000) + (0.10 * (price - 500000));
        minimumDownPaymentPercentage = (minimumDownPayment / price) * 100;
    } else {
        minimumDownPayment = 0.20 * price;
        minimumDownPaymentPercentage = 20;
    }

    console.log(`Calculated Minimum Down Payment: ${minimumDownPayment}`);

    if (downPayment < minimumDownPayment) {
        console.warn(`Down payment is less than the minimum required: ${minimumDownPaymentPercentage.toFixed(2)}%`);
        return res.render('index', {
            cmhcInsurance: null,
            insuredMortgage: null,
            payment: null,
            paymentFrequency,
            downPaymentPercentage,
            price,
            amortization,
            mortgageRate: req.body.mortgage_rate,
            error: `The minimum down payment for a property of $${price.toFixed(2)} is ${minimumDownPaymentPercentage.toFixed(2)}%. Please increase your down payment.`
        });
    }

    const totalMortgage = price - downPayment;
    const cmhcInsurance = calculateCMHCInsurance(totalMortgage, price, downPayment);
    const insuredMortgage = totalMortgage + cmhcInsurance;

    console.log(`CMHC Insurance: ${cmhcInsurance}, Insured Mortgage: ${insuredMortgage}`);

    let numPayments;
    let paymentRate;

    switch(paymentFrequency) {
        case "Bi-weekly":
            numPayments = amortization * 26;
            paymentRate = mortgageRate / 26;
            break;
        case "Weekly":
            numPayments = amortization * 52;
            paymentRate = mortgageRate / 52;
            break;
        case "Annually":
            numPayments = amortization;
            paymentRate = mortgageRate;
            break;
        default:
            numPayments = amortization * 12;
            paymentRate = mortgageRate / 12;
    }

    const payment = calculateMortgage(insuredMortgage, numPayments, paymentRate);

    console.log(`Calculated Payment: ${payment}`);

    res.render('index', { 
        cmhcInsurance, 
        insuredMortgage, 
        payment, 
        paymentFrequency, 
        downPaymentPercentage, 
        downPayment,
        price, 
        amortization, 
        mortgageRate: req.body.mortgage_rate, 
        error: null 
    });
});


function calculateMortgage(insuredMortgage, numPayments, paymentRate) {
    return (insuredMortgage * paymentRate * Math.pow(1 + paymentRate, numPayments)) / 
           (Math.pow(1 + paymentRate, numPayments) - 1);
}

function calculateCMHCInsurance(totalMortgage, price, downPayment) {
    const downPaymentPercentage = (downPayment / price) * 100;
    let insuranceRate = 0;

    if (downPaymentPercentage < 5) {
        throw new Error("Minimum down payment is 5%");
    } else if (downPaymentPercentage >= 5 && downPaymentPercentage < 10) {
        insuranceRate = 4.00;
    } else if (downPaymentPercentage >= 10 && downPaymentPercentage < 15) {
        insuranceRate = 3.10;
    } else if (downPaymentPercentage >= 15 && downPaymentPercentage < 20) {
        insuranceRate = 2.80;
    } else {
        return 0; // No insurance required if down payment is 20% or more
    }
    
    return (insuranceRate / 100) * totalMortgage;
}

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});