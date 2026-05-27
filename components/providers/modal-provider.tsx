"use client";

import { Fragment, useEffect, useState } from "react";
import { Toaster } from "sonner";

import {
  ConfirmModal,
  InfoModal,
  SuccessModal,
  UpgradeModal,
} from "../shared/modals";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Fragment>
      <Toaster />

      {/* <ConfirmModal /> */}
      {/* <InfoModal /> */}
      {/* <SuccessModal /> */}
      <UpgradeModal />
    </Fragment>
  );
};
