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
        // 
        const chatContent = [
          "Customer: Hi there! I'm having trouble logging into my account. Can you help me?",
          "Agent: Of course, I'll be happy to help you. Can you please provide me with your username or email address associated with your account?",
          "Customer: Yes, my username is johndoe123.",
          "Agent: Thank you for providing your username, John. Can you also confirm your date of birth or the last four digits of your social security number for verification?",
          "Customer: Sure! My date of birth is January 1st, 1980.",
          "Agent: Thank you for verifying your information. Please allow me a moment while I access your account to see what the issue might be.",
          "Customer: No problem! I appreciate your help.",
          "Agent: It looks like your account may be locked due to an incorrect password being entered multiple times. I can assist you in resetting your password and unlocking your account if that's okay with you?",
          "Customer: Yes, that would be great. Thank you!",
          "Agent: Perfect, I will send a password reset link to your email address on file. Can you please confirm the email on file for me?",
          "Customer: Yes, it's johndoe123@gmail.com.",
          "Agent: Great, I just sent you an email with instructions on how to reset your password. Please follow the steps in the email and let me know if you have any issues or if you need further assistance.",
          "Customer: Okay, will do. Thank you so much for your help!",
          "Agent: You're welcome, John. I'm glad I could assist you today. Don't hesitate to reach out if you need further assistance in the future. Have a great day!"
      ]
      console.log(chatContent);

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

