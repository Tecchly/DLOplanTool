import { useState } from 'react';

const useSettingsDialog = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);

  function toggleSettings() {
    setSettingsOpen(!settingsOpen);
  }

  return {
    settingsOpen,
    toggleSettings,
  }
};

export default useSettingsDialog;