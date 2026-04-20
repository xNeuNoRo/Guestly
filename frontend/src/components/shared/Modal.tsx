"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  DialogBackdrop,
} from "@headlessui/react";
import { IoClose } from "react-icons/io5";
import { useIsMounted } from "@/hooks/shared/useIsMounted";
import { ReactNode } from "react";

type ModalProps = {
  title: string;
  header?: ReactNode;
  size?: "small" | "medium" | "large";
  open: boolean;
  close: () => void;
  children: ReactNode;
};

const sizeClasses = {
  small: "max-w-md",
  medium: "max-w-2xl",
  large: "max-w-4xl",
};

export function Modal({
  title,
  header,
  size = "medium",
  open,
  close,
  children,
}: Readonly<ModalProps>) {
  const isMounted = useIsMounted();

  if (!isMounted) return null;

  return (
    <Dialog open={open} onClose={close} className="relative z-50">
      {/* Fondo oscuro con desenfoque. */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel
            transition
            className={`relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-2xl transition-all duration-300 ease-out data-closed:translate-y-4 data-closed:opacity-0 data-closed:sm:translate-y-0 data-closed:sm:scale-95`}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <DialogTitle
                  as="h3"
                  className="text-xl font-bold text-slate-900 truncate"
                >
                  {title}
                </DialogTitle>
                {header && <div>{header}</div>}
              </div>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <span className="sr-only">Cerrar modal</span>
                <IoClose className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Contenido inyectado */}
            <div className="mt-2 text-slate-600">{children}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
