
it('should calculate the monthly rate correctly', function () {
  expect(calculateMonthlyPayment({amount: 50000, rate: 2, years: 12})).toEqual(390.84);
});

it("should return a result with 2 decimal places", function() {
  expect(calculateMonthlyPayment({amount: 50000, rate: 2, years: 12}).toString().split(".")[1].length).toEqual(2);
  expect(calculateMonthlyPayment({amount: 30000, rate: 5, years: 1}).toString().split(".")[1].length).toEqual(2);

  //throw a monthly payment of 0 - need to be caught in code
  //constricted years to <100 and loan amount minimum to 1000+
  expect(calculateMonthlyPayment({amount: 100000, rate: -200, years: 100}).toString().split(".")[1]).toEqual(undefined);
  expect(calculateMonthlyPayment({amount: 1, rate: 2, years: 100}).toString().split(".")[1]).toEqual(undefined);
});

describe('Returning a positive number for the Monthly Payment is Expected', function(){
  it("should return a positive number given non-zero Yearly Rate inputs", function(){
    expect(calculateMonthlyPayment({amount: 50000, rate: 2, years: 10}) > 0).toBe(true);
    expect(calculateMonthlyPayment({amount: 50000, rate: 1000, years: 5}) > 0).toBe(true);
    expect(calculateMonthlyPayment({amount: 50000, rate: -5, years: 20}) > 0).toBe(true);

    //errors thrown to catch 0 rate and non positive loan amounts and term in years
    expect(calculateMonthlyPayment({amount: 50000, rate: 0, years: 1}) > 0).toBe(false);
  });

  it("should return a positive number given positive Loan Amount inputs", function(){
    expect(calculateMonthlyPayment({amount: 50000, rate: 2, years: 10}) > 0).toBe(true);
    expect(calculateMonthlyPayment({amount: 1, rate: 1000, years: 5}) > 0).toBe(true);
    expect(calculateMonthlyPayment({amount: 1700000, rate: -5, years: 20}) > 0).toBe(true);

    //errors thrown to catch 0 rate and non positive loan amounts and term in years
    expect(calculateMonthlyPayment({amount: 0, rate: 2, years: 5}) > 0).toBe(false);
    expect(calculateMonthlyPayment({amount: -1000, rate: 2, years: 5}) > 0).toBe(false);
  });

  it("should return a positive number given positive Term in Year inputs", function(){
    expect(calculateMonthlyPayment({amount: 50000, rate: 2, years: 10}) > 0).toBe(true);
    expect(calculateMonthlyPayment({amount: 1, rate: 1000, years: 5}) > 0).toBe(true);
    expect(calculateMonthlyPayment({amount: 1700000, rate: -5, years: 20}) > 0).toBe(true);

    //errors thrown to catch 0 rate and non positive loan amounts and term in years
    expect(calculateMonthlyPayment({amount: 0, rate: 2, years: 0}) > 0).toBe(false);
    expect(calculateMonthlyPayment({amount: 1000, rate: 2, years: -5}) > 0).toBe(false);
    expect(calculateMonthlyPayment({amount: -1000, rate: 2, years: -5}) > 0).toBe(true);
  });
});
