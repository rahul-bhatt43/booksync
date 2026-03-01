import React from "react";
import { AudiobookForm } from "./AudiobookForm";

export const AudiobookCreate: React.FC = () => {
    return <AudiobookForm isEditing={false} />;
};

export default AudiobookCreate;
