"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoArrowBack,
  IoArrowForward,
  IoCheckmarkCircle,
  IoImageOutline,
  IoCloseCircle,
} from "react-icons/io5";

// Hooks
import { useQueryString } from "@/hooks/shared/useQueryString";
import { useCreateProperty } from "@/hooks/properties/useMutation";

// Componentes Átomos
import { Form } from "@/components/shared/form/Form";
import { InputField } from "@/components/shared/form/InputField";
import { Button } from "@/components/shared/Button";
import { Textarea } from "@/components/shared/Textarea";

// Esquemas
import {
  createPropertySchema,
  type CreatePropertyRequest,
} from "@/schemas/properties.schemas";
import { ROUTES } from "@/constants/routes";

const STEPS = [
  { id: 1, title: "Lo básico", description: "Título, ubicación y capacidad." },
  { id: 2, title: "Descripción", description: "Detalla tu alojamiento." },
  { id: 3, title: "Tarifas", description: "Precios y limpieza." },
  { id: 4, title: "Fotos", description: "Sube imágenes atractivas." },
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

export function CreatePropertyWizard() {
  const router = useRouter();
  const { createUrl, searchParams } = useQueryString();

  // --- Fuente de Verdad: URL ---
  const currentStep = Number(searchParams.get("step")) || 1;
  const [direction, setDirection] = useState(0);
  const [prevStepValue, setPrevStepValue] = useState(currentStep);

  // Sincronizamos la dirección de la animación con los cambios de la URL
  useEffect(() => {
    if (currentStep !== prevStepValue) {
      setDirection(currentStep > prevStepValue ? 1 : -1);
      setPrevStepValue(currentStep);
    }
  }, [currentStep, prevStepValue]);

  const isFirst = currentStep === 1;
  const isLast = currentStep === STEPS.length;

  const { mutate: createProperty, isPending } = useCreateProperty();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const form = useForm<CreatePropertyRequest>({
    resolver: zodResolver(createPropertySchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      location: "",
      description: "",
      capacity: 1,
      pricePerNight: 0,
      cleaningFee: 0,
    },
  });

  const selectedFiles = form.watch("images") as unknown as FileList;

  useEffect(() => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setPreviewUrls([]);
      return;
    }

    const objectUrls = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file),
    );
    setPreviewUrls(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [selectedFiles]);

  const nextStep = () => {
    router.push(createUrl({ step: currentStep + 1 }), { scroll: false });
  };

  const prevStep = () => {
    if (!isFirst) {
      router.push(createUrl({ step: currentStep - 1 }), { scroll: false });
    }
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof CreatePropertyRequest)[] = [];

    if (currentStep === 1) fieldsToValidate = ["title", "location", "capacity"];
    if (currentStep === 2) fieldsToValidate = ["description"];
    if (currentStep === 3) fieldsToValidate = ["pricePerNight", "cleaningFee"];

    const isStepValid = await form.trigger(fieldsToValidate);
    if (isStepValid) nextStep();
  };

  const onSubmit = (data: CreatePropertyRequest) => {
    createProperty(data, {
      onSuccess: () => {
        router.push(ROUTES.HOST.DASHBOARD);
      },
    });
  };

  // Lógica corregida para acumular imágenes sin reemplazar las anteriores
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files;
    if (!newFiles) return;

    const currentFiles = form.getValues("images") as unknown as FileList;
    const dataTransfer = new DataTransfer();

    if (currentFiles) {
      Array.from(currentFiles).forEach((file) => dataTransfer.items.add(file));
    }

    Array.from(newFiles).forEach((file) => dataTransfer.items.add(file));

    form.setValue("images", dataTransfer.files, { shouldValidate: true });

    // Reset para permitir volver a subir el mismo archivo si fue eliminado
    e.target.value = "";
  };

  const removeImage = (indexToRemove: number) => {
    const currentFiles = form.getValues("images") as unknown as FileList;
    if (!currentFiles) return;

    const dataTransfer = new DataTransfer();
    Array.from(currentFiles).forEach((file, i) => {
      if (i !== indexToRemove) dataTransfer.items.add(file);
    });

    form.setValue("images", dataTransfer.files, { shouldValidate: true });
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 z-10 relative">
        <div className="flex items-center gap-2 mb-2">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`h-2 flex-1 rounded-full transition-colors duration-500 ease-in-out ${
                step.id <= currentStep ? "bg-primary-600" : "bg-slate-200"
              }`}
            />
          ))}
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          {STEPS[currentStep - 1]?.title}
        </h2>
        <p className="text-sm text-slate-500">
          {STEPS[currentStep - 1]?.description}
        </p>
      </div>

      <Form
        form={form}
        onSubmit={onSubmit}
        className="flex flex-col flex-1 relative"
      >
        {/* Se quita el overflow-hidden y se ajusta el min-h para que el contenido fluya */}
        <div className="p-6 relative min-h-75">
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4 w-full"
              >
                <InputField
                  name="title"
                  label="Título del anuncio"
                  placeholder="Ej: Cabaña acogedora"
                />
                <InputField
                  name="location"
                  label="Ubicación"
                  placeholder="Ej: Jarabacoa"
                />
                <InputField
                  name="capacity"
                  label="Capacidad Máxima (Huéspedes)"
                  type="number"
                  min={1}
                  rules={{ valueAsNumber: true }}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4 w-full"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Descripción completa
                  </label>
                  <Textarea
                    {...form.register("description")}
                    placeholder="Describe los puntos fuertes de tu propiedad..."
                    rows={8}
                    error={form.formState.errors.description?.message}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-6 w-full"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InputField
                    name="pricePerNight"
                    label="Precio por Noche (USD)"
                    type="number"
                    min={0}
                    rules={{ valueAsNumber: true }}
                  />
                  <InputField
                    name="cleaningFee"
                    label="Tarifa de Limpieza (USD)"
                    type="number"
                    min={0}
                    rules={{ valueAsNumber: true }}
                  />
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="step-4"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-4 w-full"
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-slate-700">
                    Imágenes de la propiedad
                  </label>

                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors relative">
                    <IoImageOutline className="h-10 w-10 text-slate-400 mb-2" />
                    <p className="text-sm font-medium text-slate-900">
                      Haz clic para subir fotos
                    </p>
                    <p className="text-xs text-slate-500">
                      Selecciona múltiples imágenes (JPG, PNG)
                    </p>
                    <input
                      type="file"
                      multiple
                      accept="image/png, image/jpeg, image/webp"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleImageChange}
                    />
                  </div>

                  {form.formState.errors.images && (
                    <p className="text-sm text-red-600 font-medium text-center">
                      {form.formState.errors.images.message as string}
                    </p>
                  )}
                </div>

                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    {previewUrls.map((url, index) => (
                      <div
                        key={url}
                        className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group"
                      >
                        <Image
                          src={url}
                          alt={`Previsualización ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="150px"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 text-slate-800 bg-white/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-600 focus:outline-none"
                        >
                          <IoCloseCircle size={24} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 flex justify-between items-center bg-white z-10 relative mt-auto">
          <Button
            type="button"
            variant="ghost"
            onClick={prevStep}
            disabled={isFirst || isPending}
            leftIcon={<IoArrowBack />}
          >
            Atrás
          </Button>

          {isLast ? (
            <Button
              type="submit"
              isLoading={isPending}
              rightIcon={<IoCheckmarkCircle />}
            >
              Publicar Propiedad
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleNext}
              rightIcon={<IoArrowForward />}
            >
              Siguiente
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
