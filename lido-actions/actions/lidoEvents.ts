import { Context, TransactionEvent } from "@tenderly/actions";

import axios from "axios";

const subscribeLidoImportantEventsFn = async (
  context: Context,
  transactionEvent: TransactionEvent,
) => {
  const txHash = transactionEvent.hash;
  const network = transactionEvent.network;

  const bearerToken = await context.secrets.get("BEARER");
  const botToken = await context.secrets.get("BOT-TOKEN");
  const channelId = await context.secrets.get("CHANNEL-ID");

  const url = `https://api.tenderly.co/api/v1/public-contract/${network}/trace/${txHash}`;

  const tdlyTx = `https://www.tdly.co/tx/${network}/${txHash}`;

  const response = await axios.get(url, {
    headers: {
      authorization: `${bearerToken}`,
    },
  });

  const result = response.data;

  const validatorExitRequestLog = result.logs.find(
    (log: any) => log.name === "ValidatorExitRequest",
  );

  if (validatorExitRequestLog) {
    const stakingModuleId = validatorExitRequestLog.inputs.find(
      (input: any) => input.soltype.name === "stakingModuleId",
    )?.value;
    const nodeOperatorId = validatorExitRequestLog.inputs.find(
      (input: any) => input.soltype.name === "nodeOperatorId",
    )?.value;
    const timestamp = validatorExitRequestLog.inputs.find(
      (input: any) => input.soltype.name === "timestamp",
    )?.value;
    const validatorPubkey = validatorExitRequestLog.inputs.find(
      (input: any) => input.soltype.name === "validatorPubkey",
    )?.value;

    const rawTimestamp = Number(timestamp);
    const convertedTime = new Date(rawTimestamp * 1000); // Convert to milliseconds

    if (stakingModuleId == 1 && nodeOperatorId == 14) {
      console.log(
        `Condition met: stakingModuleId: ${stakingModuleId}, nodeOperatorId: ${nodeOperatorId}, validatorPubkey: ${validatorPubkey}, timestamp: ${convertedTime.toUTCString()}`,
      );

      const message = `*Condition met*

*stakingModuleId*: ${stakingModuleId}
*nodeOperatorId*: ${nodeOperatorId}
*validatorPubkey*: ${validatorPubkey}
*timestamp*: ${convertedTime.toUTCString()}
*transaction*: [txHash](${tdlyTx})
`;

      const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const payload = {
        chat_id: channelId,
        text: message,
        parse_mode: "markdown",
      };

      try {
        await axios.post(telegramApiUrl, payload);
        console.log("Message sent successfully.");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      console.log(
        `Condition not met: stakingModuleId: ${stakingModuleId}, nodeOperatorId: ${nodeOperatorId}, validatorPubkey: ${validatorPubkey}`,
      );
    }
  } else {
    console.log("No ValidatorExitRequest log found");
  }
};

module.exports = { subscribeLidoImportantEventsFn };
