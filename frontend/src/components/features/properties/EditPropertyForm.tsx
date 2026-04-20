"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoSaveOutline,
  IoArrowBackOutline,
  IoInformationCircleOutline,
  IoCashOutline,
  IoImagesOutline,
} from "react-icons/io5";

import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";
import { PropertyImageManager } from "./PropertyImageManager";

import {
  updatePropertySchema,
  type UpdatePropertyRequest,
  type PropertyResponse,
} from "@/schemas/properties.schemas";
import { useUpdateProperty } from "@/hooks/properties";
import { ROUTES } from "@/constants/routes";
import { useQueryString } from "@/hooks/shared/useQueryString";

interface EditPropertyFormProps {
  property: PropertyResponse;
}

const TABS = [
  {
    id: "basic",
    label: "Información",
    icon: <IoInformationCircleOutline size={20} />,
  },
  { id: "pricing", label: "Precios", icon: <IoCashOutline size={20} /> },
  { id: "images", label: "Fotos", icon: <IoImagesOutline size={20} /> },
] as const;

// Variantes para una transición elegante entre pestañas
const tabContentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

export function EditPropertyForm({
  property,
}: Readonly<EditPropertyFormProps>) {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();
  const { mutate: updateProperty, isPending } = useUpdateProperty();

  // --- Fuente de Verdad: URL ---
  const activeTab =
    (searchParams.get("tab") as (typeof TABS)[number]["id"]) || "basic";

  const form = useForm<UpdatePropertyRequest>({
    resolver: zodResolver(updatePropertySchema),
    defaultValues: {
      title: property.title,
      location: property.location,
      description: property.description,
      capacity: property.capacity,
      pricePerNight: property.pricePerNight,
      cleaningFee: property.cleaningFee,
      imagesToDelete: [],
    },
  });

  const onSubmit = (data: UpdatePropertyRequest) => {
    updateProperty(
      { id: property.id, request: data },
      {
        onSuccess: () => {
          router.push(ROUTES.HOST.PROPERTIES);
        },
      },
    );
  };

  const handleTabChange = (tabId: string) => {
    router.push(createUrl({ tab: tabId }), { scroll: false });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Navegación de Pestañas Persistente */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => handleTabChange(tab.id)}
            className={`relative flex-1 flex hover:cursor-pointer items-center justify-center gap-2 py-3 text-sm font-bold transition-all rounded-xl ${
              activeTab === tab.id
                ? "text-white"
                : "text-slate-500 hover:bg-slate-50"
            }`}
          >
            {/* Fondo animado para la pestaña activa */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 bg-primary-600 rounded-xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10">{tab.icon}</span>
            <span className="relative z-10 hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <Form form={form} onSubmit={onSubmit} className="space-y-6">
        <AnimatePresence mode="wait">
          {/* SECCIÓN 1: Información Principal */}
          {activeTab === "basic" && (
            <motion.section
              key="basic-tab"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
            >
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Información General
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  name="title"
                  label="Título del anuncio"
                  placeholder="Ej: Villa frente al mar"
                />
                <InputField name="location" label="Ubicación" />
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-slate-700 mb-1.5 block">
                    Descripción
                  </label>
                  <Textarea
                    {...form.register("description")}
                    rows={8}
                    error={form.formState.errors.description?.message}
                  />
                </div>
              </div>
            </motion.section>
          )}

          {/* SECCIÓN 2: Capacidad y Tarifas */}
          {activeTab === "pricing" && (
            <motion.section
              key="pricing-tab"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
            >
              <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4">
                Precios y Capacidad
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <InputField
                  name="capacity"
                  label="Capacidad"
                  type="number"
                  rules={{ valueAsNumber: true }}
                />
                <InputField
                  name="pricePerNight"
                  label="Precio/Noche (USD)"
                  type="number"
                  rules={{ valueAsNumber: true }}
                />
                <InputField
                  name="cleaningFee"
                  label="Limpieza (USD)"
                  type="number"
                  rules={{ valueAsNumber: true }}
                />
              </div>
            </motion.section>
          )}

          {/* SECCIÓN 3: Gestión de Imágenes */}
          {activeTab === "images" && (
            <motion.section
              key="images-tab"
              variants={tabContentVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6"
            >
              <div className="flex flex-col gap-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Fotos de la propiedad
                </h3>
                <p className="text-sm text-slate-500">
                  Gestiona las fotos actuales o sube nuevas.
                </p>
              </div>

              <PropertyImageManager existingImages={property.imageUrls} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Barra de Acciones Fija */}
        <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
            leftIcon={<IoArrowBackOutline />}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            isLoading={isPending}
            leftIcon={<IoSaveOutline />}
            className="px-10"
          >
            Guardar cambios
          </Button>
        </div>
      </Form>
    </div>
  );
}
