var Calculator = artifacts.require("./Calculator.sol");

contract('Calculator', function (accounts) {
  it("shouldn't allow division by zero", async function () {
    let error;
    const fail = await Calculator.new();
    try {
      await fail.div(5, 0);
    } catch (e) {
      console.log(e);
      error = e;
    }

    assert.isDefined(error, "No exception thrown during divison");
    assert.isTrue(error.message.search("revert") >= 0, "Expected transaction revert");
  });
});