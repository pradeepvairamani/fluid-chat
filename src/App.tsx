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
import { Slider } from "@mui/material";

export function App() {
  const user = React.useMemo(() => getCurrentUser(), []);
  const [document, setDocument] = React.useState<IFluidDocument>();
  const [sliderValue, setSliderValue] = React.useState<number>(100);

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

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setSliderValue(newValue as number);
  };

  return (
    <div className={`App`}>
      <main className="main-app">
        <nav className="toolbar">
          <ChatNavForm
            currentDocId={document?.id}
            onSubmit={navigateToDocument}
          />
          <div>Happiness slider</div>
          <Slider
            aria-label="Happiness"
            defaultValue={100}
            value={sliderValue}
            onChange={handleSliderChange}
            getAriaValueText={(valuetext: number, index: number): string => valuetext.toString()}
            valueLabelDisplay="auto"
            shiftStep={30}
            step={2}
            marks
            min={0}
            max={10}
            sx={{
              width: ['500%', '50%', '25%']
              // color: 'success.main',
            }}
          />
          <UserForm user={user} />
        </nav>
        <div className="chat">
          <MessagesDisplay container={document?.container} user={user} />
          <MessageForm container={document?.container} user={user} sliderValue={sliderValue}/>
        </div>
      </main>
    </div>
  );
}
