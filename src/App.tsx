import React from "react";
import {
  MessagesDisplay,
  UserForm,
  MessageForm,
  ThemeToggle,
  Menu,
  Help,
  ConnectionTimer,
  ChatNavForm,
  FluidLogo,
} from "./components";
import { IFluidDocument } from "./definitions";
import { getFluidData } from "./fluid";
import {
  getCurrentUser,
  getDocumentIdFromUrl,
  setDocumentIdInUrl,
} from "./utils";

export function App() {
  const user = React.useMemo(() => getCurrentUser(), []);
  const [document, setDocument] = React.useState<IFluidDocument>();

  const navigateToDocument = (id?: string | "new"): void => {
    const docId = id === "new" ? undefined : id ?? getDocumentIdFromUrl();
    getFluidData(docId).then((fluidDocument) => {
      setDocument(fluidDocument);
    });
  };

  React.useEffect(() => {
    navigateToDocument();
  }, []);

  React.useEffect(() => {
    setDocumentIdInUrl(document?.id ?? "");
  }, [document?.id]);

  return (
    <div className={`App`}>
      <main className="main-app">
        <nav className="toolbar">
          <ChatNavForm
            currentDocId={document?.id}
            onSubmit={navigateToDocument}
          />
          <UserForm user={user} />
        </nav>
        <div className="chat">
          <MessagesDisplay container={document?.container} user={user} />
          <MessageForm container={document?.container} user={user} />
        </div>
      </main>
    </div>
  );
}
