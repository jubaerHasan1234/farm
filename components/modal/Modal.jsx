"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const Modal = ({ children }) => {
  const modalRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (!modalRef.current?.open) {
      modalRef.current?.showModal();
    }
  }, []);

  function onHide() {
    router.back();
  }

  return createPortal(
    <dialog
      ref={modalRef}
      onClose={onHide}
      className="w-screen h-screen p-0 m-0 border-none  overflow-auto scrollbar-none bg-white mx-auto my-auto rounded-md dark:bg-gray-900 static"
    >
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <button
            onClick={onHide}
            className=" p-1 rounded-full hover:bg-teal-100 dark:hover:bg-teal-800 transition-colors absolute right-5 top-2 bg-green-300"
          >
            <Image src="/xmark.svg" alt="close" width={30} height={30} />
          </button>
          {children}
        </motion.div>
      </AnimatePresence>
    </dialog>,
    document.getElementById("modal-root-content")
  );
};

export default Modal;
