"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { IoCompassOutline, IoHomeOutline } from "react-icons/io5";

import { Button } from "@/components/shared/Button";
import { ROUTES } from "@/constants/routes";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 overflow-hidden relative">
      {/* Círculos decorativos de fondo animados */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-50 z-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.1 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
          className="absolute w-full h-full border border-primary-300 rounded-full"
        />
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 0.8, opacity: 0.2 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
          className="absolute w-[600px] h-[600px] border border-primary-400 rounded-full"
        />
        <motion.div
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: 0.6, opacity: 0.3 }}
          transition={{ duration: 2, ease: "easeOut", delay: 0.6 }}
          className="absolute w-[400px] h-[400px] border border-primary-500 rounded-full bg-primary-50"
        />
      </div>

      {/* Contenido Central */}
      <div className="max-w-2xl w-full text-center relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 mb-8 inline-flex"
        >
          <IoCompassOutline className="text-primary-600 animate-pulse" size={48} />
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="text-[8rem] md:text-[12rem] font-black text-slate-900 leading-none tracking-tighter"
        >
          404
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mt-4 mb-3">
            Parece que te has perdido...
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-lg mx-auto mb-10">
            La página que estás buscando no existe o ha sido movida. No te
            preocupes, hay muchos otros destinos esperándote.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto"
        >
          <Link href={ROUTES.PUBLIC.HOME} className="w-full sm:w-auto">
            <Button
              size="lg"
              variant="outline"
              className="w-full bg-white rounded-full h-14 px-8"
              leftIcon={<IoHomeOutline size={20} />}
            >
              Volver al inicio
            </Button>
          </Link>
          <Link href={ROUTES.USER.EXPLORE} className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full rounded-full h-14 px-8 shadow-lg shadow-primary-500/25"
              leftIcon={<IoCompassOutline size={20} />}
            >
              Explorar destinos
            </Button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}