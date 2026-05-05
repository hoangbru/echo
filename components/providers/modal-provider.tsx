"use client";

import { Fragment, useEffect, useState } from "react";
import { ConfirmModal, InfoModal, SuccessModal } from "../features/modals";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Fragment>
      {/* <ConfirmModal /> */}
      {/* <InfoModal /> */}
      {/* <SuccessModal /> */}
    </Fragment>
  );
};
