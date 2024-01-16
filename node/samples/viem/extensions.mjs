/**
 * 
 * @param {*} client 
 * @returns 
 */
const withSimulate = (client) => ({
    /**
     * 
     * @param {import("viem").CallParameters} transaction 
     */
    async simulate(transaction){
      return client.request({
        method: "tenderly_simulateTransaction",
        params: transaction
      })
    }
  })