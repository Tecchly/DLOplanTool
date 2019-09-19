import { useState } from 'react';

const useProjectDialog = () => {
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen(!open);
  }

  return {
    open,
    toggle,
  }
};

export default useProjectDialog;