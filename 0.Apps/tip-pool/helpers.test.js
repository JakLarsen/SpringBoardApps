describe ('Helpers Tests', function(){
    beforeEach(function () {
        // initialization logic
        billAmtInput.value = 100;
        tipAmtInput.value = 10;
      });
    
    it('should sum the total of billAmt properties for each object in allPayments on sumPaymentTotal(billAmt)', function(){
        submitPaymentInfo();
        expect(sumPaymentTotal('billAmt')).toEqual(100);
    });
    it('should sum the total of tipAmt properties for each object in allPayments on sumPaymentTotal(tipAmt)', function(){
        submitPaymentInfo();
        expect(sumPaymentTotal('tipAmt')).toEqual(10);
    });
    it('should calculate the tip percentage properly on calculateTipPercent()', function(){
        expect(calculateTipPercent(100, 10)).toEqual(10);
        expect(calculateTipPercent(100, 0)).toEqual(0);
        expect(calculateTipPercent(50, 50)).toEqual(100);

        //restrictions to catch in code
        expect(calculateTipPercent(0, 100)).toEqual(Infinity);
        expect(calculateTipPercent(-50, 50)).toEqual(-100);
        expect(calculateTipPercent(-50, -50)).toEqual(100);
        expect(calculateTipPercent(50, -50)).toEqual(-100);
    });

    afterEach(function() {
        // teardown logic
        for (let payment of paymentTrs){
            payment.remove();
          }
          allPayments = {};
      });
});