describe('Payments tests (with setup and tear down)', function(){

    beforeEach(function () {
        // initialization logic
        billAmtInput.value = 100;
        tipAmtInput.value = 10;
      });

    it('should add a new payment to allPayments on submitPaymentInfo()', function(){
        submitPaymentInfo();
        expect(Object.keys(allPayments).length).toEqual(1);
        expect(parseFloat(allPayments['payment' + paymentId].billAmt)).toEqual(100);
        expect(parseFloat(allPayments['payment'+ paymentId].tipAmt)).toEqual(10);
    })

    it('should properly return the object parameters (to update) allPayments on createCurPayment()', function() {
        let objectReturned = createCurPayment();
        expect(parseFloat(objectReturned.billAmt)).toEqual(100);
        expect(parseFloat(objectReturned.tipAmt)).toEqual(10);

        submitPaymentInfo();
        expect(parseFloat(allPayments['payment' + paymentId].billAmt)).toEqual(100);
        expect(parseFloat(allPayments['payment'+ paymentId].tipAmt)).toEqual(10);
    });
    it('creates a new tr in the correct place: table body with id = paymentTBody; using appendPaymentTable() called from submitPaymentInfo()', function () {
        submitPaymentInfo();
    
        for(let payment of paymentTrs){
          expect(payment.parentElement.id).toEqual('paymentTBody');
        }
      });
    afterEach(function() {
        // teardown logic
        for (let payment of paymentTrs){
            payment.remove();
          }
          allPayments = {};
          paymentId = 0;
      });

});

