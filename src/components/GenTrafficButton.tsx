import { v4 as uuid } from "uuid";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IFluidContainer } from "fluid-framework";
import { IUser } from "../definitions";
import { createAndSetPlainMessage, createAndSetPointerMessage } from "../fluid";
import {
  canWrite,
  generateLargeMessage,
  generateLoremIpsumMessage,
  getRandomUser,
} from "../utils";
import { OpenAIClientProvider } from "../utils/openAiClientProvider";
import { chatContentMap } from "../utils/chatContent";

export interface IGenTrafficButtonProps {
  currentUser: IUser;
  container: IFluidContainer;
  sliderValue: number;
}

export const GenTrafficButton: React.FunctionComponent<
  IGenTrafficButtonProps
> = (props) => {
  console.log("Slider value: ", props.sliderValue);
  const [working, setWorking] = React.useState<boolean>(false);

  React.useEffect(() => {
    const generateTraffic = async (): Promise<void> => {
      if (!working) {
        return;
      }

      const openaiclient = new OpenAIClientProvider();
      const currentUser = props.currentUser;
      const newUser: IUser = { id: uuid(), temp: true, permissions: [] };

      try {
        // const chatContent = await openaiclient.submitContent("generate a friendly chat with a customer service agent with alternate sentences by the agent and the customer.");

      const delay = (ms: number): Promise<void> => {
        return new Promise(resolve => setTimeout(resolve, ms));
      };

      const extractMessage = (input: string): string => {
        const indexOfColon = input.indexOf(":");
      
        if (indexOfColon !== -1) {
          // Extract the message content after ":"
          return input.slice(indexOfColon + 1).trim();
        }
      
        // Return the message as it is if ":" does not exist
        return input.trim();
      }

      const chatContent = chatContentMap[props.sliderValue];
      console.log(chatContent);

      for (let i = 0; i < chatContent.length; i++) {
        createAndSetPlainMessage(props.container, i%2 ? currentUser: newUser, extractMessage(chatContent[i]));
        await delay(300);
      }
      } catch (error) {
        console.error("Error generating traffic:", error);
      }
    };

    generateTraffic();
  }, [props.container, props.currentUser, working]);


  const handleToggleGenTraffic: React.MouseEventHandler<HTMLButtonElement> = (
    e
  ) => {
    setWorking(!working);
  };

  const disableInputs = !canWrite(props.currentUser);

  return (
    <button
      type="button"
      onClick={handleToggleGenTraffic}
      disabled={disableInputs}
    >
      <FontAwesomeIcon
        icon={["fas", working ? "circle-stop" : "circle-play"]}
        title="toggle traffic generation"
      />
      &nbsp;&nbsp;Gen Traffic
    </button>
  );
};

