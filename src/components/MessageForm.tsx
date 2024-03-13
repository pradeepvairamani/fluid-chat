import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ConnectionState, IFluidContainer } from "fluid-framework";
import React from "react";
import { IUser } from "../definitions";
import { createAndSetPlainMessage, createAndSetPointerMessage } from "../fluid";
import { canWrite } from "../utils";
import { GenChatButton } from "./GenChatButton";
import { GenTrafficButton } from "./GenTrafficButton";

export interface IMessageFormProps {
  container: IFluidContainer | undefined;
  user: IUser;
  sliderValue: number;
}

export const MessageForm: React.FunctionComponent<IMessageFormProps> = (
  props: IMessageFormProps
) => {
  const [input, setInput] = React.useState<string>("");

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setInput(e.target.value);
  };
  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!props.container) {
      return;
    }

    const inputTrimmed = input.trim();
    if (props.container.connectionState === ConnectionState.Disconnected) {
      console.log("-- reconnecting to document --");
      props.container.connect();
    }

    createAndSetPlainMessage(props.container, props.user, inputTrimmed);

    setInput("");
  };

  const disableInputs = !canWrite(props.user);

  return (
    <form onSubmit={handleSubmit}>
      <GenTrafficButton currentUser={props.user} container={props.container} sliderValue={props.sliderValue} />
      <GenChatButton currentUser={props.user} container={props.container} />
      <input
        value={input}
        onChange={handleInput}
        placeholder="Send a message..."
        disabled={disableInputs}
      />
      <button type="submit" disabled={disableInputs}>
        <FontAwesomeIcon icon={["fas", "paper-plane"]} title="send message" />
        &nbsp;&nbsp;Send
      </button>
    </form>
  );
};
